interface SpeakOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

let voiceEnabled = true;

export const setVoiceEnabled = (enabled: boolean): void => {
  voiceEnabled = enabled;
  if (!enabled && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

export const getVoiceEnabled = (): boolean => voiceEnabled;

export const speakText = (text: string, options: SpeakOptions = {}): void => {
  if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || "en-US";
    utterance.pitch = options.pitch ?? 1.15; // Cheerful, slightly higher pitch for kids
    utterance.rate = options.rate ?? 0.88; // Slightly slower, clear pronunciation
    utterance.volume = options.volume ?? 1;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Zira"))) ||
        v.lang === "en-US"
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn("Speech synthesis error:", error);
  }
};
