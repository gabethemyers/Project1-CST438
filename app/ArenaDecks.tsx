// app/ArenaDecks.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getDBConnection } from '../db/connection'; // ← adjust if your path differs

// Only using 3 arenas so far to keep it simple
// Using the 3 most popular arenas
type ArenaKey = 'arena8' | 'arena12' | 'arena15';
type Deck = { name: string; notes?: string; cardNames: string[] };
type CardRow = {
  card_id: number; name: string; elixir_cost: number;
  icon_url_medium: string;
};

// Made one recommened deck for now to keep it simple
// Each deck is tailored for arena level
const deckByArena: Record<ArenaKey, Deck> = {
  arena8: {
    name: 'Hog – Ice Cycle',
    notes: 'Cheap defense, quick Hog cycles.',
    cardNames: ['Hog Rider','Ice Golem','Musketeer','Cannon','The Log','Fireball','Skeletons','Ice Spirit'],
  },
  arena12: {
    name: 'Royal Hogs – Firecracker EQ',
    notes: 'Split Hogs; EQ + Log vs buildings/swarms.',
    cardNames: ['Royal Hogs','Firecracker','Earthquake','The Log','Cannon','Skeletons','Ice Spirit','Royal Delivery'],
  },
  arena15: {
    name: 'Miner Control',
    notes: 'Chip with Miner; defend cheap; Poison clumps.',
    cardNames: ['Miner','Poison','Bomb Tower','Musketeer','The Log','Skeletons','Ice Spirit','Fireball'],
  },
};


const averageElixir = (cards: CardRow[]) => // This takes a list of cards and gives you average elixer cost
  cards.length ? cards.reduce((s, c) => s + (c.elixir_cost || 0), 0) / cards.length : 0;

  // The function below asks the database for these cards, put them back in the right order, warn if any are missing, and return them
  async function getCardsByNames(names: string[]): Promise<CardRow[]> {
  const db = await getDBConnection();
  const qs = names.map(() => '?').join(',');
  const rows = await db.getAllAsync<CardRow>(`SELECT card_id, name, elixir_cost, icon_url_medium FROM cards WHERE name IN (${qs})`, names);
  const byName = new Map(rows.map(r => [r.name, r]));
  const ordered = names.map(n => byName.get(n)).filter(Boolean) as CardRow[];
  const missing = names.filter(n => !byName.has(n));
  if (missing.length) console.warn('Missing card rows (check names):', missing);
  return ordered;
}


export default function ArenaDecks() {
  const { arena } = useLocalSearchParams<{ arena?: string }>(); // Gets the arena name that was passed in (like "arena8")
  const arenaKey = (arena as ArenaKey) ?? 'arena8'; // // If no arena was passed, default to arena8
  const deck = useMemo(() => deckByArena[arenaKey], [arenaKey]);  // This looks up which deck belongs to that arena

  // state: cards from the database + loading indicator
  const [cards, setCards] = useState<CardRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  // When the deck changes (like if you click Arena 12 instead of 8)…
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true); // Show loading spinner
        const rows = await getCardsByNames(deck.cardNames);  // Fetch cards from DB
        if (!cancel) setCards(rows); // Put them into state
      } catch (e) {
        console.warn('Card lookup failed', e); // Fallback to empty
        if (!cancel) setCards([]);
      } finally {
        if (!cancel) setLoading(false);  // Stop loading
      }
    })();
    return () => { cancel = true; }; // Cleanup in case the component unmounts quickly
  }, [deck]);

  const avg = averageElixir(cards ?? []); // This calculates the average elixir of the deck

  return (
    <View style={styles.screen}>
      {/* Simple header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Text style={styles.back}>‹ Back</Text></Pressable>
        <Text style={styles.headerTitle}>{arenaKey.replace('arena', 'Arena ')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.card}>
          <Text style={styles.deckTitle}>{deck.name}</Text>
          {deck.notes ? <Text style={styles.notes}>{deck.notes}</Text> : null}
          <Text style={styles.meta}>{loading ? 'Loading...' : `Avg Elixir: ${avg.toFixed(1)}`}</Text>

          {loading ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : (
            <FlatList
              data={cards ?? []}
              keyExtractor={(c) => String(c.card_id)}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ paddingTop: 6 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              scrollEnabled={false} // ScrollView handles scroll
              renderItem={({ item }) => (
                <View style={styles.cardItem}>
                  {!!item.icon_url_medium && (
                    <Image source={{ uri: item.icon_url_medium }} style={styles.cardImg} resizeMode="contain" />
                  )}
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardElixir}>{item.elixir_cost} Elixir</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'lightgray',
  },
  back: { fontSize: 16, color: 'blue', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'black' },

  card: { margin: 16, padding: 16, borderRadius: 8, backgroundColor: 'whitesmoke' },
  deckTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6, color: 'black' },
  notes: { marginBottom: 8, color: 'gray' },
  meta: { color: 'dimgray', marginBottom: 12 },

  cardItem: {
    flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 10,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray', alignItems: 'center',
  },
  cardImg: { width: 96, height: 96, marginBottom: 8 },
  cardName: { fontSize: 14, fontWeight: '600', textAlign: 'center', color: 'black' },
  cardElixir: { fontSize: 12, color: 'gray', marginTop: 2 },
});
