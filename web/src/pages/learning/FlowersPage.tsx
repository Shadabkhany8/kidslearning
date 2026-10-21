import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { FLOWERS, FlowerItem } from "../../constants/flowerData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<FlowerItem>[] = [
  {
    id: 1,
    title: "Garden Favorites",
    items: FLOWERS.slice(0, 6),
    color: "#FF80AB",
    gradient: ["#FF80AB", "#FFC0CB"],
  },
  {
    id: 2,
    title: "Wild Blooms",
    items: FLOWERS.slice(6, 12),
    color: "#E91E63",
    gradient: ["#E91E63", "#F48FB1"],
  },
  {
    id: 3,
    title: "Exotic Petals",
    items: FLOWERS.slice(12, 18),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#CE93D8"],
  },
  {
    id: 4,
    title: "Colorful Blossoms",
    items: FLOWERS.slice(18, 24),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFCC80"],
  },
  {
    id: 5,
    title: "Floral Master",
    items: FLOWERS.slice(24, 30),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#A5D6A7"],
  },
];

export const FlowersPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Flowers Learning"
      categoryType="flowers"
      progressStorageKey={STORAGE_KEYS.FLOWERS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.FLOWERS_COMPLETED_LEVELS}
      themeGradient={["#FF80AB", "#FFC0CB"]}
      levels={LEVELS}
    />
  );
};
