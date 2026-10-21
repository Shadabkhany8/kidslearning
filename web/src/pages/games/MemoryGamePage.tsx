import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trophy, Sparkles } from "lucide-react";
import { FloatingShapes } from "../../components/FloatingShapes";
import { playSound } from "../../utils/audio";
import { triggerConfetti } from "../../utils/confetti";
import { speakText } from "../../utils/speakText";

interface MemoryCardItem {
  id: number;
  name: string;
  emoji: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_DATA = [
  { name: "Dog", emoji: "🐶", color: "#FF9F1C" },
  { name: "Cat", emoji: "🐱", color: "#2EC4B6" },
  { name: "Rabbit", emoji: "🐰", color: "#E71D36" },
  { name: "Elephant", emoji: "🐘", color: "#4361EE" },
  { name: "Fish", emoji: "🐠", color: "#4CC9F0" },
  { name: "Bird", emoji: "🐦", color: "#F72585" },
  { name: "Owl", emoji: "🦉", color: "#8338EC" },
  { name: "Cow", emoji: "🐮", color: "#F15BB5" },
];

export const MemoryGamePage: React.FC = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const initGame = () => {
    // 8 pairs = 16 cards (4x4 grid)
    const deck: MemoryCardItem[] = [];
    let idCounter = 1;

    CARD_DATA.forEach((card) => {
      // Push 2 identical cards
      deck.push({
        id: idCounter++,
        name: card.name,
        emoji: card.emoji,
        color: card.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        name: card.name,
        emoji: card.emoji,
        color: card.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    playSound("pop");

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstIdx = newFlipped[0];
      const secondIdx = newFlipped[1];

      if (cards[firstIdx].name === cards[secondIdx].name) {
        // Matched!
        setTimeout(() => {
          playSound("correct");
          speakText(cards[firstIdx].name);
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          if (newMatchCount === CARD_DATA.length) {
            // Won game!
            setTimeout(() => {
              playSound("win");
              triggerConfetti();
              speakText("Congratulations! You won the memory game!");
              setIsCompleted(true);
            }, 500);
          }
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="memory-game-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      {/* Header */}
      <header className="memory-top-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn-round btn-pressable"
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#00BCD4" strokeWidth={2.5} />
        </button>

        <h1 className="header-title-text" style={{ color: "white" }}>
          Memory Match
        </h1>

        <button
          onClick={() => {
            playSound("click");
            initGame();
          }}
          className="back-btn-round btn-pressable"
          title="Restart Game"
        >
          <RotateCcw size={20} color="#00BCD4" />
        </button>
      </header>

      <div className="screen-scroll-view memory-scroll-content">
        {/* Game Stats Bar */}
        <div className="memory-stats-strip">
          <div className="stat-pill">
            <span className="stat-label">Moves:</span>
            <span className="stat-val">{moves}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Pairs:</span>
            <span className="stat-val">
              {matches} / {CARD_DATA.length}
            </span>
          </div>
        </div>

        {/* 4x4 Cards Grid */}
        <div className="memory-cards-grid">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`memory-card-flip-wrap ${
                  isRevealed ? "flipped" : ""
                } ${card.isMatched ? "matched" : ""}`}
              >
                <div className="memory-card-flipper">
                  {/* Card Back (hidden face) */}
                  <div className="memory-card-face card-back">
                    <Sparkles size={22} color="rgba(255, 255, 255, 0.7)" />
                  </div>

                  {/* Card Front (revealed face) */}
                  <div
                    className="memory-card-face card-front"
                    style={{
                      borderColor: card.color,
                      backgroundColor: `${card.color}15`,
                    }}
                  >
                    <span className="card-emoji-icon">{card.emoji}</span>
                    <span
                      className="card-name-tag"
                      style={{ color: card.color }}
                    >
                      {card.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Win Celebration Modal */}
      {isCompleted && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="trophy-pod">
              <Trophy size={48} fill="#FFD700" color="#FF9500" />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "6px" }}>
              Fantastic Memory! 🧠🎉
            </h2>
            <p style={{ fontSize: "15px", color: "#636E72", marginBottom: "20px" }}>
              You matched all 8 animal pairs in <strong>{moves}</strong> moves!
            </p>
            <button
              onClick={initGame}
              className="btn-modal-close btn-pressable"
              style={{
                background: "linear-gradient(135deg, #00BCD4, #0097A7)",
              }}
            >
              Play Again! 🔄
            </button>
          </div>
        </div>
      )}

      <style>{`
        .memory-game-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .memory-top-header {
          background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
          padding: 18px 20px 22px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          box-shadow: 0 8px 24px rgba(0, 188, 212, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 20;
        }

        .memory-scroll-content {
          padding: clamp(10px, 1.8vh, 18px) 16px clamp(16px, 3vh, 32px) 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .memory-stats-strip {
          display: flex;
          gap: 12px;
          margin-bottom: clamp(10px, 1.5vh, 18px);
        }

        .stat-pill {
          background: white;
          padding: clamp(4px, 0.8vh, 7px) clamp(12px, 1.5vw, 16px);
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1.5px solid #E2E8F0;
          font-weight: 800;
          display: flex;
          gap: 6px;
          font-size: clamp(12px, 1.6vh, 14px);
        }

        .stat-label {
          color: #718096;
        }
        .stat-val {
          color: #00BCD4;
        }

        .memory-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(6px, 1vh, 10px);
          width: 100%;
          max-width: clamp(280px, 46vh, 420px);
        }

        .wide-mode .memory-cards-grid {
          max-width: 480px;
          gap: 12px;
        }

        .memory-card-flip-wrap {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
        }

        .memory-card-flipper {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .memory-card-flip-wrap.flipped .memory-card-flipper {
          transform: rotateY(180deg);
        }

        .memory-card-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .card-back {
          background: linear-gradient(135deg, #4FC3F7 0%, #039BE5 100%);
          border: 2.5px solid white;
        }

        .card-front {
          background: white;
          border: 3px solid;
          transform: rotateY(180deg);
        }

        .card-emoji-icon {
          font-size: 32px;
          line-height: 1;
        }

        .card-name-tag {
          font-size: 10px;
          font-weight: 800;
          margin-top: 2px;
        }

        .memory-card-flip-wrap.matched .card-front {
          box-shadow: 0 0 16px rgba(0, 188, 212, 0.4);
        }

        .trophy-pod {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #FFF8E1;
          margin: 0 auto 16px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
