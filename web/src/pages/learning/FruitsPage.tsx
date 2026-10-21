import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { FRUITS, FruitItem } from "../../constants/fruitData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<FruitItem>[] = [
  {
    id: 1,
    title: "Sweet Bites",
    items: FRUITS.slice(0, 5),
    color: "#F44336",
    gradient: ["#F44336", "#FF7675"],
  },
  {
    id: 2,
    title: "Citrus & Berry",
    items: FRUITS.slice(5, 10),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFB74D"],
  },
  {
    id: 3,
    title: "Tropical Treats",
    items: FRUITS.slice(10, 15),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#81C784"],
  },
  {
    id: 4,
    title: "Fruit Master",
    items: FRUITS.slice(15, 20),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#BA68C8"],
  },
];

export const FruitsPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Fruits Learning"
      categoryType="fruits"
      progressStorageKey={STORAGE_KEYS.FRUITS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.FRUITS_COMPLETED_LEVELS}
      themeGradient={["#FF6B6B", "#FFA07A"]}
      levels={LEVELS}
    />
  );
};
