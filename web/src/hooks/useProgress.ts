import { useCallback, useEffect, useState } from "react";
import { ALPHABET } from "../constants/alphabetData";
import { ANIMALS } from "../constants/animalData";
import { BIRDS } from "../constants/birdData";
import { APP_COLORS } from "../constants/colorData";
import { COMMUNITY_HELPERS } from "../constants/communityData";
import { FEATURE_CATEGORIES } from "../constants/featureData";
import { FLOWERS } from "../constants/flowerData";
import { FRUITS } from "../constants/fruitData";
import { SHAPES } from "../constants/shapeData";
import { SOLAR_SYSTEM } from "../constants/solarSystemData";
import { VEGETABLES } from "../constants/vegetableData";
import { VEHICLES } from "../constants/vehicleData";
import { loadData, STORAGE_KEYS } from "../utils/storage";

export interface CategoryProgress {
  level: number;
  detail: string;
  percentage: number;
}

export interface AppProgress {
  overallPercentage: number;
  overallLevel: number;
  totalStars: number;
  categories: Record<string, CategoryProgress>;
}

export const useProgress = () => {
  const [progress, setProgress] = useState<AppProgress>({
    overallPercentage: 0,
    overallLevel: 1,
    totalStars: 0,
    categories: {},
  });

  const fetchProgress = useCallback(() => {
    const categories: Record<string, CategoryProgress> = {};
    let totalPercentage = 0;
    let totalStarsCount = 0;
    const learningCategories = FEATURE_CATEGORIES.learning;

    for (const category of learningCategories) {
      let progressKey = "";
      let completedLevelsKey = "";
      let totalItems = 0;
      let detail = "Basic";

      switch (category.id) {
        case "abc":
          progressKey = STORAGE_KEYS.ALPHABET_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.ALPHABET_COMPLETED_LEVELS;
          totalItems = ALPHABET.length;
          break;
        case "numbers":
          progressKey = STORAGE_KEYS.NUMBERS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.NUMBERS_COMPLETED_LEVELS;
          totalItems = 100;
          break;
        case "animals":
          progressKey = STORAGE_KEYS.ANIMALS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.ANIMALS_COMPLETED_LEVELS;
          totalItems = ANIMALS.length;
          break;
        case "colors":
          progressKey = STORAGE_KEYS.COLORS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.COLORS_COMPLETED_LEVELS;
          totalItems = APP_COLORS.length;
          break;
        case "fruits":
          progressKey = STORAGE_KEYS.FRUITS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.FRUITS_COMPLETED_LEVELS;
          totalItems = FRUITS.length;
          break;
        case "vegetables":
          progressKey = STORAGE_KEYS.VEGETABLES_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.VEGETABLES_COMPLETED_LEVELS;
          totalItems = VEGETABLES.length;
          break;
        case "vehicles":
          progressKey = STORAGE_KEYS.VEHICLES_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.VEHICLES_COMPLETED_LEVELS;
          totalItems = VEHICLES.length;
          break;
        case "birds":
          progressKey = STORAGE_KEYS.BIRDS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.BIRDS_COMPLETED_LEVELS;
          totalItems = BIRDS.length;
          break;
        case "shapes":
          progressKey = STORAGE_KEYS.SHAPES_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.SHAPES_COMPLETED_LEVELS;
          totalItems = SHAPES.length;
          break;
        case "solar":
          progressKey = STORAGE_KEYS.SOLAR_SYSTEM_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.SOLAR_SYSTEM_COMPLETED_LEVELS;
          totalItems = SOLAR_SYSTEM.length;
          break;
        case "flowers":
          progressKey = STORAGE_KEYS.FLOWERS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.FLOWERS_COMPLETED_LEVELS;
          totalItems = FLOWERS.length;
          break;
        case "community-helpers":
          progressKey = STORAGE_KEYS.COMMUNITY_HELPERS_PROGRESS;
          completedLevelsKey = STORAGE_KEYS.COMMUNITY_HELPERS_COMPLETED_LEVELS;
          totalItems = COMMUNITY_HELPERS.length;
          break;
        default:
          progressKey = `${category.id}_progress`;
          completedLevelsKey = `${category.id}_completed_levels`;
          totalItems = 10;
      }

      const savedProgress = loadData<Record<string, number>>(progressKey);
      const savedCompleted = loadData<number[]>(completedLevelsKey);

      const completedCount = savedProgress
        ? Object.values(savedProgress).reduce((a, b) => a + b, 0)
        : 0;

      const completedLevels = Array.isArray(savedCompleted) ? savedCompleted : [];
      const level = completedLevels.length + 1;
      const percentage = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

      // Total stars across all categories
      totalStarsCount += completedCount;

      // Determine detail text
      if (category.id === "abc") {
        const lastIndex = Math.min(completedCount, ALPHABET.length - 1);
        const startChar = ALPHABET[Math.max(0, completedCount - 3)]?.letter || "A";
        const endChar = ALPHABET[lastIndex]?.letter || "C";
        detail = completedCount > 0 ? `${startChar}-${endChar}` : "A-C";
      } else if (category.id === "numbers") {
        detail =
          completedCount > 0
            ? `1-${Math.min(completedCount + 5, 100)}`
            : "1-10";
      } else {
        detail = `${completedCount}/${totalItems}`;
      }

      categories[category.id] = {
        level,
        detail,
        percentage,
      };
      totalPercentage += percentage;
    }

    const avgPercentage = totalPercentage / learningCategories.length;
    const overallLevel = Math.floor(avgPercentage / 20) + 1;

    setProgress({
      overallPercentage: avgPercentage,
      overallLevel,
      totalStars: totalStarsCount,
      categories,
    });
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { ...progress, refreshProgress: fetchProgress };
};
