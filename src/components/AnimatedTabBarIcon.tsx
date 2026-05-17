import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedTabBarIconProps {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  focused: boolean;
  color: string;
  activeColor: string;
  gradient: string[];
}

const AnimatedTabBarIcon: React.FC<AnimatedTabBarIconProps> = ({
  name,
  focused,
  color,
  activeColor,
  gradient,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const shimmerTranslate = useSharedValue(-100);
  const rotation = useSharedValue(0);

  // Background circle animations
  const c1Scale = useSharedValue(1);
  const c2Scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2, { damping: 12, stiffness: 200 });
      translateY.value = withSpring(-15, { damping: 12, stiffness: 200 });

      // Glow pulse animation
      glowScale.value = withRepeat(
        withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );

      // Shimmer effect sweep
      shimmerTranslate.value = withRepeat(
        withTiming(150, { duration: 2500, easing: Easing.linear }),
        -1,
        false,
      );

      // Background decorative animations
      c1Scale.value = withRepeat(
        withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      c2Scale.value = withRepeat(
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );

      // Subtle rotation on focus
      rotation.value = withRepeat(
        withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      glowScale.value = withTiming(1);
      shimmerTranslate.value = -100;
      c1Scale.value = withTiming(1);
      c2Scale.value = withTiming(1);
      rotation.value = withTiming(0);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: focused
      ? withTiming(glowScale.value - 0.7, { duration: 100 })
      : withTiming(0.1, { duration: 100 }),
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowRing,
          { backgroundColor: activeColor },
          glowAnimatedStyle,
        ]}
      />

      <Animated.View
        style={[
          styles.iconShadowWrapper,
          styles.activeIconShadow,
          { shadowColor: activeColor },
          animatedStyle,
        ]}
      >
        <View style={[styles.iconWrapper, styles.activeIconWrapper]}>
          <LinearGradient
            colors={gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          >
            {/* Shimmer Effect */}
            <Animated.View style={[styles.shimmerWrapper, shimmerStyle]}>
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>

            {/* Background Circles */}
            <Animated.View style={[styles.circle1, c1Style]} />
            <Animated.View style={[styles.circle2, c2Style]} />
          </LinearGradient>

          <MaterialCommunityIcons
            name={name}
            size={focused ? 26 : 24}
            color="white"
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 55,
  },
  iconShadowWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
  },
  activeIconShadow: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  activeIconWrapper: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  glowRing: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    opacity: 0.2,
  },
  shimmerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  shimmerGradient: {
    width: "50%",
    height: "100%",
  },
  circle1: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    top: -10,
    right: -10,
  },
  circle2: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -5,
    left: -5,
  },
});

export default AnimatedTabBarIcon;
