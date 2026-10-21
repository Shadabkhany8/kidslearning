import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { VEGETABLES, VegetableItem } from "../../constants/vegetableData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<VegetableItem>[] = [
  {
    id: 1,
    title: "Crunchy Starters",
    items: VEGETABLES.slice(0, 5),
    color: "#8BC34A",
    gradient: ["#8BC34A", "#AED581"],
  },
  {
    id: 2,
    title: "Green Power",
    items: VEGETABLES.slice(5, 10),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#81C784"],
  },
  {
    id: 3,
    title: "Garden Goodies",
    items: VEGETABLES.slice(10, 15),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFB74D"],
  },
  {
    id: 4,
    title: "Veggie Champions",
    items: VEGETABLES.slice(15, 20),
    color: "#E91E63",
    gradient: ["#E91E63", "#F48FB1"],
  },
  {
    id: 5,
    title: "Veggie Master",
    items: VEGETABLES.slice(20, 28),
    color: "#673AB7",
    gradient: ["#673AB7", "#9575CD"],
  },
];

export const VegetablesPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Vegetables Learning"
      categoryType="vegetables"
      progressStorageKey={STORAGE_KEYS.VEGETABLES_PROGRESS}
      completedStorageKey={STORAGE_KEYS.VEGETABLES_COMPLETED_LEVELS}
      themeGradient={["#8BC34A", "#AED581"]}
      levels={LEVELS}
    />
  );
};
