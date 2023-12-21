import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('snake')
export class SnakeController {

	private gameState = {
		snakePosition: [[0, 0], [0, 1], [0, 2]],	// Initial snake position
		foodPosition: [2, 2]						// Initial food position
	};

	@Get('state')
	getGameState()
	{
		return this.gameState;
	}

	@Post('update')
	updateGameState(@Body() updateData: any)
	{
		// assume that updateDate contains a direction property
		const newDirection = updateData.direction;

		//update the snake position based on the new direction
		const newHead =this.calculateNewHead(newDirection);
		this.gameState.snakePosition.unshift(newHead);

		// check for collision
		if (this.checkCollision()) {
			// handle collision logic
			this.gameState = this.resetGameState();
		} else {
			// check if food is eaten
			if (this.isFoodEaten()) {
				// generate new food position
				this.gameState.foodPosition = this.generateNewFoodPosition();
			} else {
				// remove the last element from the snake position
				this.gameState.snakePosition.pop();
			}
		}
		
		return this.gameState;
	}

	private calculateNewHead(direction: string) {
		// For simplicity, assume direction is on of 'UP', 'DOWN', 'LEFT', 'RIGHT'
		const [headX, headY] = this.gameState.snakePosition[0];

		switch (direction) {
			case 'UP':
				return [headX, headY - 1];
			case 'DOWN':
				return [headX, headY + 1];
			case 'LEFT':
				return [headX - 1, headY];
			case 'RIGHT':
				return [headX + 1, headY];
			default :
				return [headX, headY];
		}
	}

	private checkCollision() {
		// Snake collides with the walls or itself
		const [headX, headY] = this.gameState.snakePosition[0];

		// check for wall collision
		return (
			headX < 0 ||
			headX >= 10 || // add define later
			headY < 0 ||
			headY >= 10 ||
			this.checkSelfCollision());
	}

	private checkSelfCollision() {
		const [headX, headY] = this.gameState.snakePosition[0];
		// Check if the head collides with the body
		return this.gameState.snakePosition.slice(1).some(([posX, posY]) => posX === headX && posY === headY); //explain this
	}
}
