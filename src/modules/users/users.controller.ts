import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
