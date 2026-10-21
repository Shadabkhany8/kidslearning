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

      <div className="screen-scroll-view">
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
                  <User size={30} color="#6C5CE7" />
                )}
                <div className="star-avatar-badge">
                  <Star size={11} fill="#FFD700" color="#FFB800" />
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
              <Star size={18} fill="#FFD700" color="#FFD700" />
              <span className="score-number">{totalStars}</span>
            </div>
          </div>
        </header>

        {/* Feature Cards Grid (2 columns) */}
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
                <ChevronRight size={28} color="white" strokeWidth={2.5} />
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
        }

        .learn-header {
          padding: 24px 20px 16px 20px;
          position: relative;
          z-index: 10;
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
          gap: 12px;
        }

        .user-avatar-pod {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #E0E7FF;
          border: 2.5px solid #EEF2FF;
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
          padding: 3px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
          display: flex;
        }

        .user-greeting-text {
          display: flex;
          flex-direction: column;
        }

        .greeting-heading {
          font-size: 20px;
          font-weight: 900;
          color: #1F2937;
          letter-spacing: -0.4px;
          line-height: 1.2;
        }

        .greeting-sub {
          font-size: 13.5px;
          color: #6B7280;
          font-weight: 600;
          margin-top: 2px;
        }

        .score-pill-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #6C5CE7;
          color: white;
          padding: 6px 14px;
          border-radius: 25px;
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
          flex-shrink: 0;
        }

        .score-number {
          font-size: 17px;
          font-weight: 900;
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

        .explore-more-banner {
          background: linear-gradient(135deg, #6C5CE7 0%, #A78BFA 100%);
          border-radius: 28px;
          padding: 16px 18px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(108, 92, 231, 0.28);
          border: 2px solid rgba(255, 255, 255, 0.6);
          margin-bottom: 24px;
        }

        .explore-banner-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .explore-banner-icon-pod {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .explore-banner-icon {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .explore-banner-text {
          flex: 1;
        }

        .explore-banner-title {
          font-size: 18px;
          font-weight: 900;
          color: white;
          margin-bottom: 2px;
        }

        .explore-banner-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .explore-banner-arrow {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
