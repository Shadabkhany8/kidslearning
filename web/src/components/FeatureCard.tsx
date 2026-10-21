import React from "react";
import { playSound } from "../utils/audio";

interface FeatureCardProps {
  title: string;
  image: string;
  gradient: [string, string];
  color?: string;
  onPress: () => void;
  index: number;
  level?: number;
  detail?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  image,
  gradient,
  color = "#6C5CE7",
  onPress,
  level = 1,
  detail = "Basic",
}) => {
  const handleClick = () => {
    playSound("pop");
    onPress();
  };

  return (
    <div
      onClick={handleClick}
      className="feature-card-wrapper"
      style={
        {
          "--card-color": color,
          cursor: "pointer",
        } as React.CSSProperties
      }
    >
      <div
        className="feature-card-inner"
        style={{
          border: `2.5px solid ${color}35`,
        }}
      >
        {/* Top Part with Gradient & Illustration */}
        <div
          className="feature-card-top"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          }}
        >
          {/* Shimmer sweep effect */}
          <div className="card-shimmer" />

          {/* Decorative background circles */}
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-circle deco-circle-3" />

          {/* Icon / Image container with soft glow */}
          <div
            className="icon-pod"
            style={{
              boxShadow: `0 8px 20px ${color}40`,
            }}
          >
            <img
              src={image}
              alt={title}
              className="card-feature-img"
              loading="lazy"
              onError={(e) => {
                // Fallback icon placeholder if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Bottom Part with Title and Level Pill */}
        <div
          className="feature-card-bottom"
          style={{
            backgroundColor: `${color}0D`,
          }}
        >
          <div
            className="card-title-text"
            style={{ color: color }}
            title={title}
          >
            {title}
          </div>
          <div
            className="card-level-pill"
            style={{
              backgroundColor: `${color}18`,
              borderColor: `${color}35`,
              color: color,
            }}
          >
            <span>Level {level}</span>
            <span style={{ opacity: 0.5, margin: "0 3px" }}>•</span>
            <span>{detail}</span>
          </div>
        </div>
      </div>

      <style>{`
        .feature-card-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 130px;
          height: clamp(160px, 20.5vh, 195px);
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
        }

        .wide-mode .feature-card-wrapper {
          height: clamp(165px, 21.5vh, 205px);
        }

        .feature-card-wrapper:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .feature-card-wrapper:active {
          transform: scale(0.96);
        }

        .feature-card-inner {
          width: 100%;
          height: 100%;
          border-radius: 26px;
          background: #FFFFFF;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
          position: relative;
        }

        .feature-card-top {
          height: 62%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .card-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          width: 60%;
          animation: shimmerSweep 3.5s infinite;
          pointer-events: none;
        }

        .icon-pod {
          width: clamp(62px, 7.8vh, 74px);
          height: clamp(62px, 7.8vh, 74px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.32);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: transform 0.2s ease;
        }

        .feature-card-wrapper:hover .icon-pod {
          transform: scale(1.08) rotate(3deg);
        }

        .card-feature-img {
          width: clamp(44px, 5.5vh, 52px);
          height: clamp(44px, 5.5vh, 52px);
          object-fit: contain;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.14));
        }

        .deco-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }
        .deco-circle-1 {
          width: 65px;
          height: 65px;
          top: -12px;
          right: -12px;
        }
        .deco-circle-2 {
          width: 42px;
          height: 42px;
          bottom: -8px;
          left: -8px;
        }
        .deco-circle-3 {
          width: 28px;
          height: 28px;
          top: 10px;
          left: -10px;
        }

        .feature-card-bottom {
          height: 38%;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }

        .card-title-text {
          font-size: clamp(14.5px, 1.95vh, 16.5px);
          font-weight: 800;
          letter-spacing: -0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 95%;
          text-align: center;
        }

        .card-level-pill {
          font-size: clamp(10.5px, 1.35vh, 11.5px);
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};
