import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { TabBar } from "./components/TabBar";

// Tabs
import { LearnTab } from "./pages/LearnTab";
import { GamesTab } from "./pages/GamesTab";
import { SettingsTab } from "./pages/SettingsTab";
import { ExploreLearningPage } from "./pages/ExploreLearningPage";

// Learning Modules
import { AlphabetPage } from "./pages/learning/AlphabetPage";
import { NumbersPage } from "./pages/learning/NumbersPage";
import { AnimalsPage } from "./pages/learning/AnimalsPage";
import { FruitsPage } from "./pages/learning/FruitsPage";
import { VegetablesPage } from "./pages/learning/VegetablesPage";
import { ColorsPage } from "./pages/learning/ColorsPage";
import { VehiclesPage } from "./pages/learning/VehiclesPage";
import { SolarSystemPage } from "./pages/learning/SolarSystemPage";
import { BirdsPage } from "./pages/learning/BirdsPage";
import { ShapesPage } from "./pages/learning/ShapesPage";
import { FlowersPage } from "./pages/learning/FlowersPage";
import { CommunityHelpersPage } from "./pages/learning/CommunityHelpersPage";

// Games
import { QuizGamePage } from "./pages/games/QuizGamePage";
import { MemoryGamePage } from "./pages/games/MemoryGamePage";
import { DrawingGamePage } from "./pages/games/DrawingGamePage";
import { ColorFillGamePage } from "./pages/games/ColorFillGamePage";

import { Smartphone, Monitor } from "lucide-react";

export const App: React.FC = () => {
  const [isWideMode, setIsWideMode] = useState(false);

  return (
    <SettingsProvider>
      <HashRouter>
        <div className="app-viewport-wrapper">
          {/* Desktop Frame Mode Switcher */}
          <div className="desktop-controls-bar">
            <button
              onClick={() => setIsWideMode(!isWideMode)}
              title="Toggle Desktop / Mobile Screen Width"
            >
              {isWideMode ? (
                <>
                  <Smartphone size={16} />
                  <span>Mobile View</span>
                </>
              ) : (
                <>
                  <Monitor size={16} />
                  <span>Tablet View</span>
                </>
              )}
            </button>
          </div>

          {/* App Screen Container */}
          <div className={`app-screen-container ${isWideMode ? "wide-mode" : ""}`}>
            <Routes>
              {/* Main Tabs */}
              <Route path="/" element={<Navigate to="/learn" replace />} />
              <Route path="/learn" element={<LearnTab />} />
              <Route path="/games" element={<GamesTab />} />
              <Route path="/settings" element={<SettingsTab />} />
              <Route path="/explore-learning" element={<ExploreLearningPage />} />

              {/* 12 Learning Modules */}
              <Route path="/alphabet" element={<AlphabetPage />} />
              <Route path="/numbers" element={<NumbersPage />} />
              <Route path="/animals" element={<AnimalsPage />} />
              <Route path="/fruits" element={<FruitsPage />} />
              <Route path="/vegetables" element={<VegetablesPage />} />
              <Route path="/colors" element={<ColorsPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/solar-system" element={<SolarSystemPage />} />
              <Route path="/birds" element={<BirdsPage />} />
              <Route path="/shapes" element={<ShapesPage />} />
              <Route path="/flowers" element={<FlowersPage />} />
              <Route path="/community-helpers" element={<CommunityHelpersPage />} />

              {/* 4 Games */}
              <Route path="/quiz" element={<QuizGamePage />} />
              <Route path="/memory" element={<MemoryGamePage />} />
              <Route path="/drawing" element={<DrawingGamePage />} />
              <Route path="/color-fill" element={<ColorFillGamePage />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/learn" replace />} />
            </Routes>

            {/* Persistent Floating Tab Bar on Main Screens */}
            <TabBar />
          </div>
        </div>
      </HashRouter>
    </SettingsProvider>
  );
};

export default App;
