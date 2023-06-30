import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/config/db/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.users.deleteMany({});
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'password123',
      };

      const result = await usersService.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.username).toEqual(createUserDto.username);
      expect(result.email).toEqual(createUserDto.email);
      expect(result.password).toEqual(createUserDto.password);
    });

    it('should throw a ConflictException when creating a user with an existing email', async () => {
      const existingUser = await usersService.create({
        username: 'existing.user',
        email: 'existing.user@example.com',
        password: 'password123',
      });

      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        email: existingUser.email,
        password: 'password123',
      };

      await expect(usersService.create(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'password123',
      };

      await usersService.create(createUserDto);

      const result = await usersService.findAll();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].username).toEqual(createUserDto.username);
      expect(result[0].email).toEqual(createUserDto.email);
      expect(result[0].password).toEqual(createUserDto.password);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'password123',
      };

      const createdUser = await usersService.create(createUserDto);

      const result = await usersService.findByEmail(createdUser.email);

      expect(result).toBeDefined();
      expect(result.id).toEqual(createdUser.id);
      expect(result.email).toEqual(createdUser.email);
      expect(result.password).toEqual(createdUser.password);
      expect(result.username).toEqual(createdUser.username);
    });
  });

  describe('findById', () => {
    it('should find a user by id successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'password123',
      };

      const createdUser = await usersService.create(createUserDto);

      const result = await usersService.findById(createdUser.id);

      expect(result).toBeDefined();
      expect(result.id).toEqual(createdUser.id);
      expect(result.email).toEqual(createdUser.email);
      expect(result.password).toEqual(createdUser.password);
      expect(result.username).toEqual(createdUser.username);
    });
  });
});
