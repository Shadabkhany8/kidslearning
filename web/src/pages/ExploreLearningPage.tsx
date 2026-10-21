import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FloatingShapes } from "../components/FloatingShapes";
import { FeatureCard } from "../components/FeatureCard";
import { FEATURE_CATEGORIES } from "../constants/featureData";
import { useProgress } from "../hooks/useProgress";
import { speakText } from "../utils/speakText";

export const ExploreLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useProgress();

  const handleCardPress = (route: string) => {
    speakText("Let's Learn!");
    navigate(route);
  };

  const moreCategories = FEATURE_CATEGORIES.learning.slice(4);

  return (
    <div className="explore-page-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      {/* Header */}
      <header className="explore-header-bar">
        <button
          onClick={() => navigate(-1)}
          className="header-back-circle btn-pressable"
          aria-label="Back"
        >
          <ArrowLeft size={24} color="white" strokeWidth={2.5} />
        </button>
        <h1 className="explore-header-title">Explore More</h1>
        <div style={{ width: 42 }} />
      </header>

      <div className="screen-scroll-view">
        <section className="features-grid-section">
          <div className="cards-two-column-grid">
            {moreCategories.map((item, index) => {
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
        </section>
      </div>

      <style>{`
        .explore-page-screen {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .explore-header-bar {
          background: linear-gradient(135deg, #6C5CE7 0%, #A78BFA 100%);
          padding: 20px 18px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 24px rgba(108, 92, 231, 0.28);
          position: relative;
          z-index: 20;
        }

        .header-back-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .explore-header-title {
          font-size: 22px;
          font-weight: 900;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .features-grid-section {
          padding: 16px;
        }

        .cards-two-column-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .wide-mode .cards-two-column-grid {
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
      `}</style>
    </div>
  );
};
