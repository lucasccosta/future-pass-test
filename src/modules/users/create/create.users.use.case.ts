import { UserDomain } from '../domain/user';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { users } from '@prisma/client';

@Injectable()
export class CreateUsersUseCase {
  constructor(private usersService: UsersService) {}

  async execute(userParams: CreateUserDto): Promise<users> {
    const userAlreadyExists = await this.usersService.findByEmail(
      userParams.email,
    );
    if (userAlreadyExists) {
      throw new ConflictException('User Already exists');
    }

    const user = new UserDomain({
      username: userParams.username,
      email: userParams.email,
      password: userParams.password,
    });

    user.encryptPassword();

    const userCreated = await this.usersService.create(user);
    return userCreated;
  }
}
