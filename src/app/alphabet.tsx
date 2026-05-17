import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FloatingShapes from "../components/FloatingShapes";
import { ALPHABET } from "../constants/alphabetData";
import { COLORS } from "../constants/data";
import { speakText } from "../utils/speakText";
import { loadData, saveData, STORAGE_KEYS } from "../utils/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const { width } = Dimensions.get("window");

// --- Level Data ---
const LEVELS = [
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

const AlphabetScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    const initData = async () => {
      const savedProgress = await loadData(STORAGE_KEYS.ALPHABET_PROGRESS);
      const savedCompleted = await loadData(
        STORAGE_KEYS.ALPHABET_COMPLETED_LEVELS,
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
      saveData(STORAGE_KEYS.ALPHABET_PROGRESS, levelProgress);
    }
  }, [levelProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.ALPHABET_COMPLETED_LEVELS, completedLevels);
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
      // Start from where the user left off in this level?
      // Or start from beginning? Let's start from where they left off.
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

  const handleSpeak = (letter: string, example: string) => {
    speakText(`${letter} for ${example}`);
  };

  // --- Sub-Components ---

  const LevelSelectionView = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FF9A9E", "#FECFEF", "#FAD0C4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={32} color="#FF6B6B" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Alphabet Learning</Text>
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
            colors={["#FF7E5F", "#FEB47B"]}
            style={styles.overallProgressCard}
          >
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
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(totalItemsLearned / ALPHABET.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {totalItemsLearned} / {ALPHABET.length} Alphabets Learned
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
                  <Text style={styles.levelItemsText}>
                    {level.items.map((i) => i.letter).join(" • ")}
                  </Text>
                  {completed && (
                    <View style={styles.completedInfo}>
                      <MaterialCommunityIcons
                        name="star"
                        size={14}
                        color="#FFD700"
                      />
                      <Text style={styles.completedDate}>Completed!</Text>
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
        {/* Colorful Gradient Background for Learning Screen */}
        <LinearGradient
          colors={["#F0F9FF", "#E0F2FE", "#F0F9FF"]}
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
              { borderColor: selectedLevel.color + "40" }, // Light version of the color for border
            ]}
          >
            <View
              style={[
                styles.imageContainer,
                { backgroundColor: selectedLevel.color + "10" },
              ]}
            >
              <Image
                source={currentItem.image}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.speakerIcon,
                {
                  borderColor: selectedLevel.color,
                  backgroundColor: "white",
                  shadowColor: selectedLevel.color,
                },
              ]}
              onPress={() =>
                handleSpeak(currentItem.letter, currentItem.example)
              }
            >
              <MaterialCommunityIcons
                name="volume-high"
                size={28}
                color={selectedLevel.color}
              />
              <Text
                style={[
                  styles.speakerText,
                  { color: selectedLevel.color, fontSize: 26 },
                ]}
              >
                {currentItem.example}
              </Text>
            </TouchableOpacity>

            <Text style={styles.learningBigLetter}>
              <Text style={{ color: selectedLevel.color, fontSize: 48 }}>
                {currentItem.letter}
              </Text>{" "}
              for {currentItem.example}
            </Text>

            <View
              style={[
                styles.descriptionBox,
                {
                  backgroundColor: selectedLevel.color + "15",
                  borderColor: selectedLevel.color + "30",
                },
              ]}
            >
              <Text style={[styles.descriptionText, { color: "#333" }]}>
                The letter{" "}
                <Text style={{ color: selectedLevel.color, fontWeight: "900" }}>
                  {currentItem.letter}
                </Text>{" "}
                is for{" "}
                <Text style={{ color: selectedLevel.color, fontWeight: "900" }}>
                  {currentItem.example}
                </Text>
                !
              </Text>
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
              <Text style={styles.rewardText}>+5</Text>
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
    shadowColor: "#FF9A9E",
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
    paddingBottom: 100, // Increased padding for Android nav buttons
  },
  overallProgressContainer: {
    marginBottom: 25,
  },
  overallProgressCard: {
    padding: 25, // More padding
    borderRadius: 30,
    elevation: 10, // Higher elevation
    shadowColor: "#FF7E5F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 24, // Bigger title
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
    height: 18, // Thicker bar
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 9,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 9,
  },
  progressSubtext: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
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
    borderWidth: 3, // Thicker border
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
    fontSize: 24, // Bigger font
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
  levelItemsText: {
    fontSize: 20, // Bigger font
    color: "#333",
    fontWeight: "900",
    letterSpacing: 2,
  },
  completedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  completedDate: {
    fontSize: 14,
    color: "#2E7D32",
    marginLeft: 5,
    fontWeight: "900",
  },
  learningContainer: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  learningHeader: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30, // More padding
    borderBottomLeftRadius: 50, // More radius
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
    fontSize: 24, // Bigger font
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
    height: 14, // Thicker bar
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
    padding: 20,
    alignItems: "center",
    paddingBottom: 180, // Increased for Android nav buttons and higher floating bar
  },
  learningCard: {
    backgroundColor: "white",
    borderRadius: 40, // Reduced from 50
    padding: 15, // Reduced from 25
    width: "100%",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    marginBottom: 20, // Reduced from 35
    borderWidth: 4,
    borderColor: "#F0F9FF",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Reduced from 20
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 30, // Reduced from 40
    padding: 10, // Reduced from 20
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  mainImage: {
    width: width * 0.4, // Reduced from 0.75
    height: width * 0.4, // Reduced from 0.75
  },
  speakerIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25, // Reduced from 35
    paddingVertical: 12, // Reduced from 18
    borderRadius: 30, // Reduced from 40
    marginTop: 5, // Reduced from 10
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 3,
  },
  speakerText: {
    fontSize: 22, // Reduced from 26
    fontWeight: "900",
    marginLeft: 10, // Reduced from 15
  },
  learningBigLetter: {
    fontSize: 30, // Reduced from 38
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    marginTop: 15, // Reduced from 25
    marginBottom: 10, // Reduced from 15
    letterSpacing: 1.5,
  },
  descriptionBox: {
    backgroundColor: "#F0F9FF",
    padding: 15, // Reduced from 25
    borderRadius: 25, // Reduced from 30
    width: "100%",
    borderWidth: 3,
    borderColor: "#E0F2FE",
  },
  descriptionText: {
    fontSize: 16, // Reduced from 20
    color: "#0369A1",
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 22, // Reduced from 28
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 35,
    elevation: 5,
    width: "48%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
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
    borderRadius: 40,
    padding: 30,
    width: "90%",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 4,
    borderColor: "#FFD700",
  },
  modalEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FF4757",
    marginBottom: 5,
    textAlign: "center",
  },
  modalSubTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#555",
    marginBottom: 25,
  },
  rewardCard: {
    backgroundColor: "#FFF9C4",
    padding: 25,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
    marginBottom: 25,
    elevation: 5,
  },
  rewardLabel: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F57F17",
    marginBottom: 10,
  },
  rewardValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 56,
    fontWeight: "900",
    color: "#F57F17",
    marginLeft: 10,
  },
  unlockText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 35,
    backgroundColor: "#F1F2F6",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    lineHeight: 26,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 45,
    paddingVertical: 18,
    borderRadius: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginRight: 10,
  },
});

export default AlphabetScreen;
