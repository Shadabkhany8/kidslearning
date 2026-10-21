export interface ShapeItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const SHAPES: ShapeItem[] = [
  { id: "circle", name: "Circle", icon: "circle", color: "#FF5733" },
  { id: "square", name: "Square", icon: "square", color: "#33FF57" },
  { id: "triangle", name: "Triangle", icon: "triangle", color: "#3357FF" },
  { id: "star", name: "Star", icon: "star", color: "#FF33E9" },
  { id: "heart", name: "Heart", icon: "heart", color: "#E933FF" },
  { id: "diamond", name: "Diamond", icon: "rhombus", color: "#33FFF6" },
  { id: "hexagon", name: "Hexagon", icon: "hexagon", color: "#FFC300" },
  { id: "pentagon", name: "Pentagon", icon: "pentagon", color: "#C70039" },
  { id: "octagon", name: "Octagon", icon: "octagon", color: "#900C3F" },
  { id: "oval", name: "Oval", icon: "ellipse", color: "#9B59B6" },
  { id: "rectangle", name: "Rectangle", icon: "rectangle", color: "#3498DB" },
  {
    id: "parallelogram",
    name: "Parallelogram",
    icon: "rhombus-split",
    color: "#2ECC71",
  },
  {
    id: "crescent",
    name: "Crescent",
    icon: "moon-waning-crescent",
    color: "#F1C40F",
  },
  {
    id: "semicircle",
    name: "Semicircle",
    icon: "circle-half",
    color: "#1ABC9C",
  },
  { id: "arrow", name: "Arrow", icon: "arrow-right-bold", color: "#E74C3C" },
  { id: "kite", name: "Kite", icon: "rhombus-outline", color: "#FF69B4" },
  { id: "cylinder", name: "Cylinder", icon: "cylinder", color: "#95A5A6" },
  { id: "cube", name: "Cube", icon: "cube", color: "#7F8C8D" },
  { id: "cone", name: "Cone", icon: "cone", color: "#D35400" },
  { id: "pyramid", name: "Pyramid", icon: "pyramid", color: "#16A085" },
];
