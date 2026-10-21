import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { NUMBERS, NumberItem } from "../../constants/data";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<NumberItem>[] = [
  {
    id: 1,
    title: "Counting 1-10",
    items: NUMBERS.slice(0, 10),
    color: "#FF6B6B",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: 2,
    title: "Teen Numbers (11-20)",
    items: NUMBERS.slice(10, 20),
    color: "#4ECDC4",
    gradient: ["#4ECDC4", "#71DFD7"],
  },
  {
    id: 3,
    title: "Twenty's Fun (21-30)",
    items: NUMBERS.slice(20, 30),
    color: "#FFD93D",
    gradient: ["#FFD93D", "#FFE67C"],
  },
  {
    id: 4,
    title: "Thirty's Power (31-40)",
    items: NUMBERS.slice(30, 40),
    color: "#6C5CE7",
    gradient: ["#6C5CE7", "#A29BFE"],
  },
  {
    id: 5,
    title: "Forty's Club (41-50)",
    items: NUMBERS.slice(40, 50),
    color: "#FF8066",
    gradient: ["#FF8066", "#FFB3A1"],
  },
  {
    id: 6,
    title: "Fifty's Milestone (51-60)",
    items: NUMBERS.slice(50, 60),
    color: "#00CEC9",
    gradient: ["#00CEC9", "#81ECEC"],
  },
  {
    id: 7,
    title: "Sixty's Sprint (61-70)",
    items: NUMBERS.slice(60, 70),
    color: "#FFD3B6",
    gradient: ["#FF9800", "#FFCC80"],
  },
  {
    id: 8,
    title: "Seventy's Spirit (71-80)",
    items: NUMBERS.slice(70, 80),
    color: "#FFAAA5",
    gradient: ["#FF7675", "#FAB1A0"],
  },
  {
    id: 9,
    title: "Eighty's Excellence (81-90)",
    items: NUMBERS.slice(80, 90),
    color: "#81ECEC",
    gradient: ["#00B894", "#55EFC4"],
  },
  {
    id: 10,
    title: "Number Master 100 (91-100)",
    items: NUMBERS.slice(90, 100),
    color: "#FF7675",
    gradient: ["#E17055", "#FAB1A0"],
  },
];

export const NumbersPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Numbers Learning"
      categoryType="numbers"
      progressStorageKey={STORAGE_KEYS.NUMBERS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.NUMBERS_COMPLETED_LEVELS}
      themeGradient={["#FF9800", "#FFCC80"]}
      levels={LEVELS}
    />
  );
};
