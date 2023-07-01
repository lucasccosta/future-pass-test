import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Cache } from 'cache-manager';
import 'dotenv/config';
import { HeroesResponse, heroesDto } from '../heros/marvel/dto/heros.dtos';

@Injectable()
export class MarvelProvider {
  private marvelUrl: AxiosInstance;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.marvelUrl = axios.create({
      baseURL: process.env.MARVEL_URL,
    });
  }

  async getHeroes(name: string): Promise<heroesDto | string> {
    const cachedHero: heroesDto = await this.searchCachedHeroes(name);
    if (cachedHero) return cachedHero;

    try {
      const apiResponse = await this.getHeroesByApi(0);

      const { results, offset, total } = apiResponse.data;

      const heroesApiObjectData = {
        total: total,
        offset: offset,
        heroes: [...apiResponse.heroes],
      };

      let heroFound = this.findHero(results, name);
      if (heroFound || offset == 100) {
        await this.cacheManager.set('cached_heroes', heroesApiObjectData, 0);
        return heroFound;
      }
      // while (!heroFound || total >= offset) {
      while (!heroFound) {
        const result = await this.getHeroesByApi(heroesApiObjectData.offset);

        heroesApiObjectData.heroes.push(...result.heroes);
        heroesApiObjectData.offset += result.data.count;

        heroFound = this.findHero(result.data.results, name);
        if (heroFound || result.data.offset >= total) break;
      }

      await this.cacheManager.set('cached_heroes', heroesApiObjectData, 0);

      if (heroFound) return heroFound;
      return 'Hero not found';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  private async getHeroesByApi(offset: number) {
    const { MARVEL_TIMESTAMP, MARVEL_PUBLIC_KEY, MARVEL_HASH } = process.env;
    const result = await this.marvelUrl.get(
      `/characters?ts=${MARVEL_TIMESTAMP}&apikey=${MARVEL_PUBLIC_KEY}&hash=${MARVEL_HASH}&offset=${offset}&limit=100`,
    );
    const { data } = result.data;

    const heroes = this.formatHeroesResults(data.results);

    return {
      data,
      heroes,
    };
  }

  private async searchCachedHeroes(heroName: string) {
    const heroesResponse: HeroesResponse = await this.cacheManager.get(
      'cached_heroes',
    );
    if (!heroesResponse) return;
    const hero = heroesResponse.heroes.find((hero) => {
      return this.formatName(hero.name).includes(this.formatName(heroName));
    });
    return hero;
  }

  private formatName(name) {
    return name.replace(/\s/g, '').toLowerCase();
  }

  private formatHeroesResults(heroes) {
    return heroes.map((hero) => {
      return {
        id: hero.id,
        name: hero.name,
        description: hero.description,
      };
    });
  }

  private findHero(heroes, name) {
    return heroes.find((hero) =>
      this.formatName(hero.name).includes(this.formatName(name)),
    );
  }
}
