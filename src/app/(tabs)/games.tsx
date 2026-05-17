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
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
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

const GamesProgress = ({
  percentage,
  stars,
}: {
  percentage: number;
  stars: number;
}) => {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(percentage, {
      damping: 15,
      stiffness: 60,
    });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Games Achievement</Text>
        <View style={styles.levelBadge}>
          <MaterialCommunityIcons name="trophy" size={14} color="#FFD700" />
          <Text style={styles.levelText}>Master</Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, progressStyle]}>
          <LinearGradient
            colors={["#FF7675", "#FDCB6E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>

      <View style={styles.progressFooter}>
        <Text style={styles.progressSubtext}>
          You have earned ⭐ <Text style={styles.highlightText}>{stars}</Text>{" "}
          stars in games!
        </Text>
      </View>
    </View>
  );
};

const GamesScreen = () => {
  const router = useRouter();
  const { totalStars } = useProgress();
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

  const mascotRotation = useSharedValue(0);
  const mascotScale = useSharedValue(1);

  useEffect(() => {
    mascotRotation.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    mascotScale.value = withRepeat(
      withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [mascotRotation, mascotScale]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(mascotRotation.value, [0, 1], [-10, 10])}deg` },
      { scale: mascotScale.value },
    ],
  }));

  const handleCardPress = (route: string) => {
    Speech.speak("Ready to Play?", {
      rate: 1.1,
      pitch: 1.5,
      volume: 0.8,
    });
    router.push(route as any);
  };

  const renderFeatureItem = ({ item, index }: { item: any; index: number }) => (
    <FeatureCard
      title={item.title}
      image={item.image}
      gradient={item.gradient}
      color={item.color}
      index={index}
      onPress={() => handleCardPress(item.route)}
    />
  );

  const headerStyle = useAnimatedStyle(() => ({
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 25,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
                      name="gamepad-variant"
                      size={32}
                      color="#FF7675"
                    />
                  )}
                </View>

                <Animated.View style={[titleStyle, { marginLeft: 12 }]}>
                  <Text style={styles.welcomeText}>Game Time! 🎮</Text>
                  <Text style={styles.subtitle}>Play & Have Fun</Text>
                </Animated.View>
              </View>

              <View style={[styles.scoreBadge, { backgroundColor: "#FF7675" }]}>
                <MaterialCommunityIcons name="star" size={18} color="gold" />
                <Text style={styles.scoreText}>{totalStars}</Text>
              </View>
            </View>

            <GamesProgress percentage={65} stars={totalStars} />
          </Animated.View>
        </View>

        <View style={styles.content}>
          <FlatList
            data={FEATURE_CATEGORIES.games}
            renderItem={renderFeatureItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.listPadding}
            columnWrapperStyle={styles.columnWrapper}
            keyExtractor={(item) => `game-${item.id}`}
          />
        </View>

        <View style={{ height: 100 }} />
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
    backgroundColor: "#FFEBEB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF0F0",
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "#FF7675",
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
    backgroundColor: "rgba(255, 118, 117, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 118, 117, 0.2)",
  },
  levelText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FF7675",
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
    color: "#FF7675",
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
});

export default GamesScreen;
