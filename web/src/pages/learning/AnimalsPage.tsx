import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { ANIMALS, AnimalItem } from "../../constants/animalData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<AnimalItem>[] = [
  {
    id: 1,
    title: "First Friends",
    items: ANIMALS.slice(0, 5),
    color: "#FF6B6B",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: 2,
    title: "Wild Wonders",
    items: ANIMALS.slice(5, 10),
    color: "#4ECDC4",
    gradient: ["#4ECDC4", "#71DFD7"],
  },
  {
    id: 3,
    title: "Forest Fun",
    items: ANIMALS.slice(10, 15),
    color: "#FFD93D",
    gradient: ["#FFD93D", "#FFE67C"],
  },
  {
    id: 4,
    title: "Big & Strong",
    items: ANIMALS.slice(15, 20),
    color: "#6C5CE7",
    gradient: ["#6C5CE7", "#A29BFE"],
  },
  {
    id: 5,
    title: "Night Explorers",
    items: ANIMALS.slice(20, 25),
    color: "#FF8066",
    gradient: ["#FF8066", "#FFB3A1"],
  },
  {
    id: 6,
    title: "Ocean Master",
    items: ANIMALS.slice(25, 31),
    color: "#45AAF2",
    gradient: ["#45AAF2", "#4BCFFA"],
  },
];

export const AnimalsPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Animals Learning"
      categoryType="animals"
      progressStorageKey={STORAGE_KEYS.ANIMALS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.ANIMALS_COMPLETED_LEVELS}
      themeGradient={["#4CAF50", "#81C784"]}
      levels={LEVELS}
    />
  );
};
