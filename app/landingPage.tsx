import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const TextInputExample = () => {
  // const [arenaLvl, onChangeText] = React.useState('');
  // const [specificMods, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <View style={styles.container}>

          <Image
              source={require('../assets/images/swordLogo.png')}
              style={{width: 100, height: 100}}
            
            />

          <Image
              source={require('../assets/images/swordLogo.png')}
              style={{width: 100, height: 100}}
            
            />

            <Image
              source={require('../assets/images/swordLogo.png')}
              style={{width: 100, height: 100}}
            
            />

            <Image
              source={require('../assets/images/swordLogo.png')}
              style={{width: 100, height: 100}}
            
            />

          
        </View>

        <View style={styles.arenaCon}>

          <Text style={styles.arenaCap}>
            Arena 1
          </Text>

          <Text style={styles.arenaCap}>
            Arena 2
          </Text>

          <Text style={styles.arenaCap}>
            Arena 3
          </Text>

          <Text style={styles.arenaCap}>
            Arena 4
          </Text>


        </View>


        
        {/* <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={arenaLvl}
          placeholder="Enter Arena Level"
          keyboardType="numeric"
        /> */}

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  arenaCap: {

    color: 'black',
  },
  arenaCon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    padding: 10,
  },
});

export default TextInputExample;