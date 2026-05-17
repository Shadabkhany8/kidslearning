import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../constants/data";

interface SectionHeaderProps {
  title: string;
  emoji: string;
  index?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  emoji,
  index = 0,
}) => {
  const translateX = useSharedValue(-30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      index * 150,
      withSpring(0, { damping: 15, stiffness: 100 }),
    );
    opacity.value = withDelay(index * 150, withTiming(1, { duration: 600 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.bubbleContainer}>
        <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginTop: 40,
    marginBottom: 15,
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: "flex-start",
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(108, 92, 231, 0.1)",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Avenir-Black" : "sans-serif-condensed",
  },
  emojiContainer: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F9FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  emoji: {
    fontSize: 20,
  },
});

export default SectionHeader;
