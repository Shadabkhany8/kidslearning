import { Stack } from "expo-router";
import { SettingsProvider } from "../context/SettingsContext";

export default function Layout() {
  return (
    <SettingsProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#00CEC9",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            paddingBottom: 0,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="alphabet" options={{ headerShown: false }} />
        <Stack.Screen name="numbers" options={{ headerShown: false }} />
        <Stack.Screen name="animals" options={{ headerShown: false }} />
        <Stack.Screen name="fruits" options={{ headerShown: false }} />
        <Stack.Screen name="colors" options={{ headerShown: false }} />
        <Stack.Screen
          name="explore-learning"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="memory" options={{ headerShown: false }} />
        <Stack.Screen name="drawing" options={{ headerShown: false }} />
      </Stack>
    </SettingsProvider>
  );
}
