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
	isMismatched: boolean;
}

const Card: React.FC<CardProps> = React.memo(
	({ card, onClick, isFlipped, isMismatched }) => {
		return (
			<div
				className={`card ${isFlipped ? 'flipped' : ''} ${
					card.isMatched ? 'matched' : ''
				} ${isMismatched ? 'mismatched' : ''}`}
				onClick={() => !isFlipped && !card.isMatched && onClick(card)}
			>
				<div className='card-inner'>
					<div className='card-front'>{card.content}</div>
					<div className='card-back'>?</div>
				</div>
			</div>
		);
	}
);

export default Card;
