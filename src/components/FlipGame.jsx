import React, { useState, useEffect } from "react";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const symbols = ["🍎", "⚽", "🚗", "🐶", "🎧", "📚"];

const shuffleCards = shuffle([...symbols, ...symbols]);

export default function FlipGame() {
  const [cards, setCards] = useState(
    shuffleCards.map((symbol, index) => ({
      id: index,
      symbol,
      fliped: false,
      matched: false,
    }))
  );

  const [flippedCards, setFlippedCards] = useState([]);
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    // Only run when 2 cards are flipped
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;

      // If both emoji symbols match → success!
      if (card1.symbol === card2.symbol) {
        handleMatch(card1, card2);
      } else {
        // If not match → flip back after 1 second
        setTimeout(() => resetFlipped(card1, card2), 800);
      }
    }
  }, [flippedCards]);

  const handleFlip = (clickedCard) => {
    if (clickedCard.matched) return;

    if (clickedCard.flipped) return;

    if (flippedCards.length === 2) return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === clickedCard.id ? { ...card, flipped: true } : card
      )
    );

    setFlippedCards((prev) => [...prev, clickedCard]);
  };

  const handleMatch = (card1, card2) => {
    // Mark both cards as matched
    setCards((prev) =>
      prev.map((card) =>
        card.id === card1.id || card.id === card2.id
          ? { ...card, matched: true }
          : card
      )
    );

    // Give score to current player
    if (turn === 1) {
      setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
    } else {
      setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
    }

    // Clear flipped cards
    setFlippedCards([]);
  };

  const resetFlipped = (card1, card2) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === card1.id || card.id === card2.id
          ? { ...card, flipped: false }
          : card
      )
    );

    // Clear flipped cards
    setFlippedCards([]);

    // Switch turns
    setTurn((prev) => (prev === 1 ? 2 : 1));
  };

  const allMatched = cards.every((card) => card.matched);

  const winner =
    allMatched &&
    (score.player1 === score.player2
      ? "Match Draw 🎯"
      : score.player1 > score.player2
      ? "Player 1 Wins 🎉"
      : "Player 2 Wins 🏆");
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <div>Flip card memory game</div>

      <h2>Turn: Player {turn}</h2>
      <p>
        Player 1: {score.player1} | Player 2: {score.player2}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 100px)",
          gap: 15,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card)}
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              cursor: "pointer",
              background: card.flipped || card.matched ? "#ffffff" : "#444",
              border: "2px solid #000",
              borderRadius: 10,
              color: card.flipped || card.matched ? "#000" : "transparent",
              transition: "0.3s",
            }}
          >
            {card.symbol}
          </div>
        ))}
      </div>

      {winner && <h2 style={{ marginTop: 20 }}>{winner}</h2>}
    </div>
  );
}
