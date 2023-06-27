import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Cache } from 'cache-manager';
import 'dotenv/config';

type HerosResponse = {
  offset: number;
  total: number;
  herosList: {
    id: number;
    name: string;
    description: string;
  }[];
};

@Injectable()
export class MarvelProvider {
  private marvelUrl: AxiosInstance;

  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.marvelUrl = axios.create({
      baseURL: process.env.MARVEL_URL,
    });
  }

  async getHeros(name: string) {
    const heroFoundOnCache = await this.searchCachedHeros(name);
    if (heroFoundOnCache) return heroFoundOnCache;

    try {
      const apiResponse = await this.getHerosByApi(0);

      let heroFound = this.findHero(apiResponse.data.results, name);

      const herosApiObjectData = {
        total: apiResponse.data.total,
        offset: apiResponse.data.offset,
        herosList: [...apiResponse.herosList],
      };

      if (heroFound || apiResponse.data.offset == 100) {
        await this.cacheManager.set('cached_heros', herosApiObjectData, 0);
        return heroFound;
      }
      while (!heroFound || apiResponse.data.total >= apiResponse.data.offset) {
        const result = await this.getHerosByApi(herosApiObjectData.offset);

        herosApiObjectData.herosList.push(...result.herosList);
        herosApiObjectData.offset = result.data.offset + 100;
        await this.cacheManager.set('cached_heros', herosApiObjectData, 0);

        heroFound = this.findHero(result.data.results, name);

        if (heroFound) return heroFound;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  private async getHerosByApi(offset) {
    const result = await this.marvelUrl.get(
      `/characters?ts=${process.env.MARVEL_TIMESTAMP}&apikey=${process.env.MARVEL_PUBLIC_KEY}&hash=${process.env.MARVEL_HASH}&offset=${offset}`,
    );
    const { data } = result.data;

    const herosList = this.formatHerosResults(data.results);

    return {
      data,
      herosList,
    };
  }

  private async searchCachedHeros(heroName: string) {
    const herosResponse: HerosResponse = await this.cacheManager.get(
      'cached_heros',
    );
    if (!herosResponse) return;
    const hero = herosResponse.herosList.find((hero) => {
      return this.formatName(hero.name).includes(this.formatName(heroName));
    });
    return hero;
  }

  private formatName(name) {
    return name.replace(/\s/g, '').toLowerCase();
  }

  private formatHerosResults(heros) {
    return heros.map((hero) => {
      return {
        id: hero.id,
        name: hero.name,
        description: hero.description,
      };
    });
  }

  private findHero(heros, name) {
    return heros.find((hero) =>
      this.formatName(hero.name).includes(this.formatName(name)),
    );
  }
}
