import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../services/users.service';
import { GetUsersByIdDto } from '../../dto/user.dto';

@Injectable()
export class GetUsersByIdUseCase {
  constructor(private usersService: UsersService) {}

  async execute(id: string): Promise<GetUsersByIdDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      favoriteHeros: user.heros,
    };
  }
}
