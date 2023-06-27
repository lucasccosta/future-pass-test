import { UserDomain } from '../domain/user';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUsersUseCase {
  constructor(private usersService: UsersService) {}

  async execute(userParams: CreateUserDto) {
    const userAlreadyExists = await this.usersService.findByEmail(
      userParams.email,
    );
    if (userAlreadyExists) {
      throw new ConflictException('User Already exists');
    }

    const user = new UserDomain({
      username: userParams.username,
      email: userParams.email,
      password: bcrypt.hashSync(userParams.password, 8),
    });
    return await this.usersService.create(user);
  }
}
