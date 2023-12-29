import React, {useState, useEffect} from 'react';
import axios from 'axios';

const App = () => {
	const [gameState, setGameState] = useState(null);
	const [direction, setDirection] = useState('');

	useEffect(() => {
		// fetch initial game state when the component mounts
		fetchGameState();
	}, []);

	const fetchGameState = async () => {
		try {
			const response = await axios.get('http://localhost:3001/snake/state');
			console.log('Received game state:', response.data);
			setGameState(response.data);
		} catch (error) {
			console.log('Error fetching game data state:', error);
		}
	};

	const handleUpdateGameState = async () => {
		try {
			const response = await axios.post('http://localhost:3001/snake/update', { direction });
			setGameState(response.data);
		} catch (error) {
			console.log('Error updating game state:', error);
		}
	};

	return (
		<div>
			<h1>Snake Game</h1>
			{gameState && (
				<div>
					<p>Snake Position: {gameState.snakePosition.map((pos, index) => (
						<span key={index}>{index > 0 ? ', ' : ''}({pos[0]}, {pos[1]})</span>
					))}</p>
					<p>Food Position: ({gameState.foodPosition[0]}, {gameState.foodPosition[1]})</p>
				</div>
			)}
			<div>
				<label>Direction:</label>
				<select value={direction} onChange={(e) => setDirection(e.target.value)}>
					<option value="UP">UP</option>
					<option value="DOWN">DOWN</option>
					<option value="LEFT">LEFT</option>
					<option value="RIGHT">RIGHT</option>
				</select>
			</div>
			<button onClick={handleUpdateGameState}>Update Game State</button>
		</div>
	);
};

export default App;
