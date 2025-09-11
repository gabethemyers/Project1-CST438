import { Link, useRouter } from "expo-router";
import React from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createUser } from "../db/auth"; // ← adjust path if your db folder moved

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const canSubmit = username.trim().length >= 3 && password.length >= 6;

  const onSignUp = async () => {
    const u = username.trim();
    if (u.length < 3 || password.length < 6) {
      Alert.alert("Invalid input", "Username must be 3+ chars and password 6+.");
      return;
    }
    setLoading(true);
    try {
      const id = await createUser(u, password); // hashes & inserts
      Alert.alert("Success", `Account created (id ${id}).`);
      // TODO (optional): persist session in AsyncStorage here
      router.replace("/(tabs)/landingPage");
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("taken")) {
        Alert.alert("Username taken", "Please choose a different username.");
      } else {
        Alert.alert("Sign up error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoComplete="password-new"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit && !loading) onSignUp();
          }}
        />

        <Pressable
          style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
          disabled={!canSubmit || loading}
          onPress={onSignUp}
        >
          <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign up"}</Text>
        </Pressable>

        <Link href="/login" style={styles.link}>
          Have an account? Log in.
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "100%", height: 44, borderColor: "#ccc", borderWidth: 1, borderRadius: 8,
    marginBottom: 15, paddingHorizontal: 12, backgroundColor: "#fff",
  },
  button: { width: "100%", height: 44, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", borderRadius: 8 },
  buttonDisabled: { backgroundColor: "#a5c8ff" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textDecorationLine: "underline", color: "#007AFF", marginTop: 15 },
});

