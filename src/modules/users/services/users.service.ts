import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { UserDomain } from '../domain/user';
import { PrismaService } from 'src/config/db/prisma.service';
import { users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  usersModel = this.prisma.users;

  async create(createUserDto: CreateUserDto): Promise<users> {
    try {
      const user = await this.usersModel.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      });
      return user;
    } catch (error) {
      throw new ConflictException('User Already exists');
    }
  }

  async findAll() {
    return await this.usersModel.findMany();
  }

  async findByEmail(email: string) {
    const user = await this.usersModel.findFirst({
      where: { email },
      include: {
        user_heros: {
          include: {
            heros: {},
          },
        },
      },
    });

    if (user)
      return new UserDomain({
        id: user.id,
        email: user.email,
        password: user.password,
        username: user.username,
        heros:
          user.user_heros.length > 0
            ? user.user_heros.map((hero) => hero.heros)
            : [],
      });
    return;
  }

  async findById(id: string) {
    const user = await this.usersModel.findUnique({
      where: { id },
      include: {
        user_heros: {
          include: {
            heros: {},
          },
        },
      },
    });
    if (user)
      return new UserDomain({
        id: user.id,
        email: user.email,
        password: user.password,
        username: user.username,
        heros:
          user.user_heros.length > 0
            ? user.user_heros.map((hero) => hero.heros)
            : [],
      });
    return;
  }
}
