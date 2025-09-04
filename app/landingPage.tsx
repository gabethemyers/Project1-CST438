import React from 'react';
import {StyleSheet, Text, TextInput, Image, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [arenaLvl, onChangeText] = React.useState('');
  const [specificMods, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <View style={styles.container}>

          <Image
              source={require('../assets/images/swordLogo.png')}
              style={{width: 100, height: 100}}
            
            />

            <Text style={styles.arn1cap}>
              Arena 1
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
  arn1cap: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
  },
  container: {

  },
});

export default TextInputExample;