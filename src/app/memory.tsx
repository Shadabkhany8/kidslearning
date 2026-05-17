import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/data";

const { width } = Dimensions.get("window");

const ICON_COLORS: { [key: string]: string } = {
  dog: "#FF9F1C", // Orange
  cat: "#2EC4B6", // Teal
  rabbit: "#E71D36", // Red
  elephant: "#4361EE", // Blue
  fish: "#4CC9F0", // Light Blue
  bird: "#F72585", // Pink
  owl: "#8338EC", // Deep Purple
  cow: "#F15BB5", // Magenta
  pig: "#FF87AB", // Light Pink
  duck: "#FEE440", // Yellow
  bee: "#FFD60A", // Bright Yellow
  butterfly: "#06D6A0", // Green
  ladybug: "#EF233C", // Bright Red
  spider: "#2B2D42", // Dark Blue/Grey
  penguin: "#457B9D", // Steel Blue
  dolphin: "#00B4D8", // Cyan
};

const ALL_ICONS = Object.keys(ICON_COLORS);

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryCard = ({
  card,
  onPress,
  cardSize,
}: {
  card: Card;
  onPress: (card: Card) => void;
  cardSize: number;
}) => {
  const flipAnim = useSharedValue(0);

  useEffect(() => {
    // Simplified flip animation with faster timing for "less animation" feel
    flipAnim.value = withTiming(card.isFlipped || card.isMatched ? 180 : 0, {
      duration: 250,
    });
  }, [card.isFlipped, card.isMatched]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flipAnim.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: flipAnim.value > 90 ? 0 : 1,
      zIndex: flipAnim.value > 90 ? 0 : 1,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flipAnim.value, [0, 180], [180, 0]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: flipAnim.value > 90 ? 1 : 0,
      zIndex: flipAnim.value > 90 ? 1 : 0,
    };
  });

  const iconColor = ICON_COLORS[card.icon] || COLORS.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(card)}
      disabled={card.isFlipped || card.isMatched}
      style={[styles.cardContainer, { width: cardSize, height: cardSize }]}
    >
      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <LinearGradient
            colors={["#4FC3F7", "#039BE5"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.questionMark, { fontSize: cardSize * 0.45 }]}>
            ?
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { backgroundColor: card.isMatched ? "#4CAF50" : iconColor },
            backStyle,
            card.isMatched && styles.matchedCard,
          ]}
        >
          <MaterialCommunityIcons
            name={card.icon as any}
            size={cardSize * 0.55}
            color="white"
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const MemoryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  // Determine grid size based on level
  const getCardCount = (lvl: number) => {
    if (lvl === 1) return 4;
    if (lvl === 2) return 8;
    if (lvl === 3) return 12;
    if (lvl === 4) return 16;
    return 20; // Cap at 20 for visibility
  };

  const getNumColumns = (count: number) => {
    if (count <= 4) return 2;
    if (count <= 12) return 3;
    return 4;
  };

  const cardCount = getCardCount(level);
  const numColumns = getNumColumns(cardCount);
  const cardSize = (width - 60) / numColumns;

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const pairCount = cardCount / 2;
    // Shuffle all icons and pick required number of pairs
    const selectedIcons = [...ALL_ICONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount);

    const gameIcons = [...selectedIcons, ...selectedIcons].sort(
      () => Math.random() - 0.5,
    );

    const newCards = gameIcons.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
  };

  const handleCardPress = (pressedCard: Card) => {
    if (flippedCards.length === 2) return;

    const newCards = cards.map((card) =>
      card.id === pressedCard.id ? { ...card, isFlipped: true } : card,
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, pressedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((m) => m + 1);
      if (newFlippedCards[0].icon === newFlippedCards[1].icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.icon === newFlippedCards[0].icon
                ? { ...card, isMatched: true }
                : card,
            ),
          );
          setFlippedCards([]);
          setMatches((m) => m + 1);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === newFlippedCards[0].id ||
              card.id === newFlippedCards[1].id
                ? { ...card, isFlipped: false }
                : card,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const nextLevel = () => {
    setLevel((l) => l + 1);
  };

  const resetGame = () => {
    setLevel(1);
    initializeGame();
  };

  const isWin = matches === cardCount / 2;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: "#FDFCF0" },
      ]}
    >
      <LinearGradient
        colors={["#4361EE", "#4CC9F0", "#CAF0F8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#4361EE" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Memory Game</Text>
        <View style={styles.headerRight}>
          <View style={styles.levelBadgeHeader}>
            <Text style={styles.levelTextHeader}>Lvl {level}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButtonHeader}
            onPress={resetGame}
          >
            <MaterialCommunityIcons name="refresh" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#FFF4E5" }]}
            >
              <MaterialCommunityIcons
                name="gesture-tap"
                size={18}
                color="#FF9F1C"
              />
            </View>
            <View>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{moves}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#E0F2F1" }]}
            >
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color="#2EC4B6"
              />
            </View>
            <View>
              <Text style={styles.statLabel}>Matches</Text>
              <Text style={styles.statValue}>
                {matches}/{cardCount / 2}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.gameBoard}>
          <FlatList
            key={`level-${level}`}
            data={cards}
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MemoryCard
                card={item}
                onPress={handleCardPress}
                cardSize={cardSize}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {isWin && (
          <View style={styles.winOverlay}>
            <View style={styles.winContainer}>
              <Text style={styles.winEmoji}>🌟</Text>
              <Text style={styles.winTitle}>Great Job!</Text>
              <Text style={styles.winSubtitle}>
                You finished in {moves} moves
              </Text>

              <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
                <Text style={styles.nextText}>Next Level</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetText}>Restart</Text>
              </TouchableOpacity>
            </View>
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
    shadowColor: "#4361EE",
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadgeHeader: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  levelTextHeader: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
  },
  actionButtonHeader: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 8,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    marginHorizontal: 24,
    marginTop: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#F0F0F0",
  },
  statLabel: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
  },
  gameBoard: {
    flex: 1,
    padding: 12,
    marginTop: 8,
  },
  listContent: {
    alignItems: "center",
    paddingBottom: 32,
  },
  cardContainer: {
    margin: 8,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardFront: {
    backgroundColor: "#039BE5",
  },
  cardBack: {
    backgroundColor: "#FFFFFF",
  },
  matchedCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  questionMark: {
    fontWeight: "900",
    color: "white",
  },
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(44, 62, 80, 0.4)",
    backdropFilter: "blur(4px)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  winEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  winTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  winSubtitle: {
    fontSize: 15,
    color: "#7F8C8D",
    marginBottom: 24,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  nextText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  resetButton: {
    paddingVertical: 8,
  },
  resetText: {
    color: "#95A5A6",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MemoryScreen;
