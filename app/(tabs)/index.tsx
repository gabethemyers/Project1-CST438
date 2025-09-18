import { Redirect } from "expo-router";
  

export default function Index() {
<<<<<<< HEAD
   return <Redirect href="/login" />;
=======
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/LandingPage" style={styles.button}>
        Go to Landing Page
      </Link>
    </View>
  );
>>>>>>> working-daniel
}
