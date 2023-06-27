import { Module } from '@nestjs/common';
import { MarvelProvider } from '../provider/marvel.provider';
import { SearchMarvelHerosController } from './marvel/search/search.marvel.heros.controller';
import { SearchMarvelHerosUseCase } from './marvel/search/search.marvel.heros.use.case';
import { HttpModule } from '@nestjs/axios';
import { AddOrRemoveFavoriteHeroController } from './marvel/favorite/add.or.remove.favorite.hero.controller';
import { UsersModule } from '../users/users.module';
import { AddOrRemoveFavoriteHeroUseCase } from './marvel/favorite/add.or.remove.favorite.hero.use.case';
import { HerosService } from './services/heros.services';
import { PrismaService } from 'src/config/db/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, UsersModule, CacheModule.register()],
  controllers: [SearchMarvelHerosController, AddOrRemoveFavoriteHeroController],
  providers: [
    MarvelProvider,
    SearchMarvelHerosUseCase,
    AddOrRemoveFavoriteHeroUseCase,
    HerosService,
    PrismaService,
  ],
})
export class HerosModule {}
