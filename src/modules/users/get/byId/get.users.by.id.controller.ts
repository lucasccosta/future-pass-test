import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetUsersByIdUseCase } from './get.users.by.id.use.case';

@Controller('/user')
export class GetUsersByIdController {
  constructor(private readonly getUsersByIdUseCase: GetUsersByIdUseCase) {}

  @Get('/:id')
  async handle(@Param('id') id: string) {
    try {
      const user = await this.getUsersByIdUseCase.execute(id);
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
