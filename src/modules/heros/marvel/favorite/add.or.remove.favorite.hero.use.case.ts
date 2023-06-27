import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { AddOrRemoveFavoriteHeroDto } from '../dto/heros.dtos';
import { HerosService } from '../../services/heros.services';

@Injectable()
export class AddOrRemoveFavoriteHeroUseCase {
  constructor(
    private usersService: UsersService,
    private herosService: HerosService,
  ) {}

  async execute(data: AddOrRemoveFavoriteHeroDto): Promise<any> {
    try {
      const user = await this.usersService.findById(data.userId);
      if (!user)
        throw new NotFoundException(
          `User with id: ${data.userId} does not exist`,
        );

      const userHero = user.getHero(data.heroId);
      console.log('user: ', userHero);
      if (userHero) {
        return await this.herosService.removeFromFavorites({
          heroId: userHero.external_id,
        });
      }

      const heroExists = await this.herosService.findHeroByExternalId({
        externalId: data.heroId,
      });

      if (!heroExists) {
        const heroCreated = await this.herosService.createHero({
          external_id: data.heroId,
          name: data.name,
          description: data.description,
        });
        return await this.herosService.addToFavorites({
          userId: user.id,
          heroId: heroCreated.external_id,
        });
      }

      return await this.herosService.addToFavorites({
        userId: user.id,
        heroId: heroExists.external_id,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
