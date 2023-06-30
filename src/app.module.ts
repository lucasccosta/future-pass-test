import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import 'dotenv/config';
import { HerosModule } from './modules/heros/heros.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UsersModule, HerosModule, AuthModule, CacheModule.register()],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
