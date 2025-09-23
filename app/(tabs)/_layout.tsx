import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="landingPage" options={{ headerTitle: 'Home' }} />
      <Tabs.Screen name="cardsPage" options={{ headerTitle: 'Cards' }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="topPlayers" options={{headerTitle: 'Top Players'}}/>
       <Tabs.Screen
        name="searchPlayer"
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
