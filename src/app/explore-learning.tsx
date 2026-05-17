import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import FeatureCard from "../components/FeatureCard";
import FloatingShapes from "../components/FloatingShapes";
import { COLORS } from "../constants/data";
import { FEATURE_CATEGORIES } from "../constants/featureData";
import { useProgress } from "../hooks/useProgress";

const ExploreLearningScreen = () => {
  const router = useRouter();
  const { categories } = useProgress();

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

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <FloatingShapes />

      {/* Consistent Header Style */}
      <LinearGradient
        colors={["#6C5CE7", "#A78BFA"]}
        style={[
          styles.headerGradient,
          {
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 0) + 10
                : 20,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore More</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <FlatList
            data={FEATURE_CATEGORIES.learning.slice(4)}
            renderItem={renderFeatureItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.listPadding}
            columnWrapperStyle={styles.columnWrapper}
            keyExtractor={(item) => `learn-${item.id}`}
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
  headerGradient: {
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
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

export default ExploreLearningScreen;
