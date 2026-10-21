import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Volume2, Sparkles } from "lucide-react";
import { FloatingShapes } from "../../components/FloatingShapes";
import { FRUITS, FruitItem } from "../../constants/fruitData";
import { speakText } from "../../utils/speakText";
import { playSound } from "../../utils/audio";
import { triggerConfetti } from "../../utils/confetti";

export const QuizGamePage: React.FC = () => {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<FruitItem | null>(null);
  const [options, setOptions] = useState<FruitItem[]>([]);
  const [score, setScore] = useState(0);
  const [wrongAnswerId, setWrongAnswerId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateQuestion = useCallback(() => {
    const randomFruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const shuffledOptions = [...FRUITS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (!shuffledOptions.find((o) => o.id === randomFruit.id)) {
      shuffledOptions[Math.floor(Math.random() * 4)] = randomFruit;
    }

    setCurrentQuestion(randomFruit);
    setOptions(shuffledOptions);
    setShowSuccess(false);
    setWrongAnswerId(null);

    // Speak question prompt
    speakText(`Where is the ${randomFruit.name}?`);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (fruit: FruitItem) => {
    if (!currentQuestion) return;

    if (fruit.id === currentQuestion.id) {
      playSound("correct");
      setScore((prev) => prev + 10);
      setShowSuccess(true);
      speakText("Awesome!");
      triggerConfetti();
      setTimeout(generateQuestion, 1600);
    } else {
      playSound("wrong");
      setWrongAnswerId(fruit.id);
      speakText(`No, that's ${fruit.name}`);
      setTimeout(() => setWrongAnswerId(null), 1000);
    }
  };

  const handleReplayAudio = () => {
    if (currentQuestion) {
      speakText(`Where is the ${currentQuestion.name}?`);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="quiz-game-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      {/* Header */}
      <header className="quiz-top-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn-round btn-pressable"
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#FF9F1C" strokeWidth={2.5} />
        </button>

        <h1 className="header-title-text" style={{ color: "white" }}>
          Quiz Game
        </h1>

        <div className="quiz-score-badge">
          <Star size={18} fill="#FFD700" color="#FFD700" />
          <span>{score}</span>
        </div>
      </header>

      <div className="screen-scroll-view quiz-scroll-content">
        {/* Question Prompt Card */}
        <div className="question-card-container">
          <button
            onClick={handleReplayAudio}
            className="speaker-replay-btn btn-pressable"
            title="Repeat Question"
          >
            <Volume2 size={24} color="white" />
          </button>

          <span className="question-prefix">Find the item:</span>
          <h2 className="question-target-name">{currentQuestion.name}?</h2>

          {showSuccess && (
            <div className="success-banner-pill">
              <Sparkles size={16} color="#FFD700" />
              <span>Awesome! +10 Stars</span>
            </div>
          )}
        </div>

        {/* 4 Choices Grid */}
        <div className="quiz-options-grid">
          {options.map((item) => {
            const isWrong = wrongAnswerId === item.id;
            const isCorrect = showSuccess && item.id === currentQuestion.id;

            return (
              <div
                key={item.id}
                onClick={() => !showSuccess && handleAnswer(item)}
                className={`quiz-option-card btn-pressable ${
                  isWrong ? "wrong-shake" : ""
                } ${isCorrect ? "correct-glow" : ""}`}
              >
                <div className="quiz-option-img-pod">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="quiz-option-img"
                  />
                </div>
                <span className="quiz-option-label">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .quiz-game-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .quiz-top-header {
          background: linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%);
          padding: 18px 20px 22px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          box-shadow: 0 8px 24px rgba(255, 159, 28, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 20;
        }

        .quiz-score-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(6px);
          padding: 6px 14px;
          border-radius: 20px;
          color: white;
          font-size: 17px;
          font-weight: 900;
        }

        .quiz-scroll-content {
          padding: 24px 18px 40px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .question-card-container {
          width: 100%;
          max-width: 380px;
          background: white;
          border-radius: 32px;
          padding: 24px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border: 3px solid #FFEAA7;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-bottom: 24px;
          text-align: center;
        }

        .speaker-replay-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #FF9F1C;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 159, 28, 0.3);
        }

        .question-prefix {
          font-size: 14px;
          font-weight: 800;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .question-target-name {
          font-size: 32px;
          font-weight: 900;
          color: #E17055;
          letter-spacing: -0.5px;
        }

        .success-banner-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #00B894;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 800;
          margin-top: 10px;
          animation: bounceIn 0.3s ease;
        }

        .quiz-options-grid {
          width: 100%;
          max-width: 380px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .quiz-option-card {
          background: white;
          border-radius: 28px;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          border: 3px solid #EDF2F7;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .quiz-option-card:hover {
          transform: translateY(-4px);
          border-color: #FF9F1C;
        }

        .quiz-option-img-pod {
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .quiz-option-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
        }

        .quiz-option-label {
          font-size: 16px;
          font-weight: 800;
          color: #2D3436;
        }

        .wrong-shake {
          animation: shakeWrong 0.4s ease;
          border-color: #FF7675 !important;
          background: #FFF5F5;
        }

        .correct-glow {
          border-color: #00B894 !important;
          background: #E6FFFA;
          transform: scale(1.05);
        }

        @keyframes shakeWrong {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};
