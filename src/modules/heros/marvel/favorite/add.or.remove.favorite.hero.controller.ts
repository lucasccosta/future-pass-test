import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AddOrRemoveFavoriteHeroUseCase } from './add.or.remove.favorite.hero.use.case';
import { AddOrRemoveFavoriteHeroDto } from '../dto/heros.dtos';

@Controller()
export class AddOrRemoveFavoriteHeroController {
  constructor(
    private readonly addOrRemoveFavoriteHeroUseCase: AddOrRemoveFavoriteHeroUseCase,
  ) {}

  @Post('hero/favorite')
  handle(@Body() data: AddOrRemoveFavoriteHeroDto) {
    try {
      const favoriteHero = this.addOrRemoveFavoriteHeroUseCase.execute(data);
      return favoriteHero;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      }
      throw new NotFoundException();
    }
  }
}
