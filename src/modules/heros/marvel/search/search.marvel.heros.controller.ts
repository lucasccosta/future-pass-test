import {
  Body,
  Controller,
  HttpException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SearchMarvelHerosUseCase } from './search.marvel.heros.use.case';
import { SearchDTO } from '../dto/heros.dtos';
import { Public } from 'src/infra/middlewares/auth/define.public.routes';

@Controller('search/heros')
export class SearchMarvelHerosController {
  constructor(
    private readonly searchMarvelHerosUseCase: SearchMarvelHerosUseCase,
  ) {}

  @Public()
  @Post()
  create(@Body() data: SearchDTO) {
    try {
      const { name } = data;
      const heroSearched = this.searchMarvelHerosUseCase.execute(name);
      return heroSearched;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new HttpException(error.message, error.status);
    }
  }
}
