import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  Sparkles,
} from "lucide-react";
import { FloatingShapes } from "./FloatingShapes";
import { LevelCompletionModal } from "./LevelCompletionModal";
import { ShapeRenderer } from "./ShapeRenderer";
import { speakText } from "../utils/speakText";
import { playSound } from "../utils/audio";
import { loadData, saveData } from "../utils/storage";

export interface LevelDefinition<T = any> {
  id: number;
  title: string;
  items: T[];
  color: string;
  gradient: [string, string];
}

interface LearningScreenLayoutProps<T = any> {
  moduleTitle: string;
  categoryType:
    | "alphabet"
    | "numbers"
    | "animals"
    | "fruits"
    | "colors"
    | "vehicles"
    | "vegetables"
    | "solar"
    | "birds"
    | "shapes"
    | "flowers"
    | "jobs";
  progressStorageKey: string;
  completedStorageKey: string;
  themeGradient: [string, string];
  levels: LevelDefinition<T>[];
}

export function LearningScreenLayout<T extends Record<string, any>>({
  moduleTitle,
  categoryType,
  progressStorageKey,
  completedStorageKey,
  themeGradient,
  levels,
}: LearningScreenLayoutProps<T>) {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<"levels" | "learning">("levels");
  const [selectedLevel, setSelectedLevel] = useState<LevelDefinition<T> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Saved Progress
  useEffect(() => {
    const savedProg = loadData<Record<number, number>>(progressStorageKey);
    const savedComp = loadData<number[]>(completedStorageKey);

    if (savedProg) setLevelProgress(savedProg);
    if (savedComp) setCompletedLevels(savedComp);
    setIsLoaded(true);
  }, [progressStorageKey, completedStorageKey]);

  // Save Progress
  useEffect(() => {
    if (isLoaded) {
      saveData(progressStorageKey, levelProgress);
    }
  }, [levelProgress, isLoaded, progressStorageKey]);

  useEffect(() => {
    if (isLoaded) {
      saveData(completedStorageKey, completedLevels);
    }
  }, [completedLevels, isLoaded, completedStorageKey]);

  const totalItemsLearned = useMemo(() => {
    return Object.values(levelProgress).reduce((a, b) => a + b, 0);
  }, [levelProgress]);

  const totalItemsCount = useMemo(() => {
    return levels.reduce((acc, lvl) => acc + lvl.items.length, 0);
  }, [levels]);

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const handleLevelSelect = (level: LevelDefinition<T>) => {
    if (isLevelUnlocked(level.id)) {
      playSound("click");
      setSelectedLevel(level);
      const startIdx = Math.min(
        levelProgress[level.id] || 0,
        level.items.length - 1
      );
      setCurrentIndex(startIdx);
      setCurrentView("learning");
    }
  };

  const handleNext = () => {
    if (!selectedLevel) return;

    playSound("pop");

    const newProg = Math.max(
      levelProgress[selectedLevel.id] || 0,
      currentIndex + 1
    );

    setLevelProgress((prev) => ({
      ...prev,
      [selectedLevel.id]: newProg,
    }));

    if (currentIndex < selectedLevel.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Level Complete
      if (!completedLevels.includes(selectedLevel.id)) {
        setCompletedLevels((prev) => [...prev, selectedLevel.id]);
      }
      setShowCompleteModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      playSound("click");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentItem = selectedLevel ? selectedLevel.items[currentIndex] : null;

  // Speak Current Item
  const handleSpeakCurrent = () => {
    if (!currentItem) return;

    if (categoryType === "alphabet") {
      speakText(`${currentItem.letter} for ${currentItem.example}`);
    } else if (categoryType === "numbers") {
      speakText(currentItem.value.toString());
    } else if (categoryType === "animals") {
      speakText(`${currentItem.name}! ${currentItem.sound || ""}`);
    } else {
      speakText(currentItem.name);
    }
  };

  // Speak when switching cards in learning view
  useEffect(() => {
    if (currentView === "learning" && currentItem) {
      handleSpeakCurrent();
    }
  }, [currentIndex, currentView]);

  return (
    <div className="learning-screen-root">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      {currentView === "levels" ? (
        /* LEVEL SELECTION VIEW */
        <div className="levels-view-container">
          {/* Top Header */}
          <header
            className="levels-top-header"
            style={{
              background: `linear-gradient(135deg, ${themeGradient[0]} 0%, ${themeGradient[1]} 100%)`,
            }}
          >
            <div className="header-top-row">
              <button
                onClick={() => navigate(-1)}
                className="back-btn-round btn-pressable"
                aria-label="Back"
              >
                <ArrowLeft size={22} color={themeGradient[0]} strokeWidth={2.5} />
              </button>
              <h1 className="header-title-text">{moduleTitle}</h1>
              <div style={{ width: 44 }} />
            </div>
          </header>

          <div className="screen-scroll-view levels-scroll">
            {/* Overall Progress Card */}
            <div
              className="overall-prog-card"
              style={{
                background: `linear-gradient(135deg, ${themeGradient[0]} 0%, ${themeGradient[1]} 100%)`,
              }}
            >
              <div className="prog-header-row">
                <span className="prog-title">Overall Progress</span>
                <div className="level-badge-pill">
                  <Star size={15} fill="#FFD700" color="#FFB800" />
                  <span>Level {completedLevels.length + 1}</span>
                </div>
              </div>

              <div className="prog-bar-track">
                <div
                  className="prog-bar-fill"
                  style={{
                    width: `${totalItemsCount > 0 ? (totalItemsLearned / totalItemsCount) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="prog-footer-text">
                {totalItemsLearned} / {totalItemsCount} Learned
              </div>
            </div>

            {/* Levels List */}
            <div className="levels-list">
              {levels.map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.id);
                const completed = completedLevels.includes(lvl.id);
                const prog = levelProgress[lvl.id] || 0;
                const total = lvl.items.length;
                const percent = Math.min(100, (prog / total) * 100);

                return (
                  <div
                    key={lvl.id}
                    onClick={() => handleLevelSelect(lvl)}
                    className={`level-card-item btn-pressable ${
                      unlocked ? "unlocked" : "locked"
                    }`}
                    style={
                      {
                        "--lvl-color": lvl.color,
                        opacity: unlocked ? 1 : 0.65,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="level-number-pod"
                      style={{
                        background: unlocked
                          ? `linear-gradient(135deg, ${lvl.gradient[0]}, ${lvl.gradient[1]})`
                          : "#CBD5E0",
                      }}
                    >
                      {unlocked ? (
                        completed ? (
                          <Star size={24} fill="#FFD700" color="#FFFFFF" />
                        ) : (
                          <span className="lvl-num-text">{lvl.id}</span>
                        )
                      ) : (
                        <Lock size={20} color="white" />
                      )}
                    </div>

                    <div className="level-text-info">
                      <div className="lvl-title-row">
                        <span className="lvl-title-label">{lvl.title}</span>
                        <span className="lvl-count-badge">
                          {prog}/{total}
                        </span>
                      </div>

                      <div className="lvl-sub-bar">
                        <div
                          className="lvl-fill-bar"
                          style={{
                            width: `${percent}%`,
                            background: lvl.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="lvl-action-arrow">
                      <ChevronRight
                        size={22}
                        color={unlocked ? lvl.color : "#A0AEC0"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* LEARNING / FLASHCARD VIEW */
        <div className="flashcard-view-container">
          {/* Learning Header */}
          <header
            className="learning-view-header"
            style={{
              background: `linear-gradient(135deg, ${selectedLevel?.gradient[0]}, ${selectedLevel?.gradient[1]})`,
            }}
          >
            <div className="learning-header-top">
              <button
                onClick={() => setCurrentView("levels")}
                className="close-learning-btn btn-pressable"
                aria-label="Back to levels"
              >
                <X size={24} color="white" strokeWidth={2.5} />
              </button>

              <span className="level-active-title">{selectedLevel?.title}</span>

              <div className="item-counter-pill">
                <Star size={14} fill="#FFD700" color="#FFD700" />
                <span>
                  {currentIndex + 1} / {selectedLevel?.items.length}
                </span>
              </div>
            </div>

            <div className="learning-header-progress-track">
              <div
                className="learning-header-progress-fill"
                style={{
                  width: `${
                    selectedLevel
                      ? ((currentIndex + 1) / selectedLevel.items.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </header>

          <div className="screen-scroll-view learning-scroll">
            {currentItem && (
              <div
                className="flashcard-card-box"
                style={{
                  borderColor: `${selectedLevel?.color}35`,
                }}
              >
                {/* Decorative sparkles */}
                <div className="card-sparkle-top-left">
                  <Sparkles size={20} color={`${selectedLevel?.color}50`} />
                </div>

                {/* Main Visual Display */}
                <div
                  className="card-visual-pod"
                  style={{
                    backgroundColor: `${selectedLevel?.color}12`,
                  }}
                  onClick={handleSpeakCurrent}
                  title="Click to hear sound"
                >
                  {categoryType === "shapes" ? (
                    <ShapeRenderer
                      id={currentItem.id}
                      color={currentItem.color || selectedLevel?.color || "#6C5CE7"}
                      size={130}
                    />
                  ) : categoryType === "colors" ? (
                    <div
                      className="color-swatch-circle"
                      style={{
                        backgroundColor: currentItem.color,
                        boxShadow: `0 8px 24px ${currentItem.color}60`,
                      }}
                    />
                  ) : categoryType === "numbers" ? (
                    <div
                      className="big-number-display"
                      style={{
                        color: selectedLevel?.color,
                        textShadow: `0 4px 14px ${selectedLevel?.color}40`,
                      }}
                    >
                      {currentItem.value}
                    </div>
                  ) : (
                    <img
                      src={currentItem.image}
                      alt={currentItem.name || currentItem.letter}
                      className="card-main-image"
                    />
                  )}
                </div>

                {/* Name / Letter Badge */}
                <div className="item-title-badge">
                  {categoryType === "alphabet" ? (
                    <div className="alphabet-name-row">
                      <span
                        className="big-alphabet-letter"
                        style={{ color: selectedLevel?.color }}
                      >
                        {currentItem.letter}
                      </span>
                      <span className="alphabet-for-text">
                        for {currentItem.example}
                      </span>
                    </div>
                  ) : categoryType === "numbers" ? (
                    <div
                      className="item-name-text"
                      style={{ color: selectedLevel?.color }}
                    >
                      Number {currentItem.value}
                    </div>
                  ) : (
                    <div
                      className="item-name-text"
                      style={{ color: currentItem.color || selectedLevel?.color }}
                    >
                      {currentItem.name}
                    </div>
                  )}
                  <div
                    className="name-underline-pill"
                    style={{ backgroundColor: `${selectedLevel?.color}35` }}
                  />
                </div>

                {/* Big Speaker Button */}
                <button
                  onClick={handleSpeakCurrent}
                  className="btn-hear-sound btn-pressable"
                  style={{
                    background: `linear-gradient(135deg, ${selectedLevel?.color}, ${selectedLevel?.color}DD)`,
                  }}
                >
                  <Volume2 size={26} color="white" />
                  <span>Hear Sound</span>
                </button>

                {/* Animal sound bubble or fact bubble */}
                {currentItem.sound && (
                  <div className="sound-bubble-chip">
                    <span>"{currentItem.sound}"</span>
                  </div>
                )}

                {/* Animal Details / Facts if available */}
                {currentItem.details && (
                  <div className="animal-details-grid">
                    <div className="detail-tag">
                      <span className="detail-tag-label">Food:</span>
                      <span className="detail-tag-val">{currentItem.details.food}</span>
                    </div>
                    <div className="detail-tag">
                      <span className="detail-tag-label">Home:</span>
                      <span className="detail-tag-val">{currentItem.details.habitat}</span>
                    </div>
                    <div className="detail-tag wide">
                      <span className="detail-tag-label">Fun Fact:</span>
                      <span className="detail-tag-val">{currentItem.details.fact}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="learning-nav-controls">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="nav-control-btn btn-back btn-pressable"
              >
                <ChevronLeft size={22} />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="nav-control-btn btn-next btn-pressable"
                style={{
                  background: selectedLevel?.color,
                }}
              >
                <span>
                  {selectedLevel &&
                  currentIndex === selectedLevel.items.length - 1
                    ? "Finish"
                    : "Next"}
                </span>
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      <LevelCompletionModal
        isOpen={showCompleteModal}
        levelTitle={selectedLevel?.title || ""}
        hasNextLevel={
          selectedLevel
            ? levels.findIndex((l) => l.id === selectedLevel.id) <
              levels.length - 1
            : false
        }
        onNextLevel={() => {
          setShowCompleteModal(false);
          if (selectedLevel) {
            const nextLvlIndex = levels.findIndex((l) => l.id === selectedLevel.id) + 1;
            if (nextLvlIndex < levels.length) {
              handleLevelSelect(levels[nextLvlIndex]);
            }
          }
        }}
        onBackToLevels={() => {
          setShowCompleteModal(false);
          setCurrentView("levels");
        }}
      />

      <style>{`
        .learning-screen-root {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .levels-view-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .levels-top-header {
          padding: 18px 20px 24px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 20;
        }

        .levels-scroll {
          padding: 16px 18px 80px 18px;
        }

        .overall-prog-card {
          border-radius: 28px;
          padding: 20px 22px;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          margin-bottom: 20px;
          border: 2px solid rgba(255, 255, 255, 0.4);
        }

        .prog-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .prog-title {
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -0.3px;
        }

        .level-badge-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
        }

        .prog-bar-track {
          height: 14px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .prog-bar-fill {
          height: 100%;
          background: #FFD700;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .prog-footer-text {
          font-size: 13px;
          font-weight: 700;
          text-align: right;
          opacity: 0.95;
        }

        .levels-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wide-mode .levels-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .level-card-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 14px 18px;
          border-radius: 24px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          border: 1.5px solid #F1F3F5;
          cursor: pointer;
        }

        .level-number-pod {
          width: 50px;
          height: 50px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          flex-shrink: 0;
        }

        .lvl-num-text {
          font-size: 20px;
          font-weight: 900;
        }

        .level-text-info {
          flex: 1;
        }

        .lvl-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .lvl-title-label {
          font-size: 16px;
          font-weight: 800;
          color: #2D3436;
        }

        .lvl-count-badge {
          font-size: 12.5px;
          font-weight: 700;
          color: #718096;
        }

        .lvl-sub-bar {
          height: 8px;
          background: #EDF2F7;
          border-radius: 6px;
          overflow: hidden;
        }

        .lvl-fill-bar {
          height: 100%;
          border-radius: 6px;
          transition: width 0.4s ease;
        }

        /* Flashcard View Styles */
        .flashcard-view-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .learning-view-header {
          padding: 16px 20px 20px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 20;
        }

        .learning-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .close-learning-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .level-active-title {
          font-size: 18px;
          font-weight: 800;
        }

        .item-counter-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
        }

        .learning-header-progress-track {
          height: 8px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
          overflow: hidden;
        }

        .learning-header-progress-fill {
          height: 100%;
          background: white;
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .learning-scroll {
          padding: clamp(10px, 1.8vh, 18px) 16px clamp(20px, 3.5vh, 36px) 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .flashcard-card-box {
          width: 100%;
          max-width: 380px;
          background: white;
          border-radius: 28px;
          padding: clamp(14px, 2vh, 22px) 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 3.5px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-bottom: clamp(10px, 1.8vh, 18px);
          animation: bounceIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-sparkle-top-left {
          position: absolute;
          top: 14px;
          left: 14px;
        }

        .card-visual-pod {
          width: clamp(130px, 19vh, 180px);
          height: clamp(130px, 19vh, 180px);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(8px, 1.4vh, 14px);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .card-visual-pod:hover {
          transform: scale(1.05);
        }

        .card-main-image {
          width: clamp(100px, 14vh, 140px);
          height: clamp(100px, 14vh, 140px);
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
        }

        .color-swatch-circle {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 6px solid white;
        }

        .big-number-display {
          font-size: 88px;
          font-weight: 900;
          font-family: inherit;
        }

        .item-title-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }

        .alphabet-name-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .big-alphabet-letter {
          font-size: 42px;
          font-weight: 900;
          line-height: 1;
        }

        .alphabet-for-text {
          font-size: 24px;
          font-weight: 800;
          color: #2D3436;
        }

        .item-name-text {
          font-size: 28px;
          font-weight: 900;
          text-align: center;
        }

        .name-underline-pill {
          width: 60px;
          height: 6px;
          border-radius: 3px;
          margin-top: 4px;
        }

        .btn-hear-sound {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 25px;
          color: white;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          margin-bottom: 12px;
        }

        .sound-bubble-chip {
          background: #FFF8E1;
          color: #F57F17;
          border: 1.5px solid #FFE082;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .animal-details-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          margin-top: 8px;
        }

        .detail-tag {
          flex: 1 1 45%;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 6px 10px;
          font-size: 12px;
          display: flex;
          gap: 6px;
        }

        .detail-tag.wide {
          flex: 1 1 100%;
        }

        .detail-tag-label {
          font-weight: 800;
          color: #4A5568;
        }

        .detail-tag-val {
          font-weight: 600;
          color: #1A202C;
        }

        .learning-nav-controls {
          display: flex;
          gap: 14px;
          width: 100%;
          max-width: 380px;
        }

        .nav-control-btn {
          flex: 1;
          height: 52px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 16px;
          font-weight: 800;
        }

        .btn-back {
          background: white;
          border: 2px solid #E2E8F0;
          color: #4A5568;
        }

        .btn-back:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-next {
          color: white;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
