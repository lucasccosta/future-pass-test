import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTStrategyDto } from './DTOs';
import { AuthJWTStrategyUseCase } from './auth.jwt.strategy.use.case';
import { Public } from 'src/infra/middlewares/auth/define.public.routes';

@Controller('auth')
export class AuthJWTStrategyController {
  constructor(
    private readonly authJWTStrategyUseCase: AuthJWTStrategyUseCase,
  ) {}

  @Public()
  @Post()
  signIn(@Body() data: JWTStrategyDto) {
    try {
      const signedIn = this.authJWTStrategyUseCase.execute(data);
      return signedIn;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      }
      throw new NotFoundException();
    }
  }
}
