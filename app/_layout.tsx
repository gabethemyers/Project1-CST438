import { Stack } from "expo-router";

export default function RootLayout() {

    return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens (outside tabs) */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />

      {/* detail screen outside the tabs */}
      <Stack.Screen name="player/[tag]" options={{ title: "Player", headerShown: true }} />


      {/* Main app (inside tabs group) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );  
}
