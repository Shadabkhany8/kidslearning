export interface SolarSystemItem {
  id: string;
  name: string;
  image: string;
  color: string;
}

export const SOLAR_SYSTEM: SolarSystemItem[] = [
  {
    id: "sun",
    name: "Sun",
    image: "./assets/images/solarSystem/sun.png",
    color: "#FFD700",
  },
  {
    id: "mercury",
    name: "Mercury",
    image: "./assets/images/solarSystem/mercury.png",
    color: "#BDBDBD",
  },
  {
    id: "venus",
    name: "Venus",
    image: "./assets/images/solarSystem/venus.png",
    color: "#FFCC80",
  },
  {
    id: "earth",
    name: "Earth",
    image: "./assets/images/solarSystem/earth.png",
    color: "#2196F3",
  },
  {
    id: "mars",
    name: "Mars",
    image: "./assets/images/solarSystem/mars.png",
    color: "#FF5252",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    image: "./assets/images/solarSystem/jupiter.png",
    color: "#D7CCC8",
  },
  {
    id: "saturn",
    name: "Saturn",
    image: "./assets/images/solarSystem/saturn.png",
    color: "#FFF176",
  },
  {
    id: "moon",
    name: "Moon",
    image: "./assets/images/solarSystem/moon.png",
    color: "#ECEFF1",
  },
];
