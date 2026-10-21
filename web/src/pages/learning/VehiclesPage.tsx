import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import { VEHICLES, VehicleItem } from "../../constants/vehicleData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<VehicleItem>[] = [
  {
    id: 1,
    title: "Everyday Rides",
    items: VEHICLES.slice(0, 5),
    color: "#3F51B5",
    gradient: ["#3F51B5", "#7986CB"],
  },
  {
    id: 2,
    title: "Fast & High",
    items: VEHICLES.slice(5, 10),
    color: "#2196F3",
    gradient: ["#2196F3", "#64B5F6"],
  },
  {
    id: 3,
    title: "City Helpers",
    items: VEHICLES.slice(10, 16),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFB74D"],
  },
  {
    id: 4,
    title: "Heavy Duty",
    items: VEHICLES.slice(16, 22),
    color: "#E91E63",
    gradient: ["#E91E63", "#F06292"],
  },
  {
    id: 5,
    title: "Water & Wings",
    items: VEHICLES.slice(22, 28),
    color: "#00BCD4",
    gradient: ["#00BCD4", "#4DD0E1"],
  },
  {
    id: 6,
    title: "Vehicle Master",
    items: VEHICLES.slice(28, 33),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#81C784"],
  },
];

export const VehiclesPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Vehicles Learning"
      categoryType="vehicles"
      progressStorageKey={STORAGE_KEYS.VEHICLES_PROGRESS}
      completedStorageKey={STORAGE_KEYS.VEHICLES_COMPLETED_LEVELS}
      themeGradient={["#3F51B5", "#7986CB"]}
      levels={LEVELS}
    />
  );
};
