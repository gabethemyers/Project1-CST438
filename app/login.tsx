import { Link, useRouter } from "expo-router";
import React from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { verifyUser } from "../db/auth"; // ← adjust path if your db folder moved

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert("Missing info", "Enter a username and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await verifyUser(username.trim(), password);
      if (!user) {
        Alert.alert("Invalid credentials", "Username or password is incorrect.");
        return;
      }
      // TODO (optional): persist session in AsyncStorage here
      router.replace("/(tabs)/landingPage");
    } catch (e: any) {
      Alert.alert("Login error", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

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
          autoComplete="password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit && !loading) handleLogin();
          }}
        />

        <Pressable
          style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
          disabled={!canSubmit || loading}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log In"}</Text>
        </Pressable>

        <Link href="/signup" style={styles.link}>
          Don’t have an account? Sign up.
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
