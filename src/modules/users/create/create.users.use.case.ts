import { UserDomain } from '../domain/user';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUsersUseCase {
  constructor(private usersService: UsersService) {}

  async execute(userParams: CreateUserDto) {
    console.log('userParams: ', userParams);
    const userAlreadyExists = await this.usersService.findByEmail(
      userParams.email,
    );
    console.log('existe: ', userAlreadyExists);
    if (userAlreadyExists) {
      throw new ConflictException('User Already exists');
    }

    console.log('passou');
    const user = new UserDomain({
      username: userParams.username,
      email: userParams.email,
      password: bcrypt.hashSync(userParams.password, 8),
    });
    console.log('user: ', user);
    return await this.usersService.create(user);
  }
}
