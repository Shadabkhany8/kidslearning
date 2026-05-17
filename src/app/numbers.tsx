import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingShapes from "../components/FloatingShapes";
import { COLORS, NUMBERS } from "../constants/data";
import { speakText } from "../utils/speakText";
import { loadData, saveData, STORAGE_KEYS } from "../utils/storage";

// --- Level Data ---
const LEVELS = [
  {
    id: 1,
    title: "Counting 1-10",
    items: NUMBERS.slice(0, 10),
    color: "#FF6B6B",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: 2,
    title: "Teen Numbers",
    items: NUMBERS.slice(10, 20),
    color: "#4ECDC4",
    gradient: ["#4ECDC4", "#71DFD7"],
  },
  {
    id: 3,
    title: "Twenty's Fun",
    items: NUMBERS.slice(20, 30),
    color: "#FFD93D",
    gradient: ["#FFD93D", "#FFE67C"],
  },
  {
    id: 4,
    title: "Thirty's Power",
    items: NUMBERS.slice(30, 40),
    color: "#6C5CE7",
    gradient: ["#6C5CE7", "#A29BFE"],
  },
  {
    id: 5,
    title: "Forty's Club",
    items: NUMBERS.slice(40, 50),
    color: "#FF8066",
    gradient: ["#FF8066", "#FFB3A1"],
  },
  {
    id: 6,
    title: "Fifty's Milestone",
    items: NUMBERS.slice(50, 60),
    color: "#A8E6CF",
    gradient: ["#A8E6CF", "#D1F2E6"],
  },
  {
    id: 7,
    title: "Sixty's Sprint",
    items: NUMBERS.slice(60, 70),
    color: "#FFD3B6",
    gradient: ["#FFD3B6", "#FFE9DB"],
  },
  {
    id: 8,
    title: "Seventy's Spirit",
    items: NUMBERS.slice(70, 80),
    color: "#FFAAA5",
    gradient: ["#FFAAA5", "#FFD5D2"],
  },
  {
    id: 9,
    title: "Eighty's Excellence",
    items: NUMBERS.slice(80, 90),
    color: "#81ECEC",
    gradient: ["#81ECEC", "#B2F2F2"],
  },
  {
    id: 10,
    title: "Number Master 100",
    items: NUMBERS.slice(90, 100),
    color: "#FF7675",
    gradient: ["#FF7675", "#FFABAB"],
  },
];

const NumbersScreen = () => {
  const router = useRouter();

  // --- State ---
  const [currentView, setCurrentView] = useState<"levels" | "learning">(
    "levels",
  );
  const [selectedLevel, setSelectedLevel] = useState<(typeof LEVELS)[0] | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    const initData = async () => {
      const savedProgress = await loadData(STORAGE_KEYS.NUMBERS_PROGRESS);
      const savedCompleted = await loadData(
        STORAGE_KEYS.NUMBERS_COMPLETED_LEVELS,
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
      saveData(STORAGE_KEYS.NUMBERS_PROGRESS, levelProgress);
    }
  }, [levelProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.NUMBERS_COMPLETED_LEVELS, completedLevels);
    }
  }, [completedLevels, isLoaded]);

  // --- Helpers ---
  const currentItem = selectedLevel ? selectedLevel.items[currentIndex] : null;
  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const totalItemsLearned = useMemo(() => {
    return Object.values(levelProgress).reduce((a, b) => a + b, 0);
  }, [levelProgress]);

  const handleLevelSelect = (level: (typeof LEVELS)[0]) => {
    if (isLevelUnlocked(level.id)) {
      setSelectedLevel(level);
      setCurrentIndex(
        Math.min(levelProgress[level.id], level.items.length - 1),
      );
      setCurrentView("learning");
    }
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
    }
  };

  const handleSpeak = (value: number) => {
    speakText(value.toString());
  };

  // --- Sub-Components ---

  const LevelSelectionView = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FF9800", "#FFCC80", "#FFE0B2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={32} color="#FF9800" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Numbers Learning</Text>
      </LinearGradient>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overall Progress Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.overallProgressContainer}
        >
          <LinearGradient
            colors={["#FF9800", "#FFB74D", "#FFCC80"]}
            style={styles.overallProgressCard}
          >
            <View style={styles.progressIconBg}>
              <MaterialCommunityIcons
                name="numeric"
                size={120}
                color="rgba(255,255,255,0.15)"
              />
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Overall Progress</Text>
              <View style={styles.levelBadge}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.levelBadgeText}>
                  Level {completedLevels.length + 1}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={["#FFD700", "#FFF176"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBarFill,
                  { width: `${(totalItemsLearned / NUMBERS.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {totalItemsLearned} / {NUMBERS.length} Numbers Learned
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Levels List */}
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
                  colors={level.gradient as [string, string, ...string[]]}
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
                      <Text style={styles.doneBadgeText}>
                        {total}/{total} Done
                      </Text>
                    </View>
                  ) : (
                    unlocked && (
                      <View style={styles.progressBadge}>
                        <MaterialCommunityIcons
                          name="star"
                          size={14}
                          color="#FFD700"
                        />
                        <Text style={styles.progressBadgeText}>
                          {progress}/{total}
                        </Text>
                      </View>
                    )
                  )}
                </LinearGradient>
                <View style={styles.levelCardContent}>
                  <View style={styles.levelItemsPreview}>
                    {level.items.map((item, i) => (
                      <View
                        key={item.id}
                        style={[
                          styles.previewCircle,
                          {
                            backgroundColor:
                              i < progress ? level.color : "#F0F0F0",
                            borderColor: i < progress ? "white" : "#E0E0E0",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.previewCircleText,
                            { color: i < progress ? "white" : "#999" },
                          ]}
                        >
                          {item.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {completed && (
                    <View style={styles.completedInfo}>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={18}
                        color="#4CAF50"
                      />
                      <Text style={styles.completedDate}>Level Completed!</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );

  const LearningView = () => {
    if (!selectedLevel || !currentItem) return null;
    const progress = ((currentIndex + 1) / selectedLevel.items.length) * 100;

    return (
      <View style={styles.learningContainer}>
        <LinearGradient
          colors={["#FFF8E1", "#FFECB3", "#FFF8E1"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Header with Progress Bar */}
        <LinearGradient
          colors={selectedLevel.gradient as [string, string, ...string[]]}
          style={[
            styles.learningHeader,
            {
              paddingTop: StatusBar.currentHeight
                ? StatusBar.currentHeight + 10
                : 50,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => setCurrentView("levels")}
              style={styles.headerBackButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Level {selectedLevel.id} {selectedLevel.title}
            </Text>
            <View style={styles.headerStarBadge}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.headerStarText}>
                {currentIndex + 1}/{selectedLevel.items.length}
              </Text>
            </View>
          </View>
          <View style={styles.headerProgressBarBg}>
            <View
              style={[styles.headerProgressBarFill, { width: `${progress}%` }]}
            />
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.learningContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInRight.springify()}
            key={`card-${currentIndex}`}
            style={[
              styles.learningCard,
              { borderColor: "white", backgroundColor: "white" },
            ]}
          >
            {/* Number Display with Bubble Effect */}
            <View
              style={[
                styles.imageContainer,
                { backgroundColor: selectedLevel.color + "08" },
              ]}
            >
              <LinearGradient
                colors={[selectedLevel.color, selectedLevel.color + "CC"]}
                style={styles.numberCircleLarge}
              >
                {/* Inner Glow/Highlight */}
                <View style={styles.numberCircleHighlight} />
                <Text style={styles.bigNumberText}>{currentItem.value}</Text>
              </LinearGradient>
            </View>

            {/* Redesigned Speaker Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.speakerIcon,
                {
                  backgroundColor: selectedLevel.color,
                  borderColor: "white",
                  shadowColor: selectedLevel.color,
                },
              ]}
              onPress={() => handleSpeak(currentItem.value)}
            >
              <View style={styles.speakerIconCircle}>
                <MaterialCommunityIcons
                  name="volume-high"
                  size={24}
                  color={selectedLevel.color}
                />
              </View>
              <Text style={[styles.speakerText, { color: "white" }]}>
                Listen: Number {currentItem.value}
              </Text>
            </TouchableOpacity>

            {/* Improved Stars Tray */}
            <View
              style={[
                styles.descriptionBox,
                {
                  backgroundColor: "#F8F9FA",
                  borderColor: "#E9ECEF",
                },
              ]}
            >
              <View style={styles.starsTrayHeader}>
                <Text
                  style={[
                    styles.starsTrayTitle,
                    { color: selectedLevel.color },
                  ]}
                >
                  Can you count {currentItem.value} stars?
                </Text>
              </View>
              <View style={styles.starsContainer}>
                {Array.from({ length: Math.min(currentItem.value, 20) }).map(
                  (_, i) => (
                    <Animated.View
                      key={i}
                      entering={FadeInDown.delay(i * 50).springify()}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={24}
                        color={selectedLevel.color}
                        style={{ margin: 4 }}
                      />
                    </Animated.View>
                  ),
                )}
                {currentItem.value > 20 && (
                  <View style={styles.moreStarsBadge}>
                    <Text style={{ color: "white", fontWeight: "900" }}>
                      + {currentItem.value - 20} more!
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

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
                name="arrow-left"
                size={24}
                color={currentIndex === 0 ? "#CCC" : "#666"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  { color: currentIndex === 0 ? "#CCC" : "#666" },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                { backgroundColor: selectedLevel.color },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === selectedLevel.items.length - 1
                  ? "Finish"
                  : "Next"}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const CompletionModal = () => (
    <Modal visible={showCompleteModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInUp.springify()}
          style={styles.modalContent}
        >
          <Text style={styles.modalEmoji}>🎉</Text>
          <Text style={styles.modalTitle}>Level Complete!</Text>
          <Text style={styles.modalSubTitle}>{selectedLevel?.title}</Text>

          <View style={styles.rewardCard}>
            <Text style={styles.rewardLabel}>You Earned</Text>
            <View style={styles.rewardValue}>
              <MaterialCommunityIcons name="star" size={40} color="#FFD700" />
              <Text style={styles.rewardText}>+10</Text>
            </View>
          </View>

          <Text style={styles.unlockText}>
            Great job! {LEVELS[selectedLevel?.id || 0]?.title || "Next level"}{" "}
            is now unlocked 🌟
          </Text>

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: selectedLevel?.color || COLORS.primary },
            ]}
            onPress={() => {
              setShowCompleteModal(false);
              setCurrentView("levels");
            }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle={currentView === "levels" ? "dark-content" : "light-content"}
        translucent
        backgroundColor="transparent"
      />
      <FloatingShapes />

      {currentView === "levels" ? (
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <LevelSelectionView />
        </SafeAreaView>
      ) : (
        <View style={{ flex: 1 }}>
          <LearningView />
        </View>
      )}

      <CompletionModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCF0",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  topHeaderTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    marginLeft: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  overallProgressContainer: {
    marginBottom: 25,
  },
  overallProgressCard: {
    padding: 25,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  progressIconBg: {
    position: "absolute",
    right: -20,
    bottom: -20,
    opacity: 0.5,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    zIndex: 1,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelBadgeText: {
    color: "white",
    fontWeight: "900",
    marginLeft: 5,
    fontSize: 16,
  },
  progressBarBg: {
    height: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 9,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    zIndex: 1,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9,
  },
  progressSubtext: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
    zIndex: 1,
  },
  levelCard: {
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: "white",
  },
  levelCardLocked: {
    opacity: 0.7,
    backgroundColor: "#F0F0F0",
    borderColor: "#E0E0E0",
  },
  levelCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
  },
  levelCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelCardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lockIcon: {
    marginRight: 10,
  },
  levelCardName: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
  doneBadge: {
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
  },
  doneBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "900",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  progressBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 5,
  },
  levelCardContent: {
    padding: 22,
    backgroundColor: "#FFF",
  },
  levelItemsPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  previewCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  previewCircleText: {
    fontSize: 12,
    fontWeight: "900",
  },
  levelItemsText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "900",
    letterSpacing: 2,
  },
  completedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  completedDate: {
    fontSize: 14,
    color: "#2E7D32",
    marginLeft: 8,
    fontWeight: "900",
  },
  learningContainer: {
    flex: 1,
  },
  learningHeader: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerBackButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  headerStarBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerStarText: {
    color: "white",
    fontWeight: "900",
    marginLeft: 6,
    fontSize: 16,
  },
  headerProgressBarBg: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerProgressBarFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 7,
  },
  learningContent: {
    padding: 15,
    alignItems: "center",
    paddingBottom: 150,
  },
  learningCard: {
    backgroundColor: "white",
    borderRadius: 35,
    padding: 15,
    width: "100%",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    marginBottom: 20,
    borderWidth: 3,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 30,
    padding: 15,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  numberCircleLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    position: "relative",
    overflow: "hidden",
  },
  numberCircleHighlight: {
    position: "absolute",
    top: 10,
    left: 20,
    width: 30,
    height: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    transform: [{ rotate: "-20deg" }],
  },
  bigNumberText: {
    fontSize: 64,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  speakerIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 35,
    marginTop: 5,
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 2,
  },
  speakerIconCircle: {
    backgroundColor: "white",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  speakerText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  descriptionBox: {
    padding: 15,
    borderRadius: 30,
    width: "100%",
    borderWidth: 2,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  starsTrayHeader: {
    marginBottom: 10,
    alignItems: "center",
  },
  starsTrayTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 80,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  moreStarsBadge: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
    elevation: 3,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    marginBottom: 25,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 35,
    elevation: 8,
    width: "48%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 10,
  },
  nextButton: {
    width: "48%",
    elevation: 8,
    borderWidth: 0,
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 45,
    padding: 35,
    width: "100%",
    alignItems: "center",
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
  },
  modalEmoji: {
    fontSize: 90,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
  },
  modalSubTitle: {
    fontSize: 22,
    color: "#666",
    fontWeight: "800",
    marginBottom: 25,
    textAlign: "center",
  },
  rewardCard: {
    backgroundColor: "#FFF9C4",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
    borderWidth: 3,
    borderColor: "#FFD700",
    elevation: 5,
  },
  rewardLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700",
    marginBottom: 10,
  },
  rewardValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFD700",
    marginLeft: 10,
  },
  unlockText: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 30,
    fontWeight: "600",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginRight: 10,
  },
});

export default NumbersScreen;
