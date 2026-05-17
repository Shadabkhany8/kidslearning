import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingShapes from "../components/FloatingShapes";
import { APP_COLORS } from "../constants/colorData";
import { speakText } from "../utils/speakText";
import { loadData, saveData, STORAGE_KEYS } from "../utils/storage";

// --- Level Data ---
const LEVELS = [
  {
    id: 1,
    title: "Basic Rainbow",
    items: APP_COLORS.slice(0, 6),
    color: "#9C27B0",
    gradient: ["#9C27B0", "#E1BEE7"] as const,
  },
  {
    id: 2,
    title: "Soft & Deep",
    items: APP_COLORS.slice(6, 12),
    color: "#FF4081",
    gradient: ["#FF4081", "#F8BBD0"] as const,
  },
  {
    id: 3,
    title: "Classic Tones",
    items: APP_COLORS.slice(12, 18),
    color: "#009688",
    gradient: ["#009688", "#B2DFDB"] as const,
  },
  {
    id: 4,
    title: "Exotic Hues",
    items: APP_COLORS.slice(18, 22),
    color: "#FF9800",
    gradient: ["#FF9800", "#FFE0B2"] as const,
  },
] as const;

const ColorsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- State ---
  const [currentView, setCurrentView] = useState<"levels" | "learning">(
    "levels",
  );
  const [selectedLevel, setSelectedLevel] = useState<
    (typeof LEVELS)[number] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    const initData = async () => {
      const savedProgress = await loadData(STORAGE_KEYS.COLORS_PROGRESS);
      const savedCompleted = await loadData(
        STORAGE_KEYS.COLORS_COMPLETED_LEVELS,
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
      saveData(STORAGE_KEYS.COLORS_PROGRESS, levelProgress);
    }
  }, [levelProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.COLORS_COMPLETED_LEVELS, completedLevels);
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

  const handleLevelSelect = (level: (typeof LEVELS)[number]) => {
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

  const handleSpeak = (name: string) => {
    speakText(name);
  };

  // --- Sub-Components ---

  const LevelSelectionView = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#9C27B0", "#BA68C8", "#E1BEE7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#9C27B0" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Color Learning</Text>
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
            colors={["#9C27B0", "#BA68C8"]}
            style={styles.overallProgressCard}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Journey</Text>
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
                  { width: `${(totalItemsLearned / APP_COLORS.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {totalItemsLearned} / {APP_COLORS.length} Colors Discovered
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
                    {level.items.map((i) => i.name).join(" • ")}
                  </Text>
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
    const isLightColor = currentItem.name.toLowerCase() === "yellow" || currentItem.name.toLowerCase() === "white" || currentItem.name.toLowerCase() === "silver" || currentItem.name.toLowerCase() === "beige";

    return (
      <View style={styles.learningContainer}>
        <LinearGradient
          colors={["#FDF8FF", "#F3E5F5", "#FDF8FF"]}
          style={StyleSheet.absoluteFill}
        />

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
            <Text style={styles.headerTitle}>{selectedLevel.title}</Text>
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
          contentContainerStyle={[
            styles.learningContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInRight.springify()}
            key={`card-${currentIndex}`}
            style={[
              styles.learningCard,
              { borderColor: currentItem.color + "25", borderWidth: 4 },
            ]}
          >
            <LinearGradient
              colors={["#FFFFFF", currentItem.color + "08", "#FFFFFF"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Decorative Corner Icons */}
            <View style={styles.cardDecorationTopLeft}>
              <MaterialCommunityIcons
                name="palette"
                size={24}
                color={currentItem.color + "20"}
              />
            </View>
            <View style={styles.cardDecorationBottomRight}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color={currentItem.color + "20"}
              />
            </View>

            <View
              style={[
                styles.imageContainer,
                {
                  backgroundColor: currentItem.color,
                  shadowColor: currentItem.color,
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  elevation: 10,
                  borderWidth: isLightColor ? 1 : 0,
                  borderColor: "#DDD",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="format-color-fill"
                size={80}
                color={isLightColor ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)"}
              />
            </View>

            <View style={styles.nameBadgeContainer}>
              <Text style={[styles.learningName, { color: currentItem.name.toLowerCase() === 'white' ? '#333' : currentItem.color }]}>
                {currentItem.name}
              </Text>
              <View
                style={[
                  styles.nameUnderline,
                  { backgroundColor: currentItem.color + "30" },
                ]}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSpeak(currentItem.name)}
              style={styles.bigSpeakerButtonContainer}
            >
              <LinearGradient
                colors={[currentItem.color === '#FFFFFF' ? '#EEEEEE' : currentItem.color, currentItem.color === '#FFFFFF' ? '#DDDDDD' : currentItem.color + "DD"]}
                style={styles.bigSpeakerButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <MaterialCommunityIcons
                  name="volume-high"
                  size={40}
                  color={isLightColor ? "#333" : "white"}
                />
                <Text style={[styles.bigSpeakerText, { color: isLightColor ? "#333" : "white" }]}>Hear Name</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View
              style={[
                styles.animalSoundBubble,
                { transform: [{ rotate: "-2deg" }] },
              ]}
            >
              <MaterialCommunityIcons
                name="brush"
                size={20}
                color="#7B1FA2"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.animalSoundText}>Beautiful!</Text>
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
                  shadowColor: selectedLevel.color,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
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
        </ScrollView>
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
      <FloatingShapes />

      {currentView === "levels" ? (
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <LevelSelectionView />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <LearningView />
        </View>
      )}

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
                <Text style={styles.continueButtonText}>Keep Learning!</Text>
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
    backgroundColor: "#FDF8FF",
  },
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topHeaderTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    marginLeft: 15,
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
    shadowColor: "#9C27B0",
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
    marginTop: 5,
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
  learningContainer: {
    flex: 1,
  },
  learningHeader: {
    paddingHorizontal: 20,
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
  },
  headerBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerStarBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  headerStarText: {
    color: "white",
    fontWeight: "900",
    marginLeft: 5,
    fontSize: 15,
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
  learningContent: {
    padding: 20,
    alignItems: "center",
  },
  learningCard: {
    backgroundColor: "white",
    borderRadius: 45,
    width: "100%",
    padding: 35,
    alignItems: "center",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    marginTop: 15,
    position: "relative",
    overflow: "hidden",
  },
  cardDecorationTopLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    transform: [{ rotate: "-15deg" }],
  },
  cardDecorationBottomRight: {
    position: "absolute",
    bottom: 20,
    right: 20,
    transform: [{ rotate: "15deg" }],
  },
  imageContainer: {
    width: "55%",
    aspectRatio: 1,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  nameBadgeContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  learningName: {
    fontSize: 52,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  nameUnderline: {
    height: 6,
    width: "60%",
    borderRadius: 3,
    marginTop: -5,
  },
  bigSpeakerButtonContainer: {
    marginBottom: 25,
    borderRadius: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bigSpeakerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 35,
  },
  bigSpeakerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 12,
  },
  animalSoundBubble: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E1BEE7",
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  animalSoundText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7B1FA2",
    fontStyle: "italic",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
    minWidth: 130,
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
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 8,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
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
    color: "#4CAF50",
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  continueButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginRight: 10,
  },
});

export default ColorsScreen;
