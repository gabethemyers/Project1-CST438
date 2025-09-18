import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../types/navigation';
import ArenaDecks from './ArenaDecks';
import LandingPage from './LandingPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="ArenaDecks" component={ArenaDecks} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
