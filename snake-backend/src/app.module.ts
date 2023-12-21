import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnakeController } from './snake/snake.controller';

@Module({
  imports: [],
  controllers: [AppController, SnakeController],
  providers: [AppService],
})
export class AppModule {}
