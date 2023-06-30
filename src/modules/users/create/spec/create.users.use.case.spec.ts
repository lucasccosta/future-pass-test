import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../services/users.service';
import { CreateUsersUseCase } from '../create.users.use.case';
import { PrismaService } from 'src/config/db/prisma.service';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('CreateUsersUseCase', () => {
  let useCase: CreateUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CreateUsersUseCase, PrismaService],
    }).compile();

    useCase = module.get<CreateUsersUseCase>(CreateUsersUseCase);
  });

  it('should create a user', async () => {
    const userData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await useCase.execute(userData);

    expect(response.username).toBe(userData.username);
    expect(response.email).toBe(userData.email);
  });

  it('should throw ConflictException because user was already created', () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await useCase.execute(userData);

      await useCase.execute(userData);
    }).rejects.toThrow(ConflictException);
  });

  it('should thrown UnprocessableEntityException by passing empty username', () => {
    expect(async () => {
      const userData = {
        username: '',
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await useCase.execute(userData);

      await useCase.execute(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });

  it('should thrown UnprocessableEntityException by passing empty email', () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: '',
        password: faker.internet.password(),
      };

      await useCase.execute(userData);

      await useCase.execute(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });

  it('should thrown UnprocessableEntityException by passing password with less than 8 characters', () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: '',
      };

      await useCase.execute(userData);

      await useCase.execute(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });
});
