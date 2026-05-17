export interface ColoringArea {
  id: string;
  path: string;
  defaultColor: string;
}

export interface ColoringPage {
  id: string;
  title: string;
  areas: ColoringArea[];
  viewBox: string;
}

export const COLORING_PAGES: ColoringPage[] = [
  // Level 1: Basic Shapes
  {
    id: "house",
    title: "Sweet Home 🏠",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "roof",
        path: "M 20 100 L 100 20 L 180 100 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wall",
        path: "M 40 100 H 160 V 180 H 40 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "door",
        path: "M 85 140 H 115 V 180 H 85 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "window",
        path: "M 55 120 H 75 V 140 H 55 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "tree",
    title: "Green Tree 🌳",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "trunk",
        path: "M 90 180 H 110 V 130 H 90 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "leaves",
        path: "M 100 30 Q 150 30 150 80 Q 150 130 100 130 Q 50 130 50 80 Q 50 30 100 30",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "sun",
    title: "Happy Sun ☀️",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "circle",
        path: "M 100 100 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0",
        defaultColor: "#FFFFFF",
      },
      {
        id: "ray1",
        path: "M 100 20 L 100 50",
        defaultColor: "#FFFFFF",
      },
      {
        id: "ray2",
        path: "M 100 150 L 100 180",
        defaultColor: "#FFFFFF",
      },
      {
        id: "ray3",
        path: "M 20 100 L 50 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "ray4",
        path: "M 150 100 L 180 100",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  // Level 2: Nature
  {
    id: "flower",
    title: "Pretty Flower 🌸",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "petal1",
        path: "M 100 100 Q 130 70 160 100 Q 130 130 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "petal2",
        path: "M 100 100 Q 130 130 100 160 Q 70 130 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "petal3",
        path: "M 100 100 Q 70 130 40 100 Q 70 70 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "petal4",
        path: "M 100 100 Q 70 70 100 40 Q 130 70 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "center",
        path: "M 100 100 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "butterfly",
    title: "Butterfly 🦋",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "wing-left-top",
        path: "M 100 100 Q 50 50 40 80 Q 30 110 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing-left-bottom",
        path: "M 100 100 Q 50 150 40 120 Q 30 90 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing-right-top",
        path: "M 100 100 Q 150 50 160 80 Q 170 110 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing-right-bottom",
        path: "M 100 100 Q 150 150 160 120 Q 170 90 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "body",
        path: "M 95 60 Q 100 50 105 60 L 105 140 Q 100 150 95 140 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "cloud",
    title: "Fluffy Cloud ☁️",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "cloud-body",
        path: "M 50 120 Q 30 120 30 100 Q 30 80 50 80 Q 50 60 80 60 Q 110 60 120 80 Q 150 80 150 100 Q 150 120 130 120 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  // Level 3: Animals
  {
    id: "fish",
    title: "Golden Fish 🐠",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 40 100 Q 100 40 160 100 Q 100 160 40 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "tail",
        path: "M 160 100 L 190 70 V 130 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "eye",
        path: "M 70 90 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "ladybug",
    title: "Ladybug 🐞",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body-left",
        path: "M 100 60 Q 40 60 40 120 Q 40 180 100 180 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "body-right",
        path: "M 100 60 Q 160 60 160 120 Q 160 180 100 180 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "head",
        path: "M 80 60 Q 100 30 120 60 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "dot1",
        path: "M 70 100 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0",
        defaultColor: "#FFFFFF",
      },
      {
        id: "dot2",
        path: "M 130 100 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "bird",
    title: "Happy Bird 🐦",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 60 100 Q 100 60 140 100 Q 140 140 100 140 Q 60 140 60 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing",
        path: "M 100 100 Q 70 120 100 140 Q 130 120 100 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "beak",
        path: "M 140 100 L 160 95 L 140 90 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "eye",
        path: "M 120 90 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  // Level 4: Vehicles
  {
    id: "car",
    title: "Vroom Car 🚗",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 30 140 H 170 V 110 Q 170 80 140 80 H 60 Q 30 80 30 110 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "roof",
        path: "M 60 80 L 80 50 H 120 L 140 80 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wheel1",
        path: "M 60 140 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wheel2",
        path: "M 140 140 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "boat",
    title: "Sail Boat ⛵",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "hull",
        path: "M 40 140 L 60 170 H 140 L 160 140 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "sail",
        path: "M 100 40 L 100 130 L 150 130 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "mast",
        path: "M 95 40 H 100 V 140 H 95 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "airplane",
    title: "Flying Plane ✈️",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 40 100 Q 100 70 160 100 Q 100 130 40 100",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing-top",
        path: "M 100 85 L 80 40 L 120 40 L 110 85 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "wing-bottom",
        path: "M 100 115 L 80 160 L 120 160 L 110 115 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "tail",
        path: "M 40 100 L 20 80 V 120 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  // Level 5: Fruits
  {
    id: "apple",
    title: "Red Apple 🍎",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 100 60 Q 130 60 140 80 Q 160 110 140 140 Q 120 170 100 160 Q 80 170 60 140 Q 40 110 60 80 Q 70 60 100 60",
        defaultColor: "#FFFFFF",
      },
      {
        id: "leaf",
        path: "M 100 60 Q 110 30 130 40 Q 110 50 100 60",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "banana",
    title: "Yellow Banana 🍌",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 50 50 Q 100 50 150 150 Q 100 130 50 50",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "strawberry",
    title: "Sweet Berry 🍓",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 100 170 Q 140 150 140 100 Q 140 60 100 60 Q 60 60 60 100 Q 60 150 100 170",
        defaultColor: "#FFFFFF",
      },
      {
        id: "cap",
        path: "M 100 60 L 80 40 L 90 60 L 100 40 L 110 60 L 120 40 L 100 60 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  // Level 6: Vegetables
  {
    id: "carrot",
    title: "Crunchy Carrot 🥕",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 100 40 L 120 170 Q 100 180 80 170 Z",
        defaultColor: "#FFFFFF",
      },
      {
        id: "leaves",
        path: "M 100 40 Q 110 10 120 30 M 100 40 Q 100 10 90 30 M 100 40 Q 90 10 80 30",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "tomato",
    title: "Juicy Tomato 🍅",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 100 160 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0",
        defaultColor: "#FFFFFF",
      },
      {
        id: "cap",
        path: "M 100 110 L 90 100 L 100 90 L 110 100 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
  {
    id: "eggplant",
    title: "Purple Eggplant 🍆",
    viewBox: "0 0 200 200",
    areas: [
      {
        id: "body",
        path: "M 100 60 Q 140 60 140 120 Q 140 180 100 180 Q 60 180 60 120 Q 60 60 100 60",
        defaultColor: "#FFFFFF",
      },
      {
        id: "cap",
        path: "M 100 60 L 80 80 H 120 Z",
        defaultColor: "#FFFFFF",
      },
    ],
  },
];
