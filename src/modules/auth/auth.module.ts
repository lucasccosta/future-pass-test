import { Module } from '@nestjs/common';
import { AuthJWTStrategyController } from './jwt/auth.jwt.strategy.controller';
import { UsersModule } from '../users/users.module';
import { AuthJWTStrategyUseCase } from './jwt/auth.jwt.strategy.use.case';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from 'src/infra/middlewares/auth/auth.middleware';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthJWTStrategyController],
  providers: [
    AuthJWTStrategyUseCase,
    {
      provide: APP_GUARD,
      useClass: AuthMiddleware,
    },
  ],
})
export class AuthModule {}
