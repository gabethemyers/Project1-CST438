import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert("Missing info", "Enter a username and password.");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password); // ✅ persists user for Deck Builder
      router.replace("/(tabs)/landingPage");
    } catch {
      Alert.alert("Login Failed", "Please check your username and password.");
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
          <Text style={styles.subtitle}>Deck Builder Login</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Log In</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
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
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={() => canSubmit && handleLogin()}
            />

            <Pressable
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              disabled={!canSubmit}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="#0B1222" />
              ) : (
                <Text style={styles.buttonText}>Enter the Arena</Text>
              )}
            </Pressable>

            <Link href="/signup" style={styles.link}>
              Don’t have an account? <Text style={styles.linkStrong}>Sign up</Text>
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
    color: "#BFDBFE",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 24,
    textTransform: "uppercase",
    textAlign: "center",
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
    borderColor: "#374151",
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FACC15",
    marginTop: 6,
    shadowColor: "#FACC15",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonDisabled: { backgroundColor: "#A1A1AA" },
  buttonText: {
    color: "#0B1222",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 12,
    textAlign: "center",
    color: "#9CA3AF",
  },
  linkStrong: { color: "#60A5FA", fontWeight: "700" },
});
