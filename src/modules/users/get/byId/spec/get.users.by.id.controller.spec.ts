import { HttpException, NotFoundException } from '@nestjs/common';
import { SearchMarvelHerosController } from '../search.marvel.heros.controller';
import { SearchMarvelHerosUseCase } from '../search.marvel.heros.use.case';
import { heroesDto } from '../../dto/heros.dtos';
import { MarvelProvider } from 'src/modules/provider/marvel.provider';
import { Cache } from 'cache-manager';

describe('SearchMarvelHerosController', () => {
  let controller: SearchMarvelHerosController;
  let useCase: SearchMarvelHerosUseCase;
  let marvelProvider: MarvelProvider;
  let cacheManager: Cache;

  beforeEach(() => {
    marvelProvider = new MarvelProvider(cacheManager);
    useCase = new SearchMarvelHerosUseCase(marvelProvider);
    controller = new SearchMarvelHerosController(useCase);
  });

  it('should call the search use case and return the result', async () => {
    const searchDTO = { name: 'Iron Man' };
    const hero: heroesDto = { id: 1, name: 'Iron Man', description: '' };
    jest.spyOn(useCase, 'execute').mockImplementation(async () => hero);

    const result = await controller.create(searchDTO);

    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith(searchDTO.name);
    expect(result).toBe(hero);
  });

  it('should throw a NotFoundException if the hero is not found', async () => {
    const searchDTO = { name: 'Hulk' };
    jest.spyOn(useCase, 'execute').mockImplementation(async () => {
      throw new NotFoundException();
    });

    await expect(controller.create(searchDTO)).rejects.toThrow(
      NotFoundException,
    );
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith(searchDTO.name);
  });

  it('should throw an HttpException with the error message and status', async () => {
    const searchDTO = { name: 'Iron Man' };
    const errorMessage = 'Some error message';
    const errorStatus = 500;
    const error = new HttpException(errorMessage, errorStatus);
    (error as any).status = errorStatus;
    jest.spyOn(useCase, 'execute').mockImplementation(async () => {
      throw new HttpException(errorMessage, errorStatus);
    });

    await expect(controller.create(searchDTO)).rejects.toThrow(HttpException);
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith(searchDTO.name);
  });
});
