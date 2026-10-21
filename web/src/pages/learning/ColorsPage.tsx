import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { APP_COLORS, ColorItem } from "../../constants/colorData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<ColorItem>[] = [
  {
    id: 1,
    title: "Basic Rainbow",
    items: APP_COLORS.slice(0, 6),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#E1BEE7"],
  },
  {
    id: 2,
    title: "Soft & Deep",
    items: APP_COLORS.slice(6, 12),
    color: "#FF4081",
    gradient: ["#FF4081", "#F8BBD0"],
  },
  {
    id: 3,
    title: "Classic Tones",
    items: APP_COLORS.slice(12, 18),
    color: "#009688",
    gradient: ["#009688", "#B2DFDB"],
  },
  {
    id: 4,
    title: "Exotic Hues",
    items: APP_COLORS.slice(18, 22),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFE0B2"],
  },
];

export const ColorsPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Colors Learning"
      categoryType="colors"
      progressStorageKey={STORAGE_KEYS.COLORS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.COLORS_COMPLETED_LEVELS}
      themeGradient={["#9C27B0", "#E1BEE7"]}
      levels={LEVELS}
    />
  );
};
