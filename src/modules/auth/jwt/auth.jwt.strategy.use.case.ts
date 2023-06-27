import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/modules/users/services/users.service';
import { JWTStrategyDto } from './DTOs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJWTStrategyUseCase {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async execute(data: JWTStrategyDto): Promise<any> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException('The password is incorrect');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: payload.sub,
    };
  }
}
