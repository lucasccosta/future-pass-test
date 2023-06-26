import { Test, TestingModule } from '@nestjs/testing';
import { AuthJWTStrategyController } from './auth.controller';

describe('AuthJWTStrategyController', () => {
  let controller: AuthJWTStrategyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthJWTStrategyController],
    }).compile();

    controller = module.get<AuthJWTStrategyController>(
      AuthJWTStrategyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
