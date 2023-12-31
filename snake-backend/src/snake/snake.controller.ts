import { Controller, Get, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Controller('snake')
export class SnakeController {
	private logger = new Logger(SnakeController.name);

	private gameState = {
		snakePosition: [[4, 4], [4, 5], [4, 6]],	// Initial snake position
		foodPosition: [2, 2],						// Initial food position
		gameStarted: false,
	};

	@Get('state')
	getGameState()
	{
		try {
			return this.gameState;
		} catch (error) {
			this.logger.error( `Error getting game data state: $(error.message)` );
			throw new HttpException('Error getting game data state', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('start')
	startGame()
	{
		try {
			this.gameState.gameStarted = true;
			return this.gameState;
		} catch (error) {
			this.logger.error( `Error starting game: $(error.message)` );
			throw new HttpException('Error starting game', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('update')
	updateGameState(@Body() updateData: any)
	{
		if (!updateData.direction) {
			throw new HttpException('Direction not provided', HttpStatus.BAD_REQUEST);
		}
		try {
			const newDirection = updateData.direction;

			// update the snake position based on the new direction
			const newHead =this.calculateNewHead(newDirection);
			this.gameState.snakePosition.unshift(newHead);

			if (this.gameState.gameStarted && this.checkCollision()) {
				this.gameState = this.resetGameState();
				return {...this.gameState, gameOver: true} // game over signal
			} else if (this.isFoodEaten()) {
				this.gameState.foodPosition = this.generateNewFoodPosition();
			} else {
				// remove the last element from the snake position
				this.gameState.snakePosition.pop();
			}
			return this.gameState;
		} catch (error) {
			this.logger.error( `Error updating game data state: $(error.message)` );
			throw new HttpException('Error updating game data state', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private calculateNewHead(direction: string) {
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

	private isFoodEaten() {
		const [headX, headY] = this.gameState.snakePosition[0];
		const [foodX, foodY] = this.gameState.foodPosition;
		return headX == foodX && headY == foodY;
	}
	
	private generateNewFoodPosition(): number[] {
		// Generate a random position for the food
		let newFoodX: number;
		let newFoodY: number;
		let foodIsOnSnake: boolean;

		do {
			newFoodX = Math.floor(Math.random() * 10);
			newFoodY = Math.floor(Math.random() * 10);

			foodIsOnSnake = this.gameState.snakePosition.some(([posX, posY]) => posX === newFoodX && posY === newFoodY);
		} while (foodIsOnSnake);
		return [newFoodX, newFoodY];
	}

	private resetGameState() {
		return {
			snakePosition: [[4, 4], [4, 5], [4, 6]],
			foodPosition: [2, 2],
			gameStarted: false,
		};
	}
}
