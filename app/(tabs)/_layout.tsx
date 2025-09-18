import { DeckBuilderProvider } from '@/context/DeckBuilderContext';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <DeckBuilderProvider>
      <Tabs>
        <Tabs.Screen name="landingPage" options={{ headerTitle: 'Home' }} />
        <Tabs.Screen name="cardsPage" options={{ headerTitle: 'Cards' }} />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="topPlayers" options={{ headerTitle: 'Top Players' }} />
        <Tabs.Screen name="deckBuilder" options={{ headerTitle: 'Deck Builder'}} />
      </Tabs>
    </DeckBuilderProvider>
  );
}
