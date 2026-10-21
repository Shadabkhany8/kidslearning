import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { SHAPES, ShapeItem } from "../../constants/shapeData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<ShapeItem>[] = [
  {
    id: 1,
    title: "Basic Shapes",
    items: SHAPES.slice(0, 5),
    color: "#FFC107",
    gradient: ["#FFC107", "#FFE082"],
  },
  {
    id: 2,
    title: "Geometry Fun",
    items: SHAPES.slice(5, 10),
    color: "#2196F3",
    gradient: ["#2196F3", "#90CAF9"],
  },
  {
    id: 3,
    title: "Curved & Straight",
    items: SHAPES.slice(10, 15),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#A5D6A7"],
  },
  {
    id: 4,
    title: "3D Wonders",
    items: SHAPES.slice(15, 20),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#CE93D8"],
  },
];

export const ShapesPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Shapes Learning"
      categoryType="shapes"
      progressStorageKey={STORAGE_KEYS.SHAPES_PROGRESS}
      completedStorageKey={STORAGE_KEYS.SHAPES_COMPLETED_LEVELS}
      themeGradient={["#FFC107", "#FFA000"]}
      levels={LEVELS}
    />
  );
};
