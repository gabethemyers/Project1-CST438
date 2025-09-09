import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export default function SignupScreen() {
 const [username, setUsername] = React.useState("");
 const [password, setPassword] = React.useState("");

import { Link, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createUser } from "../db/auth";

export default function SignupScreen() {
 const router = useRouter()
 const [username, setUsername] = React.useState("");
 const [password, setPassword] = React.useState("");
 const [loading, setLoading] = React.useState(false);

 const canSubmit = username.trim().length >= 3 && password.length >= 6;

  const onSignUp = async () => {
    if (!canSubmit) {
      Alert.alert("Invalid input", "Username must be 3+ chars and password 6+.");
      return;
    }
    setLoading(true);
    try {
      // This will hash the password and INSERT into users
      const id = await createUser(username.trim(), password);
      Alert.alert("Success", `Account created (id ${id}).`);
      router.replace("/(tabs)/landingPage");
    } catch (e: any) {
      const msg = String(e?.message || e);
      //  createUser should check for duplicates and throw "Username already taken".
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
   <View style={styles.container}>
     <Text style={styles.title}>Sign up</Text>
    
     <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
     <TextInput style={styles.input} placeholder="Password" secureTextEntry value ={password} onChangeText={setPassword}/>

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

