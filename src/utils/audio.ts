let AudioModule: any = null;
try {
  AudioModule = require("expo-av").Audio;
} catch (e) {
  console.warn("expo-av not found, audio features will be disabled.");
}

let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const playSound = async (soundFile: any) => {
  if (!soundEnabled || !AudioModule) return;

  try {
    const { sound } = await AudioModule.Sound.createAsync(soundFile);
    await sound.playAsync();
    // Automatically unload sound when done to prevent memory leaks
    sound.setOnPlaybackStatusUpdate(async (status: any) => {
      if (status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
