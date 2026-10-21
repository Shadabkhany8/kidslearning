import React from "react";

interface ShapeRendererProps {
  id: string;
  color: string;
  size?: number;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  id,
  color,
  size = 110,
}) => {
  const s = size;
  const stroke = color;
  const fill = color;

  switch (id) {
    case "circle":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill={fill} />
        </svg>
      );
    case "square":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="12" y="12" width="76" height="76" rx="12" fill={fill} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,10 90,88 10,88" fill={fill} />
        </svg>
      );
    case "star":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon
            points="50,5 64,36 98,39 72,63 80,96 50,78 20,96 28,63 2,39 36,36"
            fill={fill}
          />
        </svg>
      );
    case "heart":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path
            d="M50 88 C20 60, 5 40, 15 20 C25 5, 45 10, 50 30 C55 10, 75 5, 85 20 C95 40, 80 60, 50 88 Z"
            fill={fill}
          />
        </svg>
      );
    case "diamond":
    case "rhombus":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,8 92,50 50,92 8,50" fill={fill} />
        </svg>
      );
    case "hexagon":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill={fill} />
        </svg>
      );
    case "pentagon":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,8 90,38 75,88 25,88 10,38" fill={fill} />
        </svg>
      );
    case "octagon":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill={fill} />
        </svg>
      );
    case "oval":
    case "ellipse":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="44" ry="30" fill={fill} />
        </svg>
      );
    case "rectangle":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="8" y="24" width="84" height="52" rx="8" fill={fill} />
        </svg>
      );
    case "parallelogram":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="28,24 92,24 72,76 8,76" fill={fill} />
        </svg>
      );
    case "crescent":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill={fill} />
        </svg>
      );
    case "semicircle":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M10 65 A40 40 0 0 1 90 65 Z" fill={fill} />
        </svg>
      );
    case "arrow":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="10,40 55,40 55,20 90,50 55,80 55,60 10,60" fill={fill} />
        </svg>
      );
    case "kite":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,10 85,42 50,92 15,42" fill={fill} />
        </svg>
      );
    case "cylinder":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <ellipse cx="50" cy="25" rx="35" ry="12" fill={fill} />
          <rect x="15" y="25" width="70" height="50" fill={fill} opacity="0.85" />
          <ellipse cx="50" cy="75" rx="35" ry="12" fill={fill} />
        </svg>
      );
    case "cube":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,15 85,32 50,50 15,32" fill={fill} opacity="0.9" />
          <polygon points="15,32 50,50 50,88 15,70" fill={fill} opacity="0.75" />
          <polygon points="50,50 85,32 85,70 50,88" fill={fill} />
        </svg>
      );
    case "cone":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,12 85,76 15,76" fill={fill} />
          <ellipse cx="50" cy="76" rx="35" ry="10" fill={fill} opacity="0.8" />
        </svg>
      );
    case "pyramid":
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,15 88,78 45,86" fill={fill} />
          <polygon points="50,15 45,86 12,74" fill={fill} opacity="0.75" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill={fill} />
        </svg>
      );
  }
};
