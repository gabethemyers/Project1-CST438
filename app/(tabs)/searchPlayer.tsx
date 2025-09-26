import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchPlayer() {
  const router = useRouter();
  const [tag, setTag] = useState("");

  // A valid tag you can demo with
  const placeholder = "#CVVCU2JJ8";

  const onSearch = () => {
    const cleanTag = (tag.trim() || placeholder).toUpperCase();
    const withHash = cleanTag.startsWith("#") ? cleanTag : `#${cleanTag}`;
    router.push(`/player/${encodeURIComponent(withHash)}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Search Player</Text>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          autoCorrect={false}
          value={tag}
          onChangeText={setTag}
        />

        <Pressable style={styles.button} onPress={onSearch}>
          <Text style={styles.buttonText}>View Profile</Text>
        </Pressable>

        <Text style={styles.tip}>
          Tip: We will automatically add a # if you forget it.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 20 },
  input: {
    width: "100%",
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  tip: { marginTop: 12, fontSize: 12, color: "#6B7280" },
});
