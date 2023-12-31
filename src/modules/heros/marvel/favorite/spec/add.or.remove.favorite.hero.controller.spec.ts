import { AddOrRemoveFavoriteHeroUseCase } from '../add.or.remove.favorite.hero.use.case';
import { HeroesService } from 'src/modules/heros/services/heroes.services';
import { PrismaService } from 'src/config/db/prisma.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { AddOrRemoveFavoriteHeroController } from '../add.or.remove.favorite.hero.controller';

describe('SearchMarvelHerosUseCase', () => {
  let controller: AddOrRemoveFavoriteHeroController;
  let useCase: AddOrRemoveFavoriteHeroUseCase;
  let heroesService: HeroesService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    heroesService = new HeroesService(prismaService);
    usersService = new UsersService(prismaService);
    useCase = new AddOrRemoveFavoriteHeroUseCase(usersService, heroesService);
    controller = new AddOrRemoveFavoriteHeroController(useCase);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await prismaService.user_heros.deleteMany({});
    await prismaService.heros.deleteMany({});
    await prismaService.users.deleteMany({});
  });

  describe('execute', () => {
    it('should remove the hero to favorites if the user has already favorited it before', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero = await prismaService.heros.create({
        data: {
          external_id: faker.number.int({ max: 10000 }),
          name: faker.person.firstName(),
          description: '',
        },
      });

      await prismaService.user_heros.create({
        data: {
          hero_id: hero.external_id,
          user_id: user.id,
        },
      });

      const result = await controller.handle({
        heroId: hero.external_id,
        userId: user.id,
        description: hero.description,
        name: hero.name,
      });
      const getUser = await usersService.findByEmail(user.email);

      expect(result).toEqual('Hero removed as favorite');
      expect(getUser.heros).toEqual([]);
    });

    it('should add the hero to favorites if the user has not favorited it before', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero = await prismaService.heros.create({
        data: {
          external_id: faker.number.int({ max: 10000 }),
          name: faker.person.firstName(),
          description: '',
        },
      });

      const userBeforeFavoriteHero = await usersService.findByEmail(user.email);
      expect(userBeforeFavoriteHero.heros).toEqual([]);

      await controller.handle({
        heroId: hero.external_id,
        userId: user.id,
        description: hero.description,
        name: hero.name,
      });

      const userAfterFavoriteHero = await usersService.findByEmail(user.email);

      expect(userAfterFavoriteHero.heros).toHaveLength(1);
      expect(userAfterFavoriteHero.heros[0].external_id).toEqual(
        hero.external_id,
      );
    });
    it('should throw error when heroId param is missing', async () => {
      expect(async () => {
        await controller.handle({
          heroId: null,
          userId: 'any',
          description: '',
          name: 'any',
        });
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
