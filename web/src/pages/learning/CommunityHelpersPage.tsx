import React from "react";
import {
  LearningScreenLayout,
  LevelDefinition,
} from "../../components/LearningScreenLayout";
import {
  COMMUNITY_HELPERS,
  CommunityItem,
} from "../../constants/communityData";
import { STORAGE_KEYS } from "../../utils/storage";

const LEVELS: LevelDefinition<CommunityItem>[] = [
  {
    id: 1,
    title: "Everyday Heroes",
    items: COMMUNITY_HELPERS.slice(0, 7),
    color: "#FF5722",
    gradient: ["#FF5722", "#FF8A65"],
  },
  {
    id: 2,
    title: "Creative & Skilled",
    items: COMMUNITY_HELPERS.slice(7, 14),
    color: "#03A9F4",
    gradient: ["#03A9F4", "#4FC3F7"],
  },
];

export const CommunityHelpersPage: React.FC = () => {
  return (
    <LearningScreenLayout
      moduleTitle="Jobs & Helpers"
      categoryType="jobs"
      progressStorageKey={STORAGE_KEYS.COMMUNITY_HELPERS_PROGRESS}
      completedStorageKey={STORAGE_KEYS.COMMUNITY_HELPERS_COMPLETED_LEVELS}
      themeGradient={["#FF5722", "#E64A19"]}
      levels={LEVELS}
    />
  );
};
