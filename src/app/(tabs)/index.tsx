import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
import FeatureCard from "../../components/FeatureCard";
import FloatingShapes from "../../components/FloatingShapes";
import { COLORS } from "../../constants/data";
import { FEATURE_CATEGORIES } from "../../constants/featureData";
import { useSettings } from "../../context/SettingsContext";
import { useProgress } from "../../hooks/useProgress";

const OverallProgress = ({
  percentage,
  level,
}: {
  percentage: number;
  level: number;
}) => {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const safePercentage = isNaN(percentage)
      ? 0
      : Math.max(0, Math.min(100, percentage));
    progressWidth.value = withSpring(safePercentage, {
      damping: 15,
      stiffness: 60,
    });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return;
};

const LearningScreen = () => {
  const router = useRouter();
  const { overallPercentage, overallLevel, totalStars, categories } =
    useProgress();
  const { settings } = useSettings();

  // Header animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 12, stiffness: 90 });
  }, [titleOpacity, titleTranslateY]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const handleCardPress = (route: string) => {
    Speech.speak("Let's Learn!", {
      rate: 1.0,
      pitch: 1.2,
      volume: 0.8,
    });
    router.push(route as any);
  };

  const renderFeatureItem = ({ item, index }: { item: any; index: number }) => {
    const progress = categories[item.id] || {
      level: 1,
      detail: "Basic",
      percentage: 0,
    };
    return (
      <FeatureCard
        title={item.title}
        image={item.image}
        gradient={item.gradient}
        color={item.color}
        index={index}
        level={progress.level}
        detail={progress.detail}
        onPress={() => handleCardPress(item.route)}
      />
    );
  };

  const headerStyle = useAnimatedStyle(() => ({
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 25,
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <FloatingShapes />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <Animated.View style={headerStyle}>
            <View style={styles.headerTop}>
              <View style={styles.userRow}>
                <View style={styles.avatarWrapper}>
                  {settings.profile.image ? (
                    <Image
                      source={{ uri: settings.profile.image }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={40}
                      color="#6C5CE7"
                    />
                  )}
                  <View style={styles.avatarStarBadge}>
                    <MaterialCommunityIcons
                      name="star"
                      size={12}
                      color="gold"
                    />
                  </View>
                </View>

                <Animated.View style={[titleStyle, { marginLeft: 12 }]}>
                  <Text style={styles.welcomeText}>
                    Hello, {settings.profile.name || "Little Learner"}! 👋
                  </Text>
                  <Text style={styles.subtitle}>
                    Let&apos;s continue your learning
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.scoreBadge}>
                <MaterialCommunityIcons name="star" size={18} color="gold" />
                <Text style={styles.scoreText}>{totalStars}</Text>
              </View>
            </View>

            <OverallProgress
              percentage={overallPercentage}
              level={overallLevel}
            />
          </Animated.View>
        </View>

        <View style={styles.content}>
          {/* <SectionHeader title="Discovery World" emoji="🌍" index={1} /> */}
          <FlatList
            data={FEATURE_CATEGORIES.learning.slice(0, 4)}
            renderItem={renderFeatureItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.listPadding}
            columnWrapperStyle={styles.columnWrapper}
            keyExtractor={(item) => `learn-${item.id}`}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.exploreMoreWide}
            onPress={() => handleCardPress("/explore-learning")}
          >
            <LinearGradient
              colors={["#6C5CE7", "#A78BFA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.exploreMoreGradient}
            >
              <View style={styles.exploreMoreContent}>
                <View style={styles.exploreMoreIconContainer}>
                  <Image
                    source={require("../../../assets/images/feature/palette.png")}
                    style={styles.exploreMoreIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.exploreMoreTextContainer}>
                  <Text style={styles.exploreMoreTitleText}>Explore More</Text>
                  <Text style={styles.exploreMoreSubtitleText}>
                    Discover more fun learning worlds!
                  </Text>
                </View>
                <View style={styles.exploreMoreChevron}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={32}
                    color="white"
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EEF2FF",
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarStarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: 22,
    color: "#1F2937",
    fontWeight: "900",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    gap: 6,
  },
  scoreText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  progressContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginHorizontal: 0,
    marginTop: 30,
    padding: 20,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(243, 244, 246, 0.5)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  levelText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#7C3AED",
    marginLeft: 4,
  },
  progressBarBg: {
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 9,
    overflow: "hidden",
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9,
    minWidth: 15,
    backgroundColor: "#7C3AED",
  },
  progressFooter: {
    marginTop: 5,
  },
  progressSubtext: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "700",
    textAlign: "center",
  },
  highlightText: {
    color: "#6C5CE7",
    fontWeight: "900",
  },
  content: {
    paddingTop: 10,
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  exploreMoreWide: {
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 40,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  exploreMoreGradient: {
    padding: 20,
  },
  exploreMoreContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  exploreMoreIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  exploreMoreIcon: {
    width: 40,
    height: 40,
  },
  exploreMoreTextContainer: {
    flex: 1,
  },
  exploreMoreTitleText: {
    fontSize: 20,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  exploreMoreSubtitleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "700",
    marginTop: 2,
  },
  exploreMoreChevron: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 2,
  },
});

export default LearningScreen;
