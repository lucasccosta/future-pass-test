import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUsersController } from './create/create.users.controller';
import { CreateUsersUseCase } from './create/create.users.use.case';
import { PrismaService } from 'src/config/db/prisma.service';
import { GetUsersByIdController } from './get/byId/get.users.by.id.controller';
import { GetUsersByIdUseCase } from './get/byId/get.users.by.id.use.case';

@Module({
  controllers: [CreateUsersController, GetUsersByIdController],
  providers: [
    UsersService,
    CreateUsersUseCase,
    GetUsersByIdUseCase,
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
