import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const goToArena = (arenaKey: string) => {
    router.push({
      pathname: '/ArenaDecks',
      params: { arena: arenaKey },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/clash-royal.png')}
            style={{ width: '100%', height: 200 }}
          />
        </View>

        <View style={styles.arenaCon}>        
          {([
            'arena1','arena2','arena3','arena4',
            'arena5','arena6','arena7','arena8',
            'arena9','arena10','arena11','arena12',
             'arena13','arena14','arena15','arena16',
             'arena17', 'arena18'
          ] as const).map((key) => (
            <Pressable 
              key={key}
              onPress={() => goToArena(key)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.arenaCard,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.arenaCap}>{key.replace('arena', 'Arena ')}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  arenaCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
  },
  arenaCard: {
    width: '45%',
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  arenaCap: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 10 
  },
});
