import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import { cacheCards, getCardCount } from '../db/cards';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const cardCount = await getCardCount();
        if (cardCount === 0) {
          console.log("Card database is empty. Caching cards from API...");
          await cacheCards();
          console.log("Cards cached successfully.");
        } else {
          console.log(`Card database already has ${cardCount} cards.`);
        }
        setIsReady(true);
      } catch (e) {
        console.error("Failed to initialize the app:", e);
        setError("Could not load card data. Please check your internet connection and API key.");
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading Cards...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens (outside tabs) */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* detail screen outside the tabs */}
        <Stack.Screen name="player/[tag]" options={{ title: "Player", headerShown: true }} />


        {/* Main app (inside tabs group) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
