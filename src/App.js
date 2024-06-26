import React, { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import "./App.css";

const generateDeck = () => {
  const contents = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return [...contents, ...contents]
    .sort(() => Math.random() - 0.5)
    .map((content, index) => ({ id: index, content, isMatched: false }));
};

const App = () => {
  const [deck, setDeck] = useState(generateDeck);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [name, setName] = useState("");
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || {
      name: "",
      attempts: Infinity,
    }
  );

  useEffect(() => {
    if (flippedCards.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.content === secondCard.content) {
        setDeck((prevDeck) =>
          prevDeck.map((card) =>
            card.content === firstCard.content
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matchedPairs === deck.length / 2) {
      if (attempts < highScore.attempts) {
        const newHighScore = { name, attempts };
        setHighScore(newHighScore);
        localStorage.setItem("highScore", JSON.stringify(newHighScore));
      }
    }
  }, [matchedPairs, deck.length, attempts, highScore.attempts, name]);

  const handleCardClick = useCallback(
    (card) => {
      if (flippedCards.length < 2 && !flippedCards.includes(card)) {
        setFlippedCards((prev) => [...prev, card]);
      }
    },
    [flippedCards]
  );

  const resetGame = () => {
    setDeck(generateDeck());
    setFlippedCards([]);
    setMatchedPairs(0);
    setAttempts(0);
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="score">Attempts: {attempts}</div>
      <div className="high-score">
        High Score: {highScore.name} - {highScore.attempts} attempts
      </div>
      <div className="board">
        {deck.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            isFlipped={flippedCards.includes(card) || card.isMatched}
          />
        ))}
      </div>
      {matchedPairs === deck.length / 2 && (
        <div className="win-message">You Win!</div>
      )}
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default App;
