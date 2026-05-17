import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import AnimatedTabBarIcon from "../../components/AnimatedTabBarIcon";
import { COLORS } from "../../constants/data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_GRADIENTS = {
  learn: ["#FFD93D", "#FF922B"],
  play: ["#4FACFE", "#00F2FE"],
  settings: ["#FF6B6B", "#FF8E8E"],
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.90)",
        tabBarShowLabel: false,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={styles.blurBackground}
            />
          ) : (
            <View style={styles.androidBackground} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={focused ? "book-open-page-variant" : "book-open-variant"}
              focused={focused}
              color={color}
              activeColor={COLORS.card1}
              gradient={TAB_GRADIENTS.learn}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={
                focused ? "controller-classic" : "controller-classic-outline"
              }
              focused={focused}
              color={color}
              activeColor={COLORS.secondary}
              gradient={TAB_GRADIENTS.play}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={focused ? "cog" : "cog-outline"}
              focused={focused}
              color={color}
              activeColor={COLORS.card2}
              gradient={TAB_GRADIENTS.settings}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 60 : 30, // Increased for Android nav
    width: "60%", // Adjusted width to be a bit wider for better icon spacing
    alignSelf: "center",
    marginHorizontal: "20%", // Fallback centering
    height: 65,
    borderRadius: 35,
    backgroundColor: "transparent", // Removed purple background
    borderTopWidth: 0,
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 10, // Added padding for better spacing
    overflow: "visible",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    overflow: "hidden",
    // Removed solid colorful background for a cleaner glass look
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Light translucent background for Android
    borderRadius: 35,
  },
});
