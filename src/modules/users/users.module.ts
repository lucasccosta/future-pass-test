import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import { CreateUsersController } from './create/create.users.controller';
import { CreateUsersUseCase } from './create/create.users.use.case';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [CreateUsersController],
  providers: [UsersService, CreateUsersUseCase],
  exports: [UsersService],
})
export class UsersModule {}
