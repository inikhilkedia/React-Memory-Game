import React from 'react';
import './Card.css';

export interface CardType {
	id: number;
	content: string;
	isMatched: boolean;
}

interface CardProps {
	card: CardType;
	onClick: (card: CardType) => void;
	isFlipped: boolean;
}

const Card: React.FC<CardProps> = React.memo(({ card, onClick, isFlipped }) => {
	return (
		<div
			className={`card ${isFlipped ? 'flipped' : ''}`}
			onClick={() => !isFlipped && onClick(card)}
		>
			<div className='card-inner'>{isFlipped ? card.content : '?'}</div>
		</div>
	);
});

export default Card;
