import React, {useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
	const [gameState, setGameState] = useState({
		snakePosition: [],
		foodPosition: [],
	});
	const [direction, setDirection] = useState('');
	const directionRef = useRef(direction);
	const setDirectionRef = useRef(setDirection);
	
	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);
	
	useEffect(() => {
		setDirectionRef.current = setDirection;
	}, [direction]);
	
	const directionBuffer = useRef([]);

	const handleUpdateGameState = useCallback(async () => {
		if (directionBuffer.current.length > 0) {
			const newDirection = directionBuffer.current.shift();
			setDirection(newDirection);
			directionRef.current = newDirection;
		}
		try {
			const response = await axios.post('http://localhost:3001/snake/update', { direction: directionRef.current });
			const { snakePosition, foodPosition } = response.data;
			setGameState(prevState => ({
				...prevState,
				snakePosition,
				foodPosition
			}));
		} catch (error) {
			console.log('Error updating game state:', error);
		}
	}, []);


	useEffect(() => {
		const fetchGameState = async () => {
			try {
				const response = await axios.get('http://localhost:3001/snake/state');
				setGameState(response.data);
			} catch (error) {
				console.log('Error fetching game data state:', error);
			}
		};

		// fetch initial game state when the component mounts
		fetchGameState();

		// set interval to fetch game state every x ms
		const intervalID = setInterval(handleUpdateGameState, 125);

		// clean up event listener on component unmount
		return () => {
			clearInterval(intervalID);
		};
	}, [handleUpdateGameState]);

	const handleKeyDown = useCallback((event) => {
		// map arrow key codes to directions
		const keyToDirection = {
			ArrowUp: 'UP',
			ArrowDown: 'DOWN',
			ArrowLeft: 'LEFT',
			ArrowRight: 'RIGHT'
		};

		// check if the pressed key is an arrow key
		if (keyToDirection.hasOwnProperty(event.key)) {
			// prevent default behavior of arrow keys (scrolling the page)
			event.preventDefault();

			const newDirection = keyToDirection[event.key];
			const currentDirection = directionRef.current;

			if (currentDirection === 'UP' && newDirection === 'DOWN') return;
			if (currentDirection === 'DOWN' && newDirection === 'UP') return;
			if (currentDirection === 'LEFT' && newDirection === 'RIGHT') return;
			if (currentDirection === 'RIGHT' && newDirection === 'LEFT') return;
	
			// Add the new direction to the direction buffer
			setDirection(newDirection);
			directionRef.current = newDirection;

			directionBuffer.current.push(newDirection);
		}
	}, []);

	useEffect(() => {

		// add event listener for arrow keys controls
		window.addEventListener('keydown', handleKeyDown);

		// clean up event listener on component unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	const createGameBoard = () => {
		const boardSize = 10;
		const gameBoard = Array.from({length: boardSize}, () => Array(boardSize).fill(' '));

		// place the food
		const [foodX, foodY] = gameState.foodPosition;
		if (foodX >= 0 && foodX < boardSize && foodY >= 0 && foodY < boardSize) {
			gameBoard[foodY][foodX] = 'food';
		}
		gameState.snakePosition.forEach(([snakeX, snakeY], index) => {
			if (snakeX >= 0 && snakeX < boardSize && snakeY >= 0 && snakeY < boardSize) {
				gameBoard[snakeY][snakeX] = index === 0 ? 'head' : 'body';
			}
		});
		return gameBoard;
	}

	const renderGameBoard = () => {
		const gameBoard = createGameBoard();
		// render the game board
		return (
			<div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h1 style={{ fontFamily: 'monospace', fontSize: '2em', marginBottom: '1em' }}>Snake Game</h1>
				<div className="grid" style={{ display : 'inline-flex', flexDirection: 'column'}}>
					{gameBoard.map((row, rowIndex) => (
						<div key={rowIndex} className="grid-row">
							{row.map((cell, cellIndex) => {
								let color;
								if (cell === 'food') {
									color = 'green';
								} else if (cell === 'head') {
									color = 'red';
								} else if (cell === 'body') {
									const distanceFromHead = gameState.snakePosition.length - 1 - gameState.snakePosition.findIndex(([snakeX, snakeY]) => snakeX === cellIndex && snakeY === rowIndex);
									const colorIntensity = Math.max(0, 100 + (distanceFromHead * 10));
									color = `rgb(${colorIntensity}, 0, 0)`;
								}
								else {
									color = 'white';
								}
								return (
									<div
										key={`${rowIndex}-${cellIndex}`}
										className="grid-cell"
										style={{
										backgroundColor: color,
									}}
									></div>
								);
								})}
						</div>
					))}
				</div>
					<div className="score" style={{ fontFamily: 'monospace', fontSize: '1.5em', marginTop: '0.5em'}}>Score: {gameState.snakePosition.length - 1}</div>
			</div>
		);
	};

	return (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '75vh',
			}}>
			{renderGameBoard()}
		</div>
	);
};

export default App;
