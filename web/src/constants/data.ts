export const COLORS = {
  primary: "#6C5CE7",
  secondary: "#00CEC9",
  background: "#F9FBFF",
  text: "#2D3436",
  card1: "#FDCB6E",
  card2: "#FF7675",
  card3: "#55EFC4",
  card4: "#81ECEC",
  card5: "#A29BFE",
  card6: "#FAB1A0",
  learnGradient: ["#FDCB6E", "#FFEAA7"],
  playGradient: ["#55EFC4", "#81ECEC"],
  headerGradient: ["#6C5CE7", "#A29BFE"],
};

export interface NumberItem {
  id: string;
  value: number;
  image: string;
  audio: string;
}

export const NUMBERS: NumberItem[] = Array.from({ length: 100 }, (_, i) => i + 1).map(
  (num) => ({
    id: num.toString(),
    value: num,
    image: `./assets/images/feature/numbers.png`,
    audio: `numbers/${num}.mp3`,
  }),
);
