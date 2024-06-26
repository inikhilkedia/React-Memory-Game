import React from "react";
import "./Card.css";

const Card = React.memo(({ card, onClick, isFlipped }) => {
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={() => !isFlipped && onClick(card)}
    >
      <div className="card-inner">{isFlipped ? card.content : "?"}</div>
    </div>
  );
});

export default Card;
