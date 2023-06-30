import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MarvelProvider } from './marvel.provider';
import { Cache } from 'cache-manager';

describe('MarvelProvider', () => {
  let marvelProvider: MarvelProvider;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarvelProvider,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    marvelProvider = module.get<MarvelProvider>(MarvelProvider);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await cacheManager.del;
  });

  describe('getHeroes', () => {
    it('should return a cached hero if found in the cache', async () => {
      const cachedHero = {
        id: 1,
        name: 'Iron Man',
        description: 'Genius billionaire playboy philanthropist',
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce({
        offset: 0,
        total: 1,
        heroes: [cachedHero],
      });

      const result = await marvelProvider.getHeroes('Iron Man');

      expect(result).toEqual(cachedHero);
      expect(cacheManager.get).toHaveBeenCalledWith('cached_heroes');
    });

    it('should fetch heroes from the API and return the found hero', async () => {
      const apiResponse = {
        data: {
          offset: 100,
          total: 2,
          results: [
            {
              id: 1,
              name: 'Iron Man',
              description: 'Genius billionaire playboy philanthropist',
            },
            {
              id: 2,
              name: 'Captain America',
              description: 'Super soldier and leader of the Avengers',
            },
          ],
        },
        heroes: [
          {
            id: 1,
            name: 'Iron Man',
            description: 'Genius billionaire playboy philanthropist',
          },
          {
            id: 2,
            name: 'Captain America',
            description: 'Super soldier and leader of the Avengers',
          },
        ],
      };

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest
        .spyOn(marvelProvider, 'getHeroes')
        .mockResolvedValueOnce(apiResponse.heroes[0]);

      const result = await marvelProvider.getHeroes('Iron Man');

      expect(result).toEqual(apiResponse.heroes[0]);
      expect(marvelProvider.getHeroes).toHaveBeenCalledWith('Iron Man');
    });

    it('should fetch heroes from the API and return "Hero not found" if the desired hero is not found', async () => {
      jest
        .spyOn(marvelProvider, 'getHeroes')
        .mockResolvedValueOnce('Hero not found');

      const result = await marvelProvider.getHeroes('Hulk');

      expect(result).toEqual('Hero not found');
    });

    it('should fetch heroes from the API in multiple requests and return the found hero', async () => {
      const apiResponse1 = {
        data: {
          offset: 0,
          total: 3,
          results: [
            {
              id: 1,
              name: 'Iron Man',
              description: 'Genius billionaire playboy philanthropist',
            },
            {
              id: 2,
              name: 'Captain America',
              description: 'Super soldier and leader of the Avengers',
            },
          ],
        },
        heroes: [
          {
            id: 1,
            name: 'Iron Man',
            description: 'Genius billionaire playboy philanthropist',
          },
          {
            id: 2,
            name: 'Captain America',
            description: 'Super soldier and leader of the Avengers',
          },
        ],
      };
      const apiResponse2 = {
        data: {
          offset: 2,
          total: 3,
          results: [
            { id: 3, name: 'Hulk', description: 'Big green angry monster' },
          ],
        },
        heroes: [
          { id: 3, name: 'Hulk', description: 'Big green angry monster' },
        ],
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest
        .spyOn(marvelProvider, 'getHeroes')
        .mockResolvedValueOnce(apiResponse2.heroes[0]);

      const result = await marvelProvider.getHeroes('Hulk');

      expect(result).toEqual(apiResponse2.heroes[0]);
      expect(marvelProvider.getHeroes).toBeCalledTimes(1);
      expect(marvelProvider.getHeroes).toHaveBeenCalledWith('Hulk');
    });
  });
});
