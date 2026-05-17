import React, { createContext, useContext, useEffect, useState } from "react";
import { setSoundEnabled } from "../utils/audio";
import { setVoiceEnabled } from "../utils/speakText";
import { loadData, saveData, STORAGE_KEYS } from "../utils/storage";

export type Language = "en" | "hi";

interface Settings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  language: Language;
  parentLockEnabled: boolean;
  profile: {
    name: string;
    age: string;
    className: string;
    image: string | null;
  };
}

interface SettingsContextType {
  settings: Settings;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleParentLock: () => void;
  setLanguage: (lang: Language) => void;
  updateProfile: (profile: Partial<Settings["profile"]>) => void;
  isLoaded: boolean;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  voiceEnabled: true,
  language: "en",
  parentLockEnabled: true,
  profile: {
    name: "",
    age: "",
    className: "",
    image: null,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      const savedSettings = await loadData(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({
          ...defaultSettings,
          ...savedSettings,
          profile: {
            ...defaultSettings.profile,
            ...(savedSettings.profile || {}),
          },
        });
        setVoiceEnabled(savedSettings.voiceEnabled ?? true);
        setSoundEnabled(savedSettings.soundEnabled ?? true);
      }
      setIsLoaded(true);
    };
    initSettings();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.SETTINGS, settings);
      setVoiceEnabled(settings.voiceEnabled);
      setSoundEnabled(settings.soundEnabled);
    }
  }, [settings, isLoaded]);

  const toggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleVoice = () => {
    setSettings((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const toggleParentLock = () => {
    setSettings((prev) => ({
      ...prev,
      parentLockEnabled: !prev.parentLockEnabled,
    }));
  };

  const setLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const updateProfile = (profileUpdate: Partial<Settings["profile"]>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        toggleSound,
        toggleVoice,
        toggleParentLock,
        setLanguage,
        updateProfile,
        isLoaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
