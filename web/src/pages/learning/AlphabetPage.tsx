import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { ALPHABET, AlphabetItem } from "../../constants/alphabetData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<AlphabetItem>[] = [
  {
    id: 1,
    title: "First Steps",
    items: ALPHABET.slice(0, 5),
    color: "#FF6B6B",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: 2,
    title: "Growing Fast",
    items: ALPHABET.slice(5, 10),
    color: "#4ECDC4",
    gradient: ["#4ECDC4", "#71DFD7"],
  },
  {
    id: 3,
    title: "Smart Kids",
    items: ALPHABET.slice(10, 15),
    color: "#FFD93D",
    gradient: ["#FFD93D", "#FFE67C"],
  },
  {
    id: 4,
    title: "Super Stars",
    items: ALPHABET.slice(15, 20),
    color: "#6C5CE7",
    gradient: ["#6C5CE7", "#A29BFE"],
  },
  {
    id: 5,
    title: "Alphabet Master",
    items: ALPHABET.slice(20, 26),
    color: "#FF8066",
    gradient: ["#FF8066", "#FFB3A1"],
  },
];

export const AlphabetPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Alphabet Learning"
      categoryType="alphabet"
      progressStorageKey={STORAGE_KEYS.ALPHABET_PROGRESS}
      completedStorageKey={STORAGE_KEYS.ALPHABET_COMPLETED_LEVELS}
      themeGradient={["#FF9A9E", "#FECFEF"]}
      levels={LEVELS}
    />
  );
};
