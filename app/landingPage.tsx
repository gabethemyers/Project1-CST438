import React from 'react';
import {StyleSheet, TextInput, Image, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [arenaLvl, onChangeText] = React.useState('');
  const [specificMods, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={arenaLvl}
          placeholder="Enter Arena Level"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={specificMods}
          placeholder="Enter any desired modifications"
          keyboardType="numeric"
        />
        <View style={{alignItems: 'center'}}>
          <Image 
              source={require('../assets/images/clash-royal.png')} 
              style={{ width: 800, height: 350}} 
          />
          </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
  }, 
});

export default TextInputExample;