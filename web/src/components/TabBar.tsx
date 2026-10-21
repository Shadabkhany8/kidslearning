import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Gamepad2, Settings } from "lucide-react";
import { playSound } from "../utils/audio";

export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // Only show tab bar on main tabs (learn, games, settings)
  const isTabScreen =
    currentPath === "/" ||
    currentPath === "/learn" ||
    currentPath === "/games" ||
    currentPath === "/settings";

  if (!isTabScreen) return null;

  const tabs = [
    {
      id: "learn",
      label: "Learn",
      path: "/learn",
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #FFD93D, #FF922B)",
      color: "#FF922B",
    },
    {
      id: "games",
      label: "Play",
      path: "/games",
      icon: Gamepad2,
      gradient: "linear-gradient(135deg, #4FACFE, #00F2FE)",
      color: "#00F2FE",
    },
    {
      id: "settings",
      label: "Parents",
      path: "/settings",
      icon: Settings,
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)",
      color: "#FF6B6B",
    },
  ];

  const handleTabClick = (path: string) => {
    playSound("click");
    navigate(path);
  };

  return (
    <div className="tab-dock-container">
      <div className="tab-dock-glass">
        {tabs.map((tab) => {
          const isActive =
            (tab.path === "/learn" && (currentPath === "/" || currentPath === "/learn")) ||
            currentPath === tab.path;

          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`tab-item-btn ${isActive ? "active" : ""}`}
              style={
                {
                  "--tab-gradient": tab.gradient,
                  "--tab-color": tab.color,
                } as React.CSSProperties
              }
              aria-label={tab.label}
            >
              <div className="tab-icon-wrapper">
                <IconComponent
                  size={26}
                  strokeWidth={2.4}
                  className="tab-icon"
                />
              </div>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .tab-dock-container {
          position: absolute;
          bottom: max(10px, env(safe-area-inset-bottom, 10px));
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99;
          pointer-events: none;
        }

        .tab-dock-glass {
          pointer-events: auto;
          width: 86%;
          max-width: 380px;
          height: clamp(52px, 6.8vh, 62px);
          border-radius: 35px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 30px rgba(108, 92, 231, 0.2), 0 2px 6px rgba(0, 0, 0, 0.04);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 8px;
        }

        .tab-item-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: clamp(6px, 0.9vh, 8px) clamp(10px, 1.8vw, 18px);
          border-radius: 26px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #718096;
        }

        .tab-item-btn:hover {
          color: #2D3436;
          transform: translateY(-2px);
        }

        .tab-item-btn.active {
          background: var(--tab-gradient);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transform: scale(1.04);
        }

        .tab-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-icon-wrapper svg {
          width: clamp(20px, 2.8vh, 24px);
          height: clamp(20px, 2.8vh, 24px);
        }

        .tab-label {
          font-size: clamp(12px, 1.5vh, 13.5px);
          font-weight: 800;
          letter-spacing: -0.2px;
        }
      `}</style>
    </div>
  );
};
