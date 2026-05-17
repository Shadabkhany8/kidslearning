import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FeatureCardProps {
  title: string;
  image: any;
  gradient: string[];
  color?: string;
  onPress: () => void;
  index: number;
  level?: number;
  detail?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  image,
  gradient,
  color = "#6C5CE7",
  onPress,
  index,
  level = 1,
  detail = "Basic",
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const shimmerTranslate = useSharedValue(-200);

  // Background circle animations
  const c1Scale = useSharedValue(1);
  const c2Scale = useSharedValue(1);
  const c3Scale = useSharedValue(1);
  const c4Scale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation
    translateY.value = withDelay(
      index * 100,
      withSpring(0, { damping: 15, stiffness: 100 }),
    );
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 600 }));

    // Continuous floating/bounce animation
    floatAnim.value = withDelay(
      index * 200,
      withRepeat(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );

    // Subtle image pulse
    imageScale.value = withDelay(
      index * 200,
      withRepeat(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );

    // Glow pulse animation
    glowScale.value = withRepeat(
      withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    // Shimmer effect sweep
    shimmerTranslate.value = withRepeat(
      withTiming(400, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    // Background decorative animations
    c1Scale.value = withRepeat(
      withTiming(1.15, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    c2Scale.value = withRepeat(
      withTiming(0.85, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    c3Scale.value = withRepeat(
      withTiming(1.25, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    c4Scale.value = withRepeat(
      withTiming(1.1, { duration: 4500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [index]);

  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 10, stiffness: 200 });
    rotation.value = withSequence(
      withTiming(-2, { duration: 40 }),
      withTiming(2, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value + floatAnim.value * -8 },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: withTiming(glowScale.value - 0.5, { duration: 100 }),
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }, { skewX: "-20deg" }],
  }));

  const c1Style = useAnimatedStyle(() => ({
    transform: [{ scale: c1Scale.value }],
  }));

  const c2Style = useAnimatedStyle(() => ({
    transform: [{ scale: c2Scale.value }],
  }));

  const c3Style = useAnimatedStyle(() => ({
    transform: [{ scale: c3Scale.value }],
  }));

  const c4Style = useAnimatedStyle(() => ({
    transform: [{ scale: c4Scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.container,
        { borderColor: `${color}40` }, // 25% opacity
        animatedStyle,
      ]}
      android_ripple={{ color: `${color}20`, borderless: true }}
    >
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topPart}
      >
        {/* Shimmer Effect */}
        <Animated.View style={[styles.shimmerWrapper, shimmerStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        {/* Outer Glow */}
        <Animated.View
          style={[
            styles.glowRing,
            { backgroundColor: "white", opacity: 0.15 },
            glowAnimatedStyle,
          ]}
        />

        <Animated.View
          style={[
            styles.iconContainer,
            { shadowColor: color, shadowOpacity: 0.5 },
            imageAnimatedStyle,
          ]}
        >
          <Image source={image} style={styles.image} resizeMode="contain" />
        </Animated.View>

        {/* Animated Background Circles */}
        <Animated.View style={[styles.circle1, c1Style]} />
        <Animated.View style={[styles.circle2, c2Style]} />
        <Animated.View style={[styles.circle3, c3Style]} />
        <Animated.View
          style={[
            styles.circle4,
            { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            c4Style,
          ]}
        />
      </LinearGradient>

      <View style={[styles.bottomPart, { backgroundColor: `${color}08` }]}>
        <Text style={[styles.title, { color: color }]} numberOfLines={1}>
          {title}
        </Text>
        <View
          style={[
            styles.progressPill,
            { backgroundColor: `${color}15`, borderColor: `${color}30` },
          ]}
        >
          <Text style={[styles.progressText, { color: color }]}>
            Level {level}{" "}
            <Text style={[styles.separator, { color: color }]}>•</Text> {detail}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 165,
    height: 200,
    margin: 10,
    borderRadius: 32,
    backgroundColor: "white",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 2,
  },
  topPart: {
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  shimmerWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 1,
  },
  shimmerGradient: {
    flex: 1,
  },
  glowRing: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    zIndex: 1,
  },
  bottomPart: {
    height: "35%",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0,
  },
  iconContainer: {
    width: 85,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 42.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.3,
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "sans-serif-medium",
  },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    fontFamily:
      Platform.OS === "ios" ? "AvenirNext-DemiBold" : "sans-serif-medium",
  },
  separator: {
    opacity: 0.6,
    fontSize: 10,
    marginHorizontal: 4,
  },
  circle1: {
    position: "absolute",
    top: -15,
    right: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  circle2: {
    position: "absolute",
    bottom: -10,
    left: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  circle3: {
    position: "absolute",
    top: 20,
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  circle4: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default FeatureCard;
