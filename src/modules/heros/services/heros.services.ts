import { Injectable } from '@nestjs/common';
import { heros, user_heros } from '@prisma/client';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class HerosService {
  constructor(private prisma: PrismaService) {}
  herosModel = this.prisma.heros;
  userHerosModel = this.prisma.user_heros;

  async addToFavorites({ userId, heroId }): Promise<user_heros> {
    return await this.userHerosModel.create({
      data: {
        user_id: userId,
        hero_id: heroId,
      },
    });
  }

  async removeFromFavorites({ heroId }): Promise<string> {
    const favoriteHero = await this.findFavoriteHeroExternalId({ heroId });
    await this.userHerosModel.delete({ where: { id: favoriteHero.id } });
    return 'Hero removed as favorite';
  }

  async findFavoriteHeroExternalId({ heroId }): Promise<user_heros> {
    return await this.userHerosModel.findFirst({
      where: { hero_id: heroId },
    });
  }

  // async findHeroByExternalId({ externalId }): Promise<heros> {
  async findHeroByExternalId({ externalId }): Promise<any> {
    return await this.herosModel.findFirst({
      where: {
        external_id: externalId,
      },
      include: {
        user_heros: {
          include: {
            users: {},
          },
        },
      },
    });
  }

  async createHero(heroData): Promise<heros> {
    return await this.herosModel.create({
      data: {
        external_id: heroData.external_id,
        name: heroData.name,
        description: heroData.description,
      },
    });
  }
}
