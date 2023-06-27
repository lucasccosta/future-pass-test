import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUsersController } from './create/create.users.controller';
import { CreateUsersUseCase } from './create/create.users.use.case';
import { PrismaService } from 'src/config/db/prisma.service';

@Module({
  controllers: [CreateUsersController],
  providers: [UsersService, CreateUsersUseCase, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
