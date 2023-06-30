import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../services/users.service';
import { CreateUsersController } from '../create.users.controller';
import { PrismaService } from 'src/config/db/prisma.service';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUsersUseCase } from '../create.users.use.case';

describe('CreateUsersController', () => {
  let controller: CreateUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUsersController],
      providers: [UsersService, CreateUsersUseCase, PrismaService],
    }).compile();

    controller = module.get<CreateUsersController>(CreateUsersController);
  });

  it('should create a user', async () => {
    const userData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await controller.create(userData);

    expect(response.username).toBe(userData.username);
    expect(response.email).toBe(userData.email);
  });

  it('should throw ConflictException because user was already created', async () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await controller.create(userData);

      await controller.create(userData);
    }).rejects.toThrow(ConflictException);
  });

  it('should thrown UnprocessableEntityException by passing empty username', () => {
    expect(async () => {
      const userData = {
        username: '',
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await controller.create(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });

  it('should thrown UnprocessableEntityException by passing empty email', () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: '',
        password: faker.internet.password(),
      };

      await controller.create(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });

  it('should thrown UnprocessableEntityException by passing password with less than 8 characters', () => {
    expect(async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: '',
      };

      await controller.create(userData);
    }).rejects.toThrow(UnprocessableEntityException);
  });
});
