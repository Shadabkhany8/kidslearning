import confetti from "canvas-confetti";

export const triggerConfetti = () => {
  try {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF9F1C"],
    });
    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF9F1C"],
    });
  } catch (e) {
    // Ignore in case of DOM issues
  }
};

export const triggerStarConfetti = () => {
  try {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { y: 0.6 },
      shapes: ["circle"],
      colors: ["#FFD700", "#FFA500", "#FF69B4", "#00F2FE"],
    });
  } catch (e) {}
};
