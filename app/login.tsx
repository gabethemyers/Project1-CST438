import { Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

   const handleLogin = () => {
    // TODO: Replace with real authentication logic
    const userExists = true; // Replace with DB check
    if (userExists) {
      router.replace("/(tabs)/landingPage");// Navigates to landing page
    } else {
       console.log("Invalid credentials");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value ={password} onChangeText={setPassword}/>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
      <Link href="/signup" style={styles.linkToSignUp}> 
        Don't have an account? Sign Up. 
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkToSignUp: {
    textDecorationLine: 'underline',
    color: '#007AFF',
    marginTop: 15,
  }
});