import { Injectable } from '@nestjs/common';
import { MarvelProvider } from 'src/modules/provider/marvel.provider';

@Injectable()
export class SearchMarvelHerosUseCase {
  constructor(private marvelProvider: MarvelProvider) {}

  async execute(name: string) {
    return await this.marvelProvider.getHeroes(name);
  }
}
