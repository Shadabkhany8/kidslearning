import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, User } from "lucide-react";
import { FloatingShapes } from "../components/FloatingShapes";
import { FeatureCard } from "../components/FeatureCard";
import { FEATURE_CATEGORIES } from "../constants/featureData";
import { useSettings } from "../context/SettingsContext";
import { useProgress } from "../hooks/useProgress";
import { speakText } from "../utils/speakText";
import { playSound } from "../utils/audio";

export const LearnTab: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { totalStars, categories } = useProgress();

  const handleCardPress = (route: string) => {
    speakText("Let's Learn!");
    navigate(route);
  };

  const topCategories = FEATURE_CATEGORIES.learning.slice(0, 4);

  return (
    <div className="learn-tab-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      <div className="screen-scroll-view learn-screen-scroll">
        {/* Header Section */}
        <header className="learn-header">
          <div className="user-profile-header-row">
            <div className="avatar-info-group">
              <div
                className="user-avatar-pod"
                onClick={() => navigate("/settings")}
                title="Go to Parent Settings"
              >
                {settings.profile.image ? (
                  <img
                    src={settings.profile.image}
                    alt={settings.profile.name}
                    className="avatar-face-img"
                  />
                ) : (
                  <User size={26} color="#6C5CE7" />
                )}
                <div className="star-avatar-badge">
                  <Star size={10} fill="#FFD700" color="#FFB800" />
                </div>
              </div>

              <div className="user-greeting-text">
                <h1 className="greeting-heading">
                  Hello, {settings.profile.name || "Little Learner"}! 👋
                </h1>
                <p className="greeting-sub">Let's continue your learning</p>
              </div>
            </div>

            <div className="score-pill-badge" title="Total Stars Earned">
              <Star size={16} fill="#FFD700" color="#FFD700" />
              <span className="score-number">{totalStars}</span>
            </div>
          </div>
        </header>

        {/* Feature Cards Grid (2 columns on mobile, 4 columns on desktop/wide) */}
        <section className="features-grid-section">
          <div className="cards-two-column-grid">
            {topCategories.map((item, index) => {
              const progress = categories[item.id] || {
                level: 1,
                detail: "Basic",
                percentage: 0,
              };

              return (
                <FeatureCard
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  gradient={item.gradient}
                  color={item.color}
                  index={index}
                  level={progress.level}
                  detail={progress.detail}
                  onPress={() => handleCardPress(item.route)}
                />
              );
            })}
          </div>

          {/* Explore More Wide Banner */}
          <div
            className="explore-more-banner btn-pressable"
            onClick={() => {
              playSound("pop");
              handleCardPress("/explore-learning");
            }}
          >
            <div className="explore-banner-content">
              <div className="explore-banner-icon-pod">
                <img
                  src="./assets/images/feature/palette.png"
                  alt="Palette"
                  className="explore-banner-icon"
                />
              </div>

              <div className="explore-banner-text">
                <h3 className="explore-banner-title">Explore More</h3>
                <p className="explore-banner-sub">
                  Discover 8 more fun learning worlds!
                </p>
              </div>

              <div className="explore-banner-arrow">
                <ChevronRight size={24} color="white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .learn-tab-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .learn-screen-scroll {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .learn-header {
          padding: clamp(12px, 1.8vh, 18px) 16px clamp(4px, 0.8vh, 8px) 16px;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .user-profile-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .avatar-info-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-pod {
          width: clamp(44px, 6vh, 52px);
          height: clamp(44px, 6vh, 52px);
          border-radius: 50%;
          background: #E0E7FF;
          border: 2px solid #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(108, 92, 231, 0.15);
          overflow: visible;
        }

        .avatar-face-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .star-avatar-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: white;
          border-radius: 50%;
          padding: 2.5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
          display: flex;
        }

        .user-greeting-text {
          display: flex;
          flex-direction: column;
        }

        .greeting-heading {
          font-size: clamp(16px, 2.2vh, 20px);
          font-weight: 900;
          color: #1F2937;
          letter-spacing: -0.4px;
          line-height: 1.2;
        }

        .greeting-sub {
          font-size: clamp(11.5px, 1.4vh, 13px);
          color: #6B7280;
          font-weight: 600;
          margin-top: 1px;
        }

        .score-pill-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #6C5CE7;
          color: white;
          padding: clamp(4px, 0.7vh, 6px) clamp(10px, 1.2vw, 14px);
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
          flex-shrink: 0;
        }

        .score-number {
          font-size: clamp(14px, 1.8vh, 17px);
          font-weight: 900;
        }

        .features-grid-section {
          padding: 2px 16px 6px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cards-two-column-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 1.3vh, 12px);
          margin-bottom: clamp(8px, 1.3vh, 14px);
        }

        .wide-mode .cards-two-column-grid {
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .explore-more-banner {
          background: linear-gradient(135deg, #6C5CE7 0%, #A78BFA 100%);
          border-radius: 22px;
          padding: clamp(8px, 1.2vh, 12px) clamp(12px, 1.8vw, 16px);
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(108, 92, 231, 0.25);
          border: 2px solid rgba(255, 255, 255, 0.6);
          margin-bottom: clamp(6px, 1vh, 10px);
          flex-shrink: 0;
        }

        .explore-banner-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .explore-banner-icon-pod {
          width: clamp(38px, 5vh, 46px);
          height: clamp(38px, 5vh, 46px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .explore-banner-icon {
          width: clamp(24px, 3.4vh, 30px);
          height: clamp(24px, 3.4vh, 30px);
          object-fit: contain;
        }

        .explore-banner-text {
          flex: 1;
        }

        .explore-banner-title {
          font-size: clamp(14px, 1.8vh, 17px);
          font-weight: 900;
          color: white;
          margin-bottom: 1px;
        }

        .explore-banner-sub {
          font-size: clamp(11px, 1.3vh, 12.5px);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .explore-banner-arrow {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: clamp(28px, 4vh, 34px);
          height: clamp(28px, 4vh, 34px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
