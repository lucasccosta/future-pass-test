import { UnprocessableEntityException } from '@nestjs/common';
import { UserDomain, UserDomainDTO } from '../user';
import { faker } from '@faker-js/faker';

describe('UserDomain', () => {
  let user: UserDomain;

  beforeEach(() => {
    const userDTO: UserDomainDTO = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      heros: [],
    };
    user = new UserDomain(userDTO);
  });

  describe('constructor', () => {
    it('should create a user with provided properties', () => {
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password');
      expect(user.heros).toEqual([]);
    });

    it('should throw an exception if username is not provided', () => {
      const userDTO: UserDomainDTO = {
        email: 'test@example.com',
        username: '',
        password: 'password',
        heros: [],
      };
      expect(() => new UserDomain(userDTO)).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw an exception if email is not provided', () => {
      const userDTO: UserDomainDTO = {
        username: 'testuser',
        password: 'password',
        email: '',
        heros: [],
      };
      expect(() => new UserDomain(userDTO)).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw an exception if password is less than 8 characters', () => {
      const userDTO: UserDomainDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'pass',
        heros: [],
      };
      expect(() => new UserDomain(userDTO)).toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getHero', () => {
    it('should return the hero with the specified external id', () => {
      user = new UserDomain({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        heros: [
          {
            id: faker.string.uuid(),
            external_id: 1,
            name: 'Hero 1',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: faker.string.uuid(),
            external_id: 2,
            name: 'Hero 2',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: faker.string.uuid(),
            external_id: 3,
            name: 'Hero 3',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      const hero = user.getHero(2);

      expect(hero).toEqual({
        id: user.heros[1].id,
        external_id: 2,
        name: 'Hero 2',
        description: '',
        createdAt: user.heros[1].createdAt,
        updatedAt: user.heros[1].updatedAt,
      });
    });

    it('should return undefined if hero with the specified external id is not found', () => {
      const hero = user.getHero(10);

      expect(hero).toBeUndefined();
    });
  });

  describe('encryptPassword', () => {
    it('should encrypt the user password', () => {
      const originalPassword = user.password;
      user.encryptPassword();

      expect(user.password).not.toBe(originalPassword);
    });
  });
});
