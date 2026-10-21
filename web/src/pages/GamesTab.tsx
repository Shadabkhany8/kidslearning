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

      <div className="screen-scroll-view games-screen-scroll">
        {/* Header Section */}
        <header className="games-header">
          <div className="games-header-row">
            <div className="avatar-info-group">
              <div className="games-avatar-pod">
                <Gamepad2 size={26} color="#FF7675" strokeWidth={2.4} />
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
              <Star size={16} fill="#FFD700" color="#FFD700" />
              <span className="score-number">{totalStars}</span>
            </div>
          </div>

          {/* Games Achievement Banner */}
          <div className="games-progress-card">
            <div className="games-progress-top">
              <h2 className="games-progress-title">Games Achievement</h2>
              <div className="master-badge">
                <Trophy size={13} fill="#FFD700" color="#FF9500" />
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

        {/* Game Cards Grid (2 columns on mobile, 4 columns on desktop/wide) */}
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

        .games-screen-scroll {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.8vh, 18px);
        }

        .games-header {
          padding: clamp(12px, 1.8vh, 18px) 16px clamp(4px, 0.8vh, 8px) 16px;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .wide-mode .games-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: center;
        }

        .games-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: clamp(6px, 1vh, 10px);
        }

        .wide-mode .games-header-row {
          margin-bottom: 0;
        }

        .avatar-info-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .games-avatar-pod {
          width: clamp(44px, 6vh, 52px);
          height: clamp(44px, 6vh, 52px);
          border-radius: 50%;
          background: #FFEBEB;
          border: 2px solid #FFF0F0;
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
          font-size: clamp(17px, 2.2vh, 20px);
          font-weight: 900;
          color: #1F2937;
          letter-spacing: -0.4px;
        }

        .greeting-sub {
          font-size: clamp(11.5px, 1.4vh, 13px);
          color: #6B7280;
          font-weight: 600;
        }

        .score-pill-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: white;
          padding: clamp(4px, 0.7vh, 6px) clamp(10px, 1.2vw, 14px);
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(255, 118, 117, 0.3);
          flex-shrink: 0;
        }

        .score-number {
          font-size: clamp(14px, 1.8vh, 17px);
          font-weight: 900;
        }

        .games-progress-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: clamp(8px, 1.2vh, 12px) 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
        }

        .games-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(4px, 0.7vh, 6px);
        }

        .games-progress-title {
          font-size: clamp(13px, 1.6vh, 15px);
          font-weight: 900;
          color: #1F2937;
        }

        .master-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 118, 117, 0.12);
          border: 1px solid rgba(255, 118, 117, 0.25);
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          color: #FF7675;
        }

        .progress-bar-track {
          height: clamp(8px, 1.1vh, 10px);
          background: rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: clamp(4px, 0.7vh, 6px);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF7675 0%, #FDCB6E 100%);
          border-radius: 10px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .achievement-subtext {
          font-size: clamp(11px, 1.3vh, 12.5px);
          color: #4A5568;
          font-weight: 700;
          text-align: center;
        }

        .features-grid-section {
          padding: 0 16px;
          width: 100%;
        }

        .cards-two-column-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 1.3vh, 12px);
        }

        .wide-mode .cards-two-column-grid {
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
      `}</style>
    </div>
  );
};
