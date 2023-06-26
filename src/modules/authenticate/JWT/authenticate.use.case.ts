import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UsersService } from 'src/modules/users/services/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticateDto } from '../DTOs';

export class AuthenticateUseCase {
  constructor(private usersService: UsersService) {}

  async authenticate(data: AuthenticateDto) {
    const { email, password } = data;

    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(`User with email ${email} not found`);

    console.log('user: ', user);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('isValidPassword: ', isValidPassword);
    if (!isValidPassword)
      throw new UnauthorizedException('The password is incorrect');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
}
