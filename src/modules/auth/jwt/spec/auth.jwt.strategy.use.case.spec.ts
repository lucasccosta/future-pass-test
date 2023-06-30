import { PrismaService } from 'src/config/db/prisma.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { faker } from '@faker-js/faker';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJWTStrategyUseCase } from '../auth.jwt.strategy.use.case';
import { CreateUsersUseCase } from 'src/modules/users/create/create.users.use.case';

describe('SearchMarvelHerosUseCase', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let useCase: AuthJWTStrategyUseCase;
  let createUsersUseCase: CreateUsersUseCase;

  beforeEach(() => {
    prismaService = new PrismaService();
    usersService = new UsersService(prismaService);
    jwtService = new JwtService();
    createUsersUseCase = new CreateUsersUseCase(usersService);
    useCase = new AuthJWTStrategyUseCase(usersService, jwtService);
  });

  describe('execute', () => {
    it('should remove the hero to favorites if the user has already favorited it before', async () => {
      const password = faker.internet.password();
      const user = await createUsersUseCase.execute({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: password,
      });

      const result = await useCase.execute({
        email: user.email,
        password: password,
      });

      expect(result.userId).toBe(user.id);
      expect(result).toHaveProperty('access_token');
    });

    it('should throw error when password is incorrect', async () => {
      expect(async () => {
        const user = await prismaService.users.create({
          data: {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
          },
        });
        await useCase.execute({
          email: user.email,
          password: 'different-password',
        });
      }).rejects.toThrow(UnauthorizedException);
    });
    it('should throw error when heroId param is missing', async () => {
      expect(async () => {
        await useCase.execute({
          email: 'not-found',
          password: 'password',
        });
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
