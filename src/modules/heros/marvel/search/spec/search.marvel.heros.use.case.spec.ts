import { SearchMarvelHerosUseCase } from '../search.marvel.heros.use.case';
import { MarvelProvider } from 'src/modules/provider/marvel.provider';
import { Cache } from 'cache-manager';
import { heroesDto } from '../../dto/heros.dtos';

describe('SearchMarvelHerosUseCase', () => {
  let useCase: SearchMarvelHerosUseCase;
  let marvelProvider: MarvelProvider;
  let cacheManager: Cache;

  beforeEach(() => {
    marvelProvider = new MarvelProvider(cacheManager);
    useCase = new SearchMarvelHerosUseCase(marvelProvider);
  });

  describe('execute', () => {
    it('should return the heroes matching the provided name', async () => {
      const hero: heroesDto = { id: 1, name: 'Iron Man', description: '' };
      jest.spyOn(marvelProvider, 'getHeroes').mockResolvedValue(hero);

      const searchName = 'Iron';

      const result = await useCase.execute(searchName);

      expect(marvelProvider.getHeroes).toHaveBeenCalledTimes(1);
      expect(marvelProvider.getHeroes).toHaveBeenCalledWith(searchName);
      expect(result).toEqual(hero);
    });

    it('should return an empty array if no heroes match the provided name', async () => {
      jest
        .spyOn(marvelProvider, 'getHeroes')
        .mockImplementation(async () => 'Hero not Found');

      const searchName = 'Hulk';

      const result = await useCase.execute(searchName);

      expect(marvelProvider.getHeroes).toHaveBeenCalledTimes(1);
      expect(marvelProvider.getHeroes).toHaveBeenCalledWith(searchName);
      expect(result).toEqual('Hero not Found');
    });
  });
});
