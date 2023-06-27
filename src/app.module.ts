import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import 'dotenv/config';
import { HerosModule } from './modules/heros/heros.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsersModule, HerosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
