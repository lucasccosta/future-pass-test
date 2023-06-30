import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { AddOrRemoveFavoriteHeroDto } from '../dto/heros.dtos';
import { HeroesService } from '../../services/heroes.services';
import { user_heros } from '@prisma/client';

@Injectable()
export class AddOrRemoveFavoriteHeroUseCase {
  constructor(
    private usersService: UsersService,
    private heroesService: HeroesService,
  ) {}

  async execute(
    data: AddOrRemoveFavoriteHeroDto,
  ): Promise<user_heros | string> {
    if (!data.heroId) throw new NotFoundException(`Missing hero id param`);
    try {
      const user = await this.usersService.findById(data.userId);
      if (!user)
        throw new NotFoundException(
          `User with id: ${data.userId} does not exist`,
        );

      const userHero = user.getHero(data.heroId);
      if (userHero) {
        return await this.heroesService.removeFromFavorites({
          heroId: userHero.external_id,
        });
      }

      const heroExists = await this.heroesService.findHeroByExternalId({
        externalId: data.heroId,
      });

      if (!heroExists) {
        const heroCreated = await this.heroesService.createHero({
          external_id: data.heroId,
          name: data.name,
          description: data.description,
        });
        return await this.heroesService.addToFavorites({
          userId: user.id,
          heroId: heroCreated.external_id,
        });
      }

      return await this.heroesService.addToFavorites({
        userId: user.id,
        heroId: heroExists.external_id,
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error);
    }
  }
}
