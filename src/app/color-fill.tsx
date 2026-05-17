import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
    Layout,
    SlideInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { G, Path, Svg } from "react-native-svg";
import FloatingShapes from "../components/FloatingShapes";
import { COLORING_PAGES } from "../constants/coloringData";
import { COLORS } from "../constants/data";
import { loadData, saveData, STORAGE_KEYS } from "../utils/storage";

const { width } = Dimensions.get("window");

// --- Level Data ---
const LEVELS = [
  {
    id: 1,
    title: "Basic Shapes",
    items: COLORING_PAGES.slice(0, 3),
    color: "#FF9800",
    gradient: ["#FF9800", "#F57C00"] as const,
  },
  {
    id: 2,
    title: "Nature Fun",
    items: COLORING_PAGES.slice(3, 6),
    color: "#4CAF50",
    gradient: ["#4CAF50", "#388E3C"] as const,
  },
  {
    id: 3,
    title: "Animal Friends",
    items: COLORING_PAGES.slice(6, 9),
    color: "#2196F3",
    gradient: ["#2196F3", "#1976D2"] as const,
  },
  {
    id: 4,
    title: "Vroom Vehicles",
    items: COLORING_PAGES.slice(9, 12),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#7B1FA2"] as const,
  },
  {
    id: 5,
    title: "Fresh Fruits",
    items: COLORING_PAGES.slice(12, 15),
    color: "#F44336",
    gradient: ["#F44336", "#D32F2F"] as const,
  },
  {
    id: 6,
    title: "Healthy Veggies",
    items: COLORING_PAGES.slice(15, 18),
    color: "#8BC34A",
    gradient: ["#8BC34A", "#689F38"] as const,
  },
] as const;

const ColorFillScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- State ---
  const [currentView, setCurrentView] = useState<"levels" | "coloring">(
    "levels",
  );
  const [selectedLevel, setSelectedLevel] = useState<
    (typeof LEVELS)[number] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS.primary);
  const [filledColors, setFilledColors] = useState<{ [key: string]: string }>(
    {},
  );
  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    const initData = async () => {
      const savedProgress = await loadData(STORAGE_KEYS.COLOR_FILL_PROGRESS);
      const savedCompleted = await loadData(
        STORAGE_KEYS.COLOR_FILL_COMPLETED_LEVELS,
      );

      if (savedProgress) setLevelProgress(savedProgress);
      if (savedCompleted) setCompletedLevels(savedCompleted);
      setIsLoaded(true);
    };
    initData();
  }, []);

  // --- Save Data ---
  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.COLOR_FILL_PROGRESS, levelProgress);
    }
  }, [levelProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.COLOR_FILL_COMPLETED_LEVELS, completedLevels);
    }
  }, [completedLevels, isLoaded]);

  // --- Helpers ---
  const currentItem = selectedLevel ? selectedLevel.items[currentIndex] : null;

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const totalItemsCompleted = useMemo(() => {
    return Object.values(levelProgress).reduce((a, b) => a + b, 0);
  }, [levelProgress]);

  const handleLevelSelect = (level: (typeof LEVELS)[number]) => {
    if (isLevelUnlocked(level.id)) {
      setSelectedLevel(level);
      setCurrentIndex(
        Math.min(levelProgress[level.id], level.items.length - 1),
      );
      setFilledColors({});
      setCurrentView("coloring");
    }
  };

  const handleAreaPress = (areaId: string) => {
    if (!currentItem) return;
    setFilledColors((prev) => ({
      ...prev,
      [`${currentItem.id}-${areaId}`]: selectedColor,
    }));
  };

  const handleNext = () => {
    if (!selectedLevel) return;

    const newProgress = Math.max(
      levelProgress[selectedLevel.id],
      currentIndex + 1,
    );

    setLevelProgress((prev) => ({
      ...prev,
      [selectedLevel.id]: newProgress,
    }));

    if (currentIndex < selectedLevel.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFilledColors({});
    } else {
      // Level Complete
      if (!completedLevels.includes(selectedLevel.id)) {
        setCompletedLevels((prev) => [...prev, selectedLevel.id]);
      }
      setShowCompleteModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFilledColors({});
    }
  };

  const resetPage = () => {
    setFilledColors({});
  };

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#000000",
    "#FFFFFF",
  ];

  // --- Sub-Components ---

  const LevelSelectionView = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FF9800", "#F57C00", "#E65100"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.topHeader, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FF9800" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Color Fill! 🎨</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialCommunityIcons
            name="cog"
            size={28}
            color="rgba(0,0,0,0.2)"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.overallProgressContainer}
        >
          <LinearGradient
            colors={["#FF9800", "#F57C00"]}
            style={styles.overallProgressCard}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Gallery</Text>
              <View style={styles.levelBadge}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.levelBadgeText}>
                  Level {completedLevels.length + 1}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(totalItemsCompleted / COLORING_PAGES.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {totalItemsCompleted} / {COLORING_PAGES.length} Pictures Painted
            </Text>
          </LinearGradient>
        </Animated.View>

        {LEVELS.map((level, index) => {
          const unlocked = isLevelUnlocked(level.id);
          const completed = completedLevels.includes(level.id);
          const progress = levelProgress[level.id];
          const total = level.items.length;

          return (
            <Animated.View
              key={level.id}
              entering={FadeInDown.delay(200 + index * 100).springify()}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleLevelSelect(level)}
                style={[styles.levelCard, !unlocked && styles.levelCardLocked]}
              >
                <LinearGradient
                  colors={level.gradient}
                  style={styles.levelCardHeader}
                >
                  <View style={styles.levelCardHeaderLeft}>
                    <Text style={styles.levelCardTitle}>Level {level.id}</Text>
                    {!unlocked && (
                      <MaterialCommunityIcons
                        name="lock"
                        size={18}
                        color="white"
                        style={styles.lockIcon}
                      />
                    )}
                    <Text style={styles.levelCardName}>{level.title}</Text>
                  </View>
                  {completed ? (
                    <View style={styles.doneBadge}>
                      <Text style={styles.doneBadgeText}>Done!</Text>
                    </View>
                  ) : (
                    unlocked && (
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressBadgeText}>
                          {progress}/{total}
                        </Text>
                      </View>
                    )
                  )}
                </LinearGradient>
                <View style={styles.levelCardContent}>
                  <Text style={styles.levelItemsText}>
                    {level.items.map((i) => i.title).join(" • ")}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );

  const ColoringView = () => {
    if (!selectedLevel || !currentItem) return null;
    const progress = ((currentIndex + 1) / selectedLevel.items.length) * 100;

    return (
      <View style={styles.coloringContainer}>
        <LinearGradient
          colors={selectedLevel.gradient}
          style={[styles.learningHeader, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => setCurrentView("levels")}
              style={styles.headerBackButton}
            >
              <MaterialCommunityIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{currentItem.title}</Text>
            <TouchableOpacity
              onPress={resetPage}
              style={styles.headerResetButton}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerProgressBarBg}>
            <View
              style={[styles.headerProgressBarFill, { width: `${progress}%` }]}
            />
          </View>
        </LinearGradient>

        <View
          style={[styles.mainContent, { paddingBottom: insets.bottom + 20 }]}
        >
          <FloatingShapes />

          <View style={styles.canvasWrapper}>
            <Animated.View
              entering={FadeInRight.springify()}
              key={`canvas-${currentItem.id}`}
              style={styles.canvasContainer}
            >
              <Svg viewBox={currentItem.viewBox} style={styles.svg}>
                <G>
                  {currentItem.areas.map((area) => (
                    <Path
                      key={area.id}
                      d={area.path}
                      fill={
                        filledColors[`${currentItem.id}-${area.id}`] ||
                        area.defaultColor
                      }
                      stroke="#000000"
                      strokeWidth="2"
                      onPress={() => handleAreaPress(area.id)}
                    />
                  ))}
                </G>
              </Svg>
            </Animated.View>
          </View>

          <View style={styles.controls}>
            <Text style={styles.instruction}>
              Tap the picture to fill with color!
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorPicker}
              contentContainerStyle={styles.colorPickerContent}
            >
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    selectedColor === c && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(c)}
                />
              ))}
            </ScrollView>

            <View style={styles.navButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={32}
                  color={currentIndex === 0 ? "#CCC" : "#666"}
                />
                <Text
                  style={[
                    styles.navButtonText,
                    { color: currentIndex === 0 ? "#CCC" : "#666" },
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.nextButton,
                  {
                    backgroundColor: selectedLevel.color,
                  },
                ]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === selectedLevel.items.length - 1
                    ? "Finish"
                    : "Next"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle={currentView === "levels" ? "dark-content" : "light-content"}
        translucent
        backgroundColor="transparent"
      />

      {currentView === "levels" ? <LevelSelectionView /> : <ColoringView />}

      {/* Completion Modal */}
      <Modal visible={showCompleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInUp.springify()}
            style={styles.modalContent}
          >
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: selectedLevel?.color },
              ]}
            >
              <MaterialCommunityIcons name="trophy" size={80} color="white" />
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Level Complete!</Text>
              <Text style={styles.modalSubTitle}>{selectedLevel?.title}</Text>

              <View style={styles.rewardCard}>
                <Text style={styles.rewardLabel}>You Earned</Text>
                <View style={styles.rewardValue}>
                  <MaterialCommunityIcons
                    name="star"
                    size={32}
                    color="#FFD700"
                  />
                  <Text style={styles.rewardText}>+10 Points</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  { backgroundColor: selectedLevel?.color },
                ]}
                onPress={() => {
                  setShowCompleteModal(false);
                  setCurrentView("levels");
                }}
              >
                <Text style={styles.continueButtonText}>Keep Painting!</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#FDFCF0",
  },
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRadius: 22.5,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeaderTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  overallProgressContainer: {
    marginBottom: 30,
  },
  overallProgressCard: {
    padding: 25,
    borderRadius: 30,
    elevation: 12,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelBadgeText: {
    color: "white",
    fontWeight: "800",
    marginLeft: 4,
    fontSize: 14,
  },
  progressBarBg: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 7,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 7,
  },
  progressSubtext: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 15,
  },
  levelCard: {
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 25,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  levelCardLocked: {
    opacity: 0.7,
  },
  levelCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  levelCardHeaderLeft: {
    flex: 1,
  },
  levelCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  levelCardName: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    marginTop: 2,
  },
  lockIcon: {
    marginLeft: 8,
  },
  doneBadge: {
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  doneBadgeText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },
  progressBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressBadgeText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },
  levelCardContent: {
    padding: 18,
    backgroundColor: "#F8F9FA",
  },
  levelItemsText: {
    fontSize: 15,
    color: "#777",
    fontWeight: "700",
    lineHeight: 22,
  },
  coloringContainer: {
    flex: 1,
  },
  learningHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerResetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerProgressBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  headerProgressBarFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvasContainer: {
    width: width - 40,
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 4,
    borderColor: "#FFE0B2",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  controls: {
    marginTop: 20,
    paddingBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },
  colorPicker: {
    marginBottom: 25,
  },
  colorPickerContent: {
    paddingHorizontal: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 3,
    borderColor: "white",
    elevation: 3,
  },
  selectedColor: {
    borderColor: "#FF9800",
    transform: [{ scale: 1.2 }],
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    minWidth: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: 8,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 45,
    width: "100%",
    overflow: "hidden",
    elevation: 20,
  },
  modalHeader: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#333",
    marginBottom: 8,
  },
  modalSubTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#666",
    marginBottom: 25,
  },
  rewardCard: {
    backgroundColor: "#F1F8E9",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#C5E1A5",
  },
  rewardLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#7CB342",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  rewardValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#333",
    marginLeft: 10,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 30,
    width: "100%",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginRight: 10,
  },
});

export default ColorFillScreen;
