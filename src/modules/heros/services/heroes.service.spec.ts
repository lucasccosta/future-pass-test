import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/config/db/prisma.service';
import { HeroesService } from './heroes.services';
import { faker } from '@faker-js/faker';

describe('HeroesService', () => {
  let heroesService: HeroesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroesService, PrismaService],
    }).compile();

    heroesService = module.get<HeroesService>(HeroesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await prismaService.user_heros.deleteMany({});
    await prismaService.heros.deleteMany({});
  });

  describe('addToFavorites', () => {
    it('should add a hero to favorites successfully', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero = await prismaService.heros.create({
        data: {
          external_id: 15616,
          name: faker.person.firstName(),
          description: faker.lorem.text(),
        },
      });

      const result = await heroesService.addToFavorites({
        userId: user.id,
        heroId: hero.external_id,
      });

      expect(result).toBeDefined();
      expect(result.user_id).toEqual(user.id);
      expect(result.hero_id).toEqual(hero.external_id);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a hero from favorites successfully', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero = await prismaService.heros.create({
        data: {
          external_id: 5890,
          name: faker.person.firstName(),
          description: faker.lorem.text(),
        },
      });
      await heroesService.addToFavorites({
        userId: user.id,
        heroId: hero.external_id,
      });

      const result = await heroesService.removeFromFavorites({
        heroId: hero.external_id,
      });

      expect(result).toEqual('Hero removed as favorite');
    });
  });

  describe('findFavoriteHeroExternalId', () => {
    it('should find a favorite hero by heroId successfully', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero = await prismaService.heros.create({
        data: {
          external_id: 9885,
          name: faker.person.firstName(),
          description: faker.lorem.text(),
        },
      });
      await heroesService.addToFavorites({
        userId: user.id,
        heroId: hero.external_id,
      });

      const result = await heroesService.findFavoriteHeroExternalId({
        heroId: hero.external_id,
      });

      expect(result).toBeDefined();
      expect(result.hero_id).toEqual(hero.external_id);
    });
  });

  describe('findHeroByExternalId', () => {
    it('should find a hero by externalId successfully', async () => {
      const hero = await prismaService.heros.create({
        data: {
          external_id: 8956,
          name: faker.person.firstName(),
          description: faker.lorem.text(),
        },
      });
      const result = await heroesService.findHeroByExternalId({
        externalId: hero.external_id,
      });

      expect(result).toBeDefined();
      expect(result.external_id).toEqual(hero.external_id);
      expect(result.name).toEqual(hero.name);
      expect(result.description).toEqual(hero.description);
    });
  });

  describe('createHero', () => {
    it('should create a hero successfully', async () => {
      const heroData = {
        external_id: 659,
        name: 'Superman',
        description: 'The Man of Steel',
      };

      const result = await heroesService.createHero(heroData);

      expect(result).toBeDefined();
      expect(result.external_id).toEqual(heroData.external_id);
      expect(result.name).toEqual(heroData.name);
      expect(result.description).toEqual(heroData.description);
    });
  });
});
