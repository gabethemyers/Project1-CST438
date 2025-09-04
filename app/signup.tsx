import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignupScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value ={password} onChangeText={setPassword}/>
      <Pressable style={styles.button} onPress={() => console.log("Signing up...")}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      <Link href="/login" style={styles.linkToSignUp}> 
        Have an account? Log in. 
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