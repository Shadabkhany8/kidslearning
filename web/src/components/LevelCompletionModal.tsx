import React, { useEffect } from "react";
import { Star, Sparkles, ArrowRight, Grid } from "lucide-react";
import { triggerConfetti } from "../utils/confetti";
import { playSound } from "../utils/audio";
import { speakText } from "../utils/speakText";

interface LevelCompletionModalProps {
  isOpen: boolean;
  levelTitle: string;
  onNextLevel?: () => void;
  onBackToLevels: () => void;
  hasNextLevel?: boolean;
}

export const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({
  isOpen,
  levelTitle,
  onNextLevel,
  onBackToLevels,
  hasNextLevel = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      playSound("win");
      speakText("Awesome Job! You finished the level!");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-card completion-card">
        {/* Floating Stars Header */}
        <div className="stars-burst-container">
          <div className="star-side star-left">
            <Star size={36} fill="#FFD700" color="#FFB800" strokeWidth={1.5} />
          </div>
          <div className="star-center">
            <Star size={56} fill="#FFD700" color="#FF9500" strokeWidth={1.5} />
            <Sparkles size={24} className="sparkle-badge" color="#FF6B6B" />
          </div>
          <div className="star-side star-right">
            <Star size={36} fill="#FFD700" color="#FFB800" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="completion-title">Awesome Job! 🎉</h2>
        <p className="completion-subtitle">
          You mastered <strong>{levelTitle}</strong>! Keep up the great learning!
        </p>

        <div className="completion-buttons-col">
          {hasNextLevel && onNextLevel && (
            <button
              onClick={() => {
                playSound("click");
                onNextLevel();
              }}
              className="btn-next-level btn-pressable"
            >
              <span>Next Level</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          )}

          <button
            onClick={() => {
              playSound("click");
              onBackToLevels();
            }}
            className="btn-back-levels btn-pressable"
          >
            <Grid size={18} />
            <span>Choose Another Level</span>
          </button>
        </div>
      </div>

      <style>{`
        .completion-card {
          border: 4px solid #FFEAA7;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFFDF7 100%);
        }

        .stars-burst-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .star-center {
          position: relative;
          animation: floatSlow 3s ease-in-out infinite;
        }

        .sparkle-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          animation: pulseGlow 1.5s infinite;
        }

        .star-side {
          animation: floatSlow 3s ease-in-out infinite reverse;
        }

        .completion-title {
          font-size: 26px;
          font-weight: 900;
          color: #2D3436;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .completion-subtitle {
          font-size: 15px;
          color: #636E72;
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .completion-buttons-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-next-level {
          width: 100%;
          padding: 14px 20px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%);
          color: white;
          font-size: 17px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(108, 92, 231, 0.35);
        }

        .btn-back-levels {
          width: 100%;
          padding: 12px 18px;
          border-radius: 20px;
          background: #F1F3F9;
          color: #4A5568;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-back-levels:hover {
          background: #E2E8F0;
        }
      `}</style>
    </div>
  );
};
