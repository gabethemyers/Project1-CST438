import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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