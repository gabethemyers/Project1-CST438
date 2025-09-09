import { Stack } from "expo-router";

export default function RootLayout() {

    return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens (outside tabs) */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />

      {/* Main app (inside tabs group) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );  

}
