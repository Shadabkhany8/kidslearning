import React from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Star, Trophy } from "lucide-react";
import { FloatingShapes } from "../components/FloatingShapes";
import { FeatureCard } from "../components/FeatureCard";
import { FEATURE_CATEGORIES } from "../constants/featureData";
import { useProgress } from "../hooks/useProgress";
import { speakText } from "../utils/speakText";

export const GamesTab: React.FC = () => {
  const navigate = useNavigate();
  const { totalStars } = useProgress();

  const handleCardPress = (route: string) => {
    speakText("Ready to Play?");
    navigate(route);
  };

  return (
    <div className="games-tab-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      <div className="screen-scroll-view">
        {/* Header Section */}
        <header className="games-header">
          <div className="games-header-row">
            <div className="avatar-info-group">
              <div className="games-avatar-pod">
                <Gamepad2 size={32} color="#FF7675" strokeWidth={2.4} />
              </div>

              <div className="user-greeting-text">
                <h1 className="greeting-heading">Game Time! 🎮</h1>
                <p className="greeting-sub">Play & Have Fun</p>
              </div>
            </div>

            <div
              className="score-pill-badge"
              style={{ backgroundColor: "#FF7675" }}
              title="Total Stars Earned"
            >
              <Star size={18} fill="#FFD700" color="#FFD700" />
              <span className="score-number">{totalStars}</span>
            </div>
          </div>

          {/* Games Achievement Banner */}
          <div className="games-progress-card">
            <div className="games-progress-top">
              <h2 className="games-progress-title">Games Achievement</h2>
              <div className="master-badge">
                <Trophy size={14} fill="#FFD700" color="#FF9500" />
                <span>Master</span>
              </div>
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, Math.max(25, (totalStars / 50) * 100))}%`,
                }}
              />
            </div>

            <p className="achievement-subtext">
              You have earned ⭐ <strong>{totalStars}</strong> stars in games!
            </p>
          </div>
        </header>

        {/* Game Cards Grid (2 columns) */}
        <section className="features-grid-section">
          <div className="cards-two-column-grid">
            {FEATURE_CATEGORIES.games.map((item, index) => (
              <FeatureCard
                key={item.id}
                title={item.title}
                image={item.image}
                gradient={item.gradient}
                color={item.color}
                index={index}
                level={1}
                detail="Play"
                onPress={() => handleCardPress(item.route)}
              />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .games-tab-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .games-header {
          padding: 24px 20px 16px 20px;
          position: relative;
          z-index: 10;
        }

        .games-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .avatar-info-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .games-avatar-pod {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #FFEBEB;
          border: 2.5px solid #FFF0F0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 118, 117, 0.2);
          flex-shrink: 0;
        }

        .user-greeting-text {
          display: flex;
          flex-direction: column;
        }

        .greeting-heading {
          font-size: 21px;
          font-weight: 900;
          color: #1F2937;
          letter-spacing: -0.4px;
        }

        .greeting-sub {
          font-size: 13.5px;
          color: #6B7280;
          font-weight: 600;
        }

        .score-pill-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          padding: 6px 14px;
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(255, 118, 117, 0.3);
          flex-shrink: 0;
        }

        .score-number {
          font-size: 17px;
          font-weight: 900;
        }

        .games-progress-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 18px 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
        }

        .games-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .games-progress-title {
          font-size: 17px;
          font-weight: 900;
          color: #1F2937;
        }

        .master-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 118, 117, 0.12);
          border: 1px solid rgba(255, 118, 117, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          color: #FF7675;
        }

        .progress-bar-track {
          height: 14px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF7675 0%, #FDCB6E 100%);
          border-radius: 10px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .achievement-subtext {
          font-size: 13.5px;
          color: #4A5568;
          font-weight: 700;
          text-align: center;
        }

        .features-grid-section {
          padding: 10px 16px;
        }

        .cards-two-column-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};
