import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  RotateCcw,
} from "lucide-react";
import { FloatingShapes } from "../../components/FloatingShapes";
import { LevelCompletionModal } from "../../components/LevelCompletionModal";
import { COLORING_PAGES, ColoringPage } from "../../constants/coloringData";
import { COLORS } from "../../constants/data";
import { playSound } from "../../utils/audio";
import { loadData, saveData, STORAGE_KEYS } from "../../utils/storage";

const PALETTE = [
  "#FF7675",
  "#FDCB6E",
  "#55EFC4",
  "#81ECEC",
  "#6C5CE7",
  "#A29BFE",
  "#FF9800",
  "#4CAF50",
  "#2196F3",
  "#E91E63",
  "#795548",
  "#FFFFFF",
];

const LEVELS = [
  {
    id: 1,
    title: "Basic Shapes",
    items: COLORING_PAGES.slice(0, 3),
    color: "#FF9800",
    gradient: ["#FF9800", "#F57C00"] as [string, string],
  },
  {
    id: 2,
    title: "Nature Fun",
    items: COLORING_PAGES.slice(3, 6),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#388E3C"] as [string, string],
  },
  {
    id: 3,
    title: "Animal Friends",
    items: COLORING_PAGES.slice(6, 9),
    color: "#2196F3",
    gradient: ["#2196F3", "#1976D2"] as [string, string],
  },
  {
    id: 4,
    title: "Vroom Vehicles",
    items: COLORING_PAGES.slice(9, 12),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#7B1FA2"] as [string, string],
  },
  {
    id: 5,
    title: "Fresh Fruits",
    items: COLORING_PAGES.slice(12, 15),
    color: "#F44336",
    gradient: ["#F44336", "#D32F2F"] as [string, string],
  },
  {
    id: 6,
    title: "Healthy Veggies",
    items: COLORING_PAGES.slice(15, 18),
    color: "#8BC34A",
    gradient: ["#8BC34A", "#689F38"] as [string, string],
  },
];

export const ColorFillGamePage: React.FC = () => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<"levels" | "coloring">("levels");
  const [selectedLevel, setSelectedLevel] = useState<(typeof LEVELS)[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedColor, setSelectedColor] = useState(COLORS.primary);
  const [filledColors, setFilledColors] = useState<Record<string, string>>({});

  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress
  useEffect(() => {
    const savedProg = loadData<Record<number, number>>(
      STORAGE_KEYS.COLOR_FILL_PROGRESS
    );
    const savedComp = loadData<number[]>(
      STORAGE_KEYS.COLOR_FILL_COMPLETED_LEVELS
    );

    if (savedProg) setLevelProgress(savedProg);
    if (savedComp) setCompletedLevels(savedComp);
    setIsLoaded(true);
  }, []);

  // Save progress
  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.COLOR_FILL_PROGRESS, levelProgress);
    }
  }, [levelProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.COLOR_FILL_COMPLETED_LEVELS, completedLevels);
    }
  }, [completedLevels, isLoaded]);

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const handleLevelSelect = (level: (typeof LEVELS)[0]) => {
    if (isLevelUnlocked(level.id)) {
      playSound("click");
      setSelectedLevel(level);
      setCurrentIndex(0);
      setFilledColors({});
      setCurrentView("coloring");
    }
  };

  const currentPage: ColoringPage | null = selectedLevel
    ? selectedLevel.items[currentIndex]
    : null;

  const handleAreaClick = (areaId: string) => {
    playSound("pop");
    setFilledColors((prev) => ({
      ...prev,
      [areaId]: selectedColor,
    }));
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
      setCurrentIndex((i) => i + 1);
      setFilledColors({});
    } else {
      if (!completedLevels.includes(selectedLevel.id)) {
        setCompletedLevels((prev) => [...prev, selectedLevel.id]);
      }
      setShowCompleteModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      playSound("click");
      setCurrentIndex((i) => i - 1);
      setFilledColors({});
    }
  };

  const handleResetCurrentPage = () => {
    playSound("click");
    setFilledColors({});
  };

  return (
    <div className="color-fill-screen">
      <img
        src="./assets/images/background.png"
        alt="Background"
        className="app-bg-image"
      />
      <FloatingShapes />

      {currentView === "levels" ? (
        /* LEVEL SELECTION */
        <div className="levels-view-container">
          <header className="color-fill-top-header">
            <div className="header-top-row">
              <button
                onClick={() => navigate(-1)}
                className="back-btn-round btn-pressable"
                aria-label="Back"
              >
                <ArrowLeft size={22} color="#FF9800" strokeWidth={2.5} />
              </button>
              <h1 className="header-title-text" style={{ color: "white" }}>
                Color Fill
              </h1>
              <div style={{ width: 44 }} />
            </div>
          </header>

          <div className="screen-scroll-view levels-scroll">
            <div className="levels-list">
              {LEVELS.map((lvl) => {
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* COLORING CANVAS VIEW */
        <div className="coloring-view-container">
          {/* Header */}
          <header
            className="coloring-header"
            style={{
              background: `linear-gradient(135deg, ${selectedLevel?.gradient[0]}, ${selectedLevel?.gradient[1]})`,
            }}
          >
            <div className="coloring-header-top">
              <button
                onClick={() => setCurrentView("levels")}
                className="close-coloring-btn btn-pressable"
                aria-label="Back to levels"
              >
                <X size={22} color="white" strokeWidth={2.5} />
              </button>

              <span className="coloring-header-title">
                {currentPage?.title}
              </span>

              <button
                onClick={handleResetCurrentPage}
                className="close-coloring-btn btn-pressable"
                title="Reset Colors"
              >
                <RotateCcw size={18} color="white" />
              </button>
            </div>
          </header>

          <div className="screen-scroll-view coloring-scroll">
            {/* Interactive SVG Canvas */}
            {currentPage && (
              <div className="svg-coloring-card">
                <svg
                  viewBox={currentPage.viewBox}
                  className="interactive-coloring-svg"
                >
                  {currentPage.areas.map((area) => {
                    const fill = filledColors[area.id] || area.defaultColor;

                    return (
                      <path
                        key={area.id}
                        d={area.path}
                        fill={fill}
                        stroke="#2D3436"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleAreaClick(area.id)}
                        className="clickable-coloring-path"
                      />
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Color Palette Selector */}
            <div className="coloring-palette-picker">
              <div className="palette-grid">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      playSound("click");
                    }}
                    className={`palette-chip-btn ${
                      selectedColor === c ? "active" : ""
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Next/Back */}
            <div className="coloring-nav-row">
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
            ? LEVELS.findIndex((l) => l.id === selectedLevel.id) <
              LEVELS.length - 1
            : false
        }
        onNextLevel={() => {
          setShowCompleteModal(false);
          if (selectedLevel) {
            const nextLvlIndex =
              LEVELS.findIndex((l) => l.id === selectedLevel.id) + 1;
            if (nextLvlIndex < LEVELS.length) {
              handleLevelSelect(LEVELS[nextLvlIndex]);
            }
          }
        }}
        onBackToLevels={() => {
          setShowCompleteModal(false);
          setCurrentView("levels");
        }}
      />

      <style>{`
        .color-fill-screen {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .color-fill-top-header {
          background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
          padding: 18px 20px 24px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          box-shadow: 0 8px 24px rgba(255, 152, 0, 0.25);
          position: relative;
          z-index: 20;
        }

        .coloring-view-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .coloring-header {
          padding: 16px 20px 20px 20px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 20;
        }

        .coloring-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .close-coloring-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coloring-header-title {
          font-size: 19px;
          font-weight: 900;
        }

        .coloring-scroll {
          padding: 20px 18px 40px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .svg-coloring-card {
          width: 100%;
          max-width: 360px;
          aspect-ratio: 1;
          background: white;
          border-radius: 32px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 3px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .interactive-coloring-svg {
          width: 100%;
          height: 100%;
        }

        .clickable-coloring-path {
          cursor: pointer;
          transition: fill 0.2s ease, transform 0.1s ease;
        }

        .clickable-coloring-path:hover {
          filter: brightness(0.95);
        }

        .coloring-palette-picker {
          background: white;
          border-radius: 24px;
          padding: 12px 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 1.5px solid #E2E8F0;
          margin-bottom: 20px;
          width: 100%;
          max-width: 360px;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          justify-items: center;
        }

        .palette-chip-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #E2E8F0;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .palette-chip-btn:hover {
          transform: scale(1.15);
        }

        .palette-chip-btn.active {
          transform: scale(1.25);
          border-color: #2D3436;
        }

        .coloring-nav-row {
          display: flex;
          gap: 14px;
          width: 100%;
          max-width: 360px;
        }
      `}</style>
    </div>
  );
};
