import { UsersService } from 'src/modules/users/services/users.service';
import { GetUsersByIdUseCase } from '../get.users.by.id.use.case';
import { PrismaService } from 'src/config/db/prisma.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('GetUsersByIdUseCase', () => {
  let usersService: UsersService;
  let useCase: GetUsersByIdUseCase;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    usersService = new UsersService(prismaService);
    useCase = new GetUsersByIdUseCase(usersService);
  });

  describe('execute', () => {
    it('should return the user and its favorite heros', async () => {
      const user = await prismaService.users.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });
      const hero1 = await prismaService.heros.create({
        data: {
          external_id: faker.number.int({ max: 10000 }),
          name: faker.person.firstName(),
          description: '',
        },
      });
      const hero2 = await prismaService.heros.create({
        data: {
          external_id: faker.number.int({ max: 10000 }),
          name: faker.person.firstName(),
          description: '',
        },
      });

      await prismaService.user_heros.create({
        data: {
          hero_id: hero1.external_id,
          user_id: user.id,
        },
      });
      await prismaService.user_heros.create({
        data: {
          hero_id: hero2.external_id,
          user_id: user.id,
        },
      });

      const result = await useCase.execute(user.id);

      expect(result.user).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      expect(result.favoriteHeros).toHaveLength(2);
      expect(result.favoriteHeros).toEqual([hero1, hero2]);
    });

    it('should throw NotFoundException', async () => {
      expect(async () => {
        await useCase.execute('1');
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
