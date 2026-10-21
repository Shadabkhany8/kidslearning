import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { SOLAR_SYSTEM, SolarSystemItem } from "../../constants/solarSystemData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<SolarSystemItem>[] = [
  {
    id: 1,
    title: "Inner Planets & Sun",
    items: SOLAR_SYSTEM.slice(0, 4),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFD54F"],
  },
  {
    id: 2,
    title: "Outer Planets & Moon",
    items: SOLAR_SYSTEM.slice(4, 8),
    color: "#2196F3",
    gradient: ["#2196F3", "#64B5F6"],
  },
];

export const SolarSystemPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Solar System Learning"
      categoryType="solar"
      progressStorageKey={STORAGE_KEYS.SOLAR_SYSTEM_PROGRESS}
      completedStorageKey={STORAGE_KEYS.SOLAR_SYSTEM_COMPLETED_LEVELS}
      themeGradient={["#2196F3", "#1976D2"]}
      levels={LEVELS}
    />
  );
};
