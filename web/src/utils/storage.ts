export const STORAGE_KEYS = {
  ALPHABET_PROGRESS: "alphabet_progress",
  ALPHABET_COMPLETED_LEVELS: "alphabet_completed_levels",
  NUMBERS_PROGRESS: "numbers_progress",
  NUMBERS_COMPLETED_LEVELS: "numbers_completed_levels",
  ANIMALS_PROGRESS: "animals_progress",
  ANIMALS_COMPLETED_LEVELS: "animals_completed_levels",
  FRUITS_PROGRESS: "fruits_progress",
  FRUITS_COMPLETED_LEVELS: "fruits_completed_levels",
  COLORS_PROGRESS: "colors_progress",
  COLORS_COMPLETED_LEVELS: "colors_completed_levels",
  VEHICLES_PROGRESS: "vehicles_progress",
  VEHICLES_COMPLETED_LEVELS: "vehicles_completed_levels",
  VEGETABLES_PROGRESS: "vegetables_progress",
  VEGETABLES_COMPLETED_LEVELS: "vegetables_completed_levels",
  SOLAR_SYSTEM_PROGRESS: "solar_system_progress",
  SOLAR_SYSTEM_COMPLETED_LEVELS: "solar_system_completed_levels",
  BIRDS_PROGRESS: "birds_progress",
  BIRDS_COMPLETED_LEVELS: "birds_completed_levels",
  SHAPES_PROGRESS: "shapes_progress",
  SHAPES_COMPLETED_LEVELS: "shapes_completed_levels",
  FLOWERS_PROGRESS: "flowers_progress",
  FLOWERS_COMPLETED_LEVELS: "flowers_completed_levels",
  COMMUNITY_HELPERS_PROGRESS: "community_helpers_progress",
  COMMUNITY_HELPERS_COMPLETED_LEVELS: "community_helpers_completed_levels",
  COLOR_FILL_PROGRESS: "color_fill_progress",
  COLOR_FILL_COMPLETED_LEVELS: "color_fill_completed_levels",
  SETTINGS: "app_settings",
};

export const saveData = (key: string, value: any): void => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error saving data for key ${key}:`, e);
  }
};

export const loadData = <T = any>(key: string): T | null => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error loading data for key ${key}:`, e);
    return null;
  }
};

export const clearData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error clearing data for key ${key}:`, e);
  }
};

export const resetAllProgress = (): void => {
  try {
    const keys = Object.values(STORAGE_KEYS).filter(
      (key) => key !== STORAGE_KEYS.SETTINGS,
    );
    keys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error("Error resetting all progress:", e);
  }
};
