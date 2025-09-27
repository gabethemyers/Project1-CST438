import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createUser } from "../db/auth"; // keep your current logic

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
      const id = await createUser(u, password);
      Alert.alert("Success", `Account created (id ${id}).`);
      router.replace("/landingPage");
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
    <ImageBackground
      source={require("../assets/images/royale.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Clash Royale</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign Up</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#A7B8D6"
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
              placeholder="Password (min 6)"
              placeholderTextColor="#A7B8D6"
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
              <Text style={styles.buttonText}>{loading ? "Creating..." : "Join the Arena"}</Text>
            </Pressable>

            <Link href="/login" style={styles.link}>
              Already have an account? <Text style={styles.linkStrong}>Log in</Text>
            </Link>
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FACC15",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#D8E6FF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 20,
    textTransform: "uppercase",
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#0f1a33DD",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#1F2937",
    color: "white",
    borderWidth: 1,
    borderColor: "#2B3A55",
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#60A5FA", // lighter CR blue
    marginTop: 6,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: "#94A3B8" },
  buttonText: {
    color: "#0B1222",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  link: {
    marginTop: 12,
    textAlign: "center",
    color: "#C7D2FE",
  },
  linkStrong: { color: "#93C5FD", fontWeight: "700" },
});

