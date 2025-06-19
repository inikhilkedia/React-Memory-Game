import React, { useState, useEffect, useCallback } from 'react';
import Card, { CardType } from './Card';
import './App.css';

const generateDeck = (): CardType[] => {
	const contents = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	return [...contents, ...contents]
		.sort(() => Math.random() - 0.5)
		.map((content, index) => ({ id: index, content, isMatched: false }));
};

const App: React.FC = () => {
	const [deck, setDeck] = useState<CardType[]>(generateDeck);
	const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
	const [matchedPairs, setMatchedPairs] = useState<number>(0);
	const [attempts, setAttempts] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [highScore, setHighScore] = useState<{
		name: string;
		attempts: number;
	}>(
		JSON.parse(localStorage.getItem('highScore') || 'null') || {
			name: '',
			attempts: Infinity,
		}
	);
	const [gameEnded, setGameEnded] = useState<boolean>(false);

	useEffect(() => {
		if (flippedCards.length === 2) {
			setAttempts(prev => prev + 1);
			const [firstCard, secondCard] = flippedCards;
			if (firstCard.content === secondCard.content) {
				setDeck(prevDeck =>
					prevDeck.map(card =>
						card.content === firstCard.content
							? { ...card, isMatched: true }
							: card
					)
				);
				setMatchedPairs(prev => prev + 1);
			}
			setTimeout(() => setFlippedCards([]), 1000);
		}
	}, [flippedCards]);

	useEffect(() => {
		if (matchedPairs === deck.length / 2) {
			if (attempts < highScore.attempts) {
				const newHighScore = { name, attempts };
				setHighScore(newHighScore);
				localStorage.setItem('highScore', JSON.stringify(newHighScore));
			}
			setGameEnded(true);
		}
	}, [matchedPairs, deck.length, attempts, highScore.attempts, name]);

	// End game when only 2 unmatched cards are left
	useEffect(() => {
		const unmatched = deck.filter(card => !card.isMatched);
		if (unmatched.length === 2 && !gameEnded) {
			setFlippedCards(unmatched); // Auto-flip the last 2
			setAttempts(prev => prev + 1); // Increment attempts
			setTimeout(() => {
				setMatchedPairs(deck.length / 2);
				setGameEnded(true);
				// Optionally update high score if this is the best
				if (attempts + 1 < highScore.attempts) {
					const newHighScore = { name, attempts: attempts + 1 };
					setHighScore(newHighScore);
					localStorage.setItem('highScore', JSON.stringify(newHighScore));
				}
			}, 1000); // Delay to allow user to see the last 2 cards
		}
	}, [deck, gameEnded, attempts, highScore, name]);

	const handleCardClick = useCallback(
		(card: CardType) => {
			if (gameEnded) return;
			if (flippedCards.length < 2 && !flippedCards.includes(card)) {
				setFlippedCards(prev => [...prev, card]);
			}
		},
		[flippedCards, gameEnded]
	);

	const resetGame = () => {
		setDeck(generateDeck());
		setFlippedCards([]);
		setMatchedPairs(0);
		setAttempts(0);
		setGameEnded(false);
	};

	return (
		<div className='App'>
			<h1>Memory Game</h1>
			<div className='input-container'>
				<input
					type='text'
					placeholder='Enter your name'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</div>
			<div className='score'>Attempts: {attempts}</div>
			<div className='high-score'>
				High Score: {highScore.name} - {highScore.attempts} attempts
			</div>
			<div className='board'>
				{deck.map(card => (
					<Card
						key={card.id}
						card={card}
						onClick={handleCardClick}
						isFlipped={flippedCards.includes(card) || card.isMatched}
					/>
				))}
			</div>
			{matchedPairs === deck.length / 2 && (
				<div className='win-message'>You Win!</div>
			)}
			<button className='reset-button' onClick={resetGame}>
				Reset Game
			</button>
		</div>
	);
};

export default App;
