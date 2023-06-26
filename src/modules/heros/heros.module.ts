import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { User } from './entities/user.model';
import { MarvelProvider } from '../provider/marvel.provider';
import { SearchMarvelHerosController } from './marvel/search/search.marvel.heros.controller';
import { SearchMarvelHerosUseCase } from './marvel/search/search.marvel.heros.use.case';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SequelizeModule.forFeature([]), HttpModule],
  controllers: [SearchMarvelHerosController],
  providers: [MarvelProvider, SearchMarvelHerosUseCase],
})
export class HerosModule {}
