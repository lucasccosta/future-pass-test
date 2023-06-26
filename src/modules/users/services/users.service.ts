import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.model';
import { UserDomain } from '../domain/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      });
      return user;
    } catch (error) {
      throw new ConflictException();
    }
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (user)
      return new UserDomain({
        id: user.id,
        email: user.email,
        password: user.password,
        username: user.username,
      });
    return;
  }
}
