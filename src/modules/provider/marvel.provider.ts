import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import 'dotenv/config';
import { Md5 } from 'ts-md5';

@Injectable()
export class MarvelProvider {
  private marvelUrl: AxiosInstance;

  constructor(private httpService: HttpService) {
    this.marvelUrl = axios.create({
      baseURL: process.env.MARVEL_URL,
    });
  }

  async getHeros(name) {
    const timestamp = Date.now();
    console.log('time: ', timestamp);
    console.log('publicKey: ', process.env.MARVEL_PUBLIC_KEY);
    const hash = Md5.hashStr(
      `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`,
    );
    const hash1 = Md5.hashStr(
      `${timestamp}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`,
      true,
    );
    try {
      const result = await this.marvelUrl.get(
        // `/characters?ts=1&apikey=42963ac31450c06bff2ef303659ca606&hash=c322378cb26ef1fee74f780b1ee6e0df&limit=100&offset=100`,
        `/characters?ts=1&apikey=42963ac31450c06bff2ef303659ca606&hash=c322378cb26ef1fee74f780b1ee6e0df&offset=100`,
      );
      const { data: responseData } = result.data;
      const heroFound = responseData.results.find((hero) => hero.name === name);
      if (heroFound) return heroFound;
      while (!heroFound) {
        // repete a busca com offset +100
      }
    } catch (error) {
      console.log(error);
    }
  }
}
