import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { BIRDS, BirdItem } from "../../constants/birdData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<BirdItem>[] = [
  {
    id: 1,
    title: "Garden Singers",
    items: BIRDS.slice(0, 5),
    color: "#00BCD4",
    gradient: ["#00BCD4", "#80DEEA"],
  },
  {
    id: 2,
    title: "Wild Birds",
    items: BIRDS.slice(5, 10),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#81C784"],
  },
  {
    id: 3,
    title: "Water Fowl",
    items: BIRDS.slice(10, 16),
    color: "#03A9F4",
    gradient: ["#03A9F4", "#81D4FA"],
  },
  {
    id: 4,
    title: "Sky Hunters",
    items: BIRDS.slice(16, 22),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFB74D"],
  },
  {
    id: 5,
    title: "Bird Master",
    items: BIRDS.slice(22, 27),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#CE93D8"],
  },
];

export const BirdsPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Birds Learning"
      categoryType="birds"
      progressStorageKey={STORAGE_KEYS.BIRDS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.BIRDS_COMPLETED_LEVELS}
      themeGradient={["#00BCD4", "#80DEEA"]}
      levels={LEVELS}
    />
  );
};
