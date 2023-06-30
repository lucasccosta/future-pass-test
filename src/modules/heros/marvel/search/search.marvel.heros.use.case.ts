import { Injectable } from '@nestjs/common';
import { MarvelProvider } from 'src/modules/provider/marvel.provider';
import { heroesDto } from '../dto/heros.dtos';

@Injectable()
export class SearchMarvelHerosUseCase {
  constructor(private marvelProvider: MarvelProvider) {}

  async execute(name: string): Promise<heroesDto | string> {
    return await this.marvelProvider.getHeroes(name);
  }
}
