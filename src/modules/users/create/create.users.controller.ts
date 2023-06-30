import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUsersUseCase } from './create.users.use.case';
import { Public } from 'src/infra/middlewares/auth/define.public.routes';

@Controller('create/users')
export class CreateUsersController {
  constructor(private readonly createUsersUseCase: CreateUsersUseCase) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const userCreated = await this.createUsersUseCase.execute(createUserDto);
      return userCreated;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException();
      }
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException();
      }
      throw new NotFoundException();
    }
  }
}
