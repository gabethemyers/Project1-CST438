import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PLACEHOLDER_TAG = "#CVVCU2JJ8"; // <— your fallback tag

export default function SearchPlayerScreen() {
  const [value, setValue] = useState("");

  function onSearch() {
    const raw = value.trim() || PLACEHOLDER_TAG; // <— use placeholder if empty
    const tag = raw.startsWith("#") ? raw : `#${raw}`;
    const href = `/player/${encodeURIComponent(tag)}`;
    router.push(href as Href);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/diamond background.webp")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="search" size={28} color="#FACC15" />
            <Text style={styles.headerText}>Search Player</Text>
          </View>

          {/* Centered card */}
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="trophy" size={20} color="#FACC15" />
                <Text style={styles.cardTitle}>Enter Player Tag</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder={PLACEHOLDER_TAG}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={setValue}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={onSearch}
              />

              <Pressable
                onPress={onSearch}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              >
                <Text style={styles.buttonText}>View Profile</Text>
              </Pressable>

              <Text style={styles.tip}>
                Tip: We’ll automatically add a <Text style={styles.tipStrong}>#</Text> if you forget it.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  cardWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#111827DD",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#1F2937",
    color: "white",
    borderWidth: 1,
    borderColor: "#374151",
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    marginTop: 6,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  tip: {
    marginTop: 8,
    color: "#9CA3AF",
    textAlign: "center",
  },
  tipStrong: {
    color: "#FACC15",
    fontWeight: "800",
  },
});
