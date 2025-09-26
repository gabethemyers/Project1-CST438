import { DeckBuilderProvider } from '@/context/DeckBuilderContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <DeckBuilderProvider>
      <Tabs>
        <Tabs.Screen
          name="searchPlayer"
          options={{
            title: 'Search Player',
            tabBarLabel: 'Search',
            tabBarIcon: ({focused, color, size}) => {
              const iconName = focused ? 'search' : 'search-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }}
        />
        <Tabs.Screen
          name="topPlayers"
          options={{
            title: 'Leaderboard',
            tabBarLabel: 'Top Players',
            tabBarIcon: ({focused, color, size}) => {
              const iconName = focused ? 'trophy' : 'trophy-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }}
        />
        <Tabs.Screen
          name="landingPage"
          options={{
            title: 'Home Page',       // Header title
            tabBarLabel: 'Home',
            tabBarIcon: ({focused, color, size}) => {
              const iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }}
        />
        <Tabs.Screen
          name="cardsPage"
          options={{
            title: 'Card Collection',
            tabBarLabel: 'Cards',
            tabBarIcon: ({focused, color, size}) => {
              const iconName = focused ? 'layers' : 'layers-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="deckBuilder"
          options={{
            title: 'Deck Builder',
            tabBarLabel: 'My Decks',
            tabBarIcon: ({focused, color, size}) => {
              const iconName = focused ? 'duplicate' : 'duplicate-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }}
        />
      </Tabs>
    </DeckBuilderProvider>
  );
}
