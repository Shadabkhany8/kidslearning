import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";


const { width, height } = Dimensions.get("window");

const Cloud = ({ top, left, delay, duration }: any) => {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(float.value, [0, 1], [-15, 15]) }],
    opacity: 0.15,
  }));

  return (
    <Animated.View style={[styles.shape, { top, left }, animatedStyle]}>
      <MaterialCommunityIcons name="cloud" size={80} color="#6C5CE7" />
    </Animated.View>
  );
};

const CircleShape = ({ top, left, size, color }: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.1,
  }));

  return (
    <Animated.View
      style={[
        styles.shape,
        {
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const Star = ({ top, left, size, color }: any) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }, { scale: scale.value }],
    opacity: 0.15,
  }));

  return (
    <Animated.View style={[styles.shape, { top, left }, animatedStyle]}>
      <MaterialCommunityIcons name="star" size={size} color={color} />
    </Animated.View>
  );
};

const Moon = ({ top, left }: any) => {
  const float = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    rotate.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(float.value, [0, 1], [-10, 10]) },
      { rotate: `${rotate.value * 15}deg` },
    ],
    opacity: 0.2,
  }));

  return (
    <Animated.View style={[styles.shape, { top, left }, animatedStyle]}>
      <MaterialCommunityIcons
        name="moon-waning-crescent"
        size={100}
        color="#FDCB6E"
      />
    </Animated.View>
  );
};

const FloatingShapes = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Cloud top={100} left={-40} duration={12000} />
      <Cloud top={400} left={width - 40} duration={15000} />
      <Star top={50} left={width * 0.8} size={40} color="#FFD93D" />
      <Star top={300} left={width * 0.1} size={30} color="#FF6B6B" />
      <Star top={600} left={width * 0.7} size={50} color="#6C5CE7" />
      <Moon top={150} left={width * 0.2} />
      <CircleShape top={500} left={width * 0.3} size={150} color="#4ECDC4" />
      <CircleShape top={50} left={width * 0.5} size={100} color="#FF8E8E" />
      <CircleShape top={height - 200} left={50} size={120} color="#A29BFE" />
    </View>
  );
};

const styles = StyleSheet.create({
  shape: {
    position: "absolute",
    zIndex: -1,
  },
  blob: {
    position: "absolute",
    zIndex: -2,
  },
});

export default FloatingShapes;
