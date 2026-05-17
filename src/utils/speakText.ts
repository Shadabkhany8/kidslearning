import * as Speech from "expo-speech";

interface SpeakOptions {
  language?: string;
  pitch?: number;
  rate?: number;
}

let voiceEnabled = true;

export const setVoiceEnabled = (enabled: boolean) => {
  voiceEnabled = enabled;
};

export const speakText = (text: string, options: SpeakOptions = {}) => {
  if (!voiceEnabled) return;

  Speech.stop();
  Speech.speak(text, {
    language: "en-US",
    pitch: 1,
    rate: 0.9,
    ...options,
  });
};
