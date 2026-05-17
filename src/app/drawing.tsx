import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import FloatingShapes from "../components/FloatingShapes";
import { COLORS } from "../constants/data";

const { width, height } = Dimensions.get("window");

interface DrawingPath {
  path: string;
  color: string;
  brushSize: number;
}

const DrawingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [color, setColor] = useState<string>(COLORS.primary);
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");

  const colors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.card1,
    COLORS.card2,
    COLORS.card3,
    COLORS.card4,
    COLORS.card5,
    "#000000",
  ];

  const CANVAS_BG = "#FFFFFF";

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const newPath = `M ${event.x} ${event.y}`;
      setCurrentPath(newPath);
    })
    .onUpdate((event) => {
      setCurrentPath((prev) => `${prev} L ${event.x} ${event.y}`);
    })
    .onEnd(() => {
      if (currentPath) {
        setPaths((prev) => [
          ...prev,
          {
            path: currentPath,
            color: tool === "eraser" ? CANVAS_BG : color,
            brushSize: tool === "eraser" ? brushSize * 2 : brushSize,
          },
        ]);
        setCurrentPath("");
      }
    })
    .runOnJS(true);

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath("");
  };

  const undo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={["#FF6B6B", "#FF8E8E", "#FFB3A1"]}
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
              color="#FF6B6B"
            />
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle}>Magic Canvas</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={undo} style={styles.actionButtonHeader}>
              <MaterialCommunityIcons name="undo" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearCanvas}
              style={styles.actionButtonHeader}
            >
              <MaterialCommunityIcons name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <FloatingShapes />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              entering={FadeInDown.duration(800)}
              style={styles.canvasContainer}
            >
              <Svg style={StyleSheet.absoluteFill}>
                {paths.map((p, index) => (
                  <Path
                    key={index}
                    d={p.path}
                    stroke={p.color}
                    strokeWidth={p.brushSize}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {currentPath ? (
                  <Path
                    d={currentPath}
                    stroke={tool === "eraser" ? CANVAS_BG : color}
                    strokeWidth={tool === "eraser" ? brushSize * 2 : brushSize}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
              </Svg>
            </Animated.View>
          </GestureDetector>
        </View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.toolbar}>
          <View style={styles.toolSection}>
            <TouchableOpacity
              onPress={() => setTool("brush")}
              style={[styles.toolButton, tool === "brush" && styles.activeTool]}
            >
              <MaterialCommunityIcons
                name="brush"
                size={24}
                color={tool === "brush" ? "white" : COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTool("eraser")}
              style={[
                styles.toolButton,
                tool === "eraser" && styles.activeTool,
              ]}
            >
              <MaterialCommunityIcons
                name="eraser"
                size={24}
                color={tool === "eraser" ? "white" : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.colorPicker}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorOption,
                  { backgroundColor: c },
                  color === c && tool === "brush" && styles.selectedColor,
                ]}
                onPress={() => {
                  setColor(c);
                  setTool("brush");
                }}
              />
            ))}
          </View>

          <View style={styles.brushPicker}>
            {[3, 8, 15, 25].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.brushOption,
                  brushSize === size && styles.selectedBrush,
                ]}
                onPress={() => setBrushSize(size)}
              >
                <View
                  style={{
                    width: Math.min(size + 5, 30),
                    height: Math.min(size + 5, 30),
                    borderRadius: 15,
                    backgroundColor: tool === "eraser" ? "#DDD" : color,
                    borderWidth: 1,
                    borderColor: "#EEE",
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCF0",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#FF6B6B",
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonHeader: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    position: "relative",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 15,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "#E1E1E1",
  },
  toolbar: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  toolSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  toolButton: {
    padding: 12,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    width: 60,
    alignItems: "center",
  },
  activeTool: {
    backgroundColor: COLORS.primary,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedColor: {
    borderColor: COLORS.secondary,
    transform: [{ scale: 1.2 }],
  },
  brushPicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 20,
  },
  brushOption: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBrush: {
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default DrawingScreen;
