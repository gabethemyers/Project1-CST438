// app/(tabs)/landingPage.tsx
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingPage() {
  const goToArena = (arenaKey: string) => {
    router.push({ pathname: "/ArenaDecks", params: { arena: arenaKey } });
  };

  return (
    // ⬇️ Make the IMAGE the outermost container so it covers the entire screen
    <ImageBackground
      source={require("../../assets/images/diamond background.webp")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {/* ⬇️ SafeAreaView inside the background, keep it transparent */}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.mainTitle}>Choose an Arena</Text>

          <View style={styles.arenaSection}>
            <Pressable onPress={() => goToArena("arena8")} style={styles.arenaWrap}>
              <Image
                source={require("../../assets/images/arena8.png")}
                style={styles.hero}
              />
              <Text style={styles.arenaLabel}>Arena 8</Text>
            </Pressable>

            <Pressable onPress={() => goToArena("arena12")} style={styles.arenaWrap}>
              <Image
                source={require("../../assets/images/arena_spooky.png")}
                style={styles.hero}
              />
              <Text style={styles.arenaLabel}>Arena 12</Text>
            </Pressable>

            <Pressable onPress={() => goToArena("arena15")} style={styles.arenaWrap}>
              <Image
                source={require("../../assets/images/arena_mine.png")}
                style={styles.hero}
              />
              <Text style={styles.arenaLabel}>Arena 15</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Let content grow so the background image fills behind the tab bar
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  arenaSection: { gap: 32 },
  arenaWrap: { alignItems: "center" },

  hero: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    backgroundColor: "transparent",
  },

  arenaLabel: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 22,
    backgroundColor: "#1E40AF",
    color: "white",
    fontWeight: "800",
    fontSize: 18,
    textAlign: "center",
  },
});


