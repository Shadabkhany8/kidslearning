import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import FloatingShapes from "../components/FloatingShapes";
import { FRUITS } from "../constants/fruitData";

const QuizScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height: screenHeight } = useWindowDimensions();
  const isSmallDevice = width < 380 || screenHeight < 700;

  const [currentQuestion, setCurrentQuestion] = useState<
    (typeof FRUITS)[0] | null
  >(null);
  const [options, setOptions] = useState<(typeof FRUITS)[0][]>([]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongAnswerId, setWrongAnswerId] = useState<string | null>(null);

  const starScale = useRef(new Animated.Value(0)).current;
  const questionFade = useRef(new Animated.Value(0)).current;
  const optionsScale = useRef(new Animated.Value(0)).current;

  const speak = (text: string) => {
    Speech.speak(text, {
      language: "en",
      pitch: 1.2,
      rate: 0.8,
    });
  };

  const generateQuestion = useCallback(() => {
    const randomFruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const shuffledOptions = [...FRUITS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (!shuffledOptions.find((o) => o.id === randomFruit.id)) {
      shuffledOptions[Math.floor(Math.random() * 4)] = randomFruit;
    }

    setCurrentQuestion(randomFruit);
    setOptions(shuffledOptions);
    setShowSuccess(false);
    setWrongAnswerId(null);

    // Animations
    questionFade.setValue(0);
    optionsScale.setValue(0);
    Animated.parallel([
      Animated.timing(questionFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(optionsScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Speak question
    speak(`Where is the ${randomFruit.name}?`);
  }, [questionFade, optionsScale]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (fruit: (typeof FRUITS)[0]) => {
    if (currentQuestion && fruit.id === currentQuestion.id) {
      setScore(score + 10);
      setShowSuccess(true);
      speak("Awesome!");
      animateSuccess();
      setTimeout(generateQuestion, 1500);
    } else {
      setWrongAnswerId(fruit.id);
      speak(`No, that's ${fruit.name}`);
      setTimeout(() => setWrongAnswerId(null), 1000);
    }
  };

  const animateSuccess = () => {
    starScale.setValue(0);
    Animated.spring(starScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#E0F2FE", "#F0F9FF", "#FFFFFF"]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingShapes />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        <LinearGradient
          colors={["#FF9F1C", "#FFBF69", "#FFD89B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topHeader}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF9F1C"
            />
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle}>Fruit Quiz</Text>
          <View style={styles.scoreBadgeHeader}>
            <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.scoreTextHeader}>{score}</Text>
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={[
            styles.gameContent,
            { padding: isSmallDevice ? 10 : 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.questionCard,
              {
                opacity: questionFade,
                padding: isSmallDevice ? 15 : 30,
                marginBottom: isSmallDevice ? 20 : 40,
                transform: [
                  {
                    translateY: questionFade.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F8FAFC"]}
              style={[StyleSheet.absoluteFill, { borderRadius: 40 }]}
            />
            <Text style={styles.questionLabel}>Where is the</Text>
            <TouchableOpacity
              onPress={() => speak(currentQuestion.name)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.questionTarget,
                  {
                    color: currentQuestion.color,
                    fontSize: isSmallDevice ? 36 : 56,
                  },
                ]}
              >
                {currentQuestion.name}?
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.questionDecorator,
                { backgroundColor: currentQuestion.color },
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.optionsGrid,
              { transform: [{ scale: optionsScale }] },
            ]}
          >
            {options.map((option: (typeof FRUITS)[0]) => {
              const buttonSize = (width - (isSmallDevice ? 50 : 100)) / 2;
              const isWrong = wrongAnswerId === option.id;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={option.id}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: "white",
                      width: buttonSize,
                      height: buttonSize,
                      margin: isSmallDevice ? 8 : 12,
                      borderRadius: isSmallDevice ? 25 : 35,
                      borderColor: isWrong ? "#EF4444" : "#E2E8F0",
                      borderWidth: isWrong ? 4 : 2,
                      opacity: wrongAnswerId && !isWrong ? 0.6 : 1,
                    },
                  ]}
                  onPress={() => handleAnswer(option)}
                >
                  <View
                    style={[
                      styles.optionImageContainer,
                      { backgroundColor: option.color + "15" },
                    ]}
                  >
                    <Image
                      source={option.image}
                      style={{
                        width: buttonSize * 0.75,
                        height: buttonSize * 0.75,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </ScrollView>

        {showSuccess && (
          <View style={styles.overlayContainer} pointerEvents="none">
            <Animated.View
              style={[styles.successPop, { transform: [{ scale: starScale }] }]}
            >
              <MaterialCommunityIcons
                name="star-circle"
                size={isSmallDevice ? 120 : 180}
                color="#FFD700"
              />
              <Text
                style={[
                  styles.successText,
                  { fontSize: isSmallDevice ? 36 : 48 },
                ]}
              >
                AWESOME!
              </Text>
              <Text style={styles.successSubText}>+10 Points</Text>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#FF9F1C",
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
    flex: 1,
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    marginLeft: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreBadgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreTextHeader: {
    color: "white",
    fontWeight: "900",
    marginLeft: 4,
    fontSize: 16,
  },
  gameContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  questionCard: {
    width: "100%",
    borderRadius: 40,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    position: "relative",
    overflow: "hidden",
  },
  questionLabel: {
    fontSize: 18,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  questionTarget: {
    fontWeight: "900",
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.05)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionDecorator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    marginTop: 15,
    opacity: 0.3,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  optionButton: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },
  optionImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    zIndex: 100,
  },
  successPop: {
    alignItems: "center",
  },
  successText: {
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
    marginTop: 15,
  },
  successSubText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4ADE80",
    marginTop: 5,
  },
});

export default QuizScreen;
