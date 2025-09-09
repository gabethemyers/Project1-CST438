import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="landingPage" options={{ headerTitle: 'Home' }} />
      <Tabs.Screen name="cardsPage" options={{ headerTitle: 'Cards' }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
