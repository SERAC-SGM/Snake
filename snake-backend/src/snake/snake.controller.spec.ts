import { Test, TestingModule } from '@nestjs/testing';
import { SnakeController } from './snake.controller';

describe('SnakeController', () => {
  let controller: SnakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnakeController],
    }).compile();

    controller = module.get<SnakeController>(SnakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
