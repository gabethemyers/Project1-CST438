// app/player/[tag].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const apiKey = process.env.EXPO_PUBLIC_CLASH_ROYALE_API_KEY;

export default function PlayerScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(
          tag
        )}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const txt = await res.text();
        if (!res.ok) throw new Error(txt);
        if (cancelled) return;
        setPlayer(JSON.parse(txt));
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tag]);

  return (
    <ImageBackground
      source={require("../../assets/images/diamond background.webp")}
      style={styles.bg}
      resizeMode="cover"
    >
      <Stack.Screen options={{ title: "Player" }} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.dim}>Loading player…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>Failed to load player</Text>
            <Text style={styles.dim}>{error}</Text>
          </View>
        ) : (
          player && (
            <View style={{ gap: 16 }}>
              {/* Header */}
              <View>
                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.tag}>{player.tag}</Text>
              </View>

              {/* Stats card */}
              <View style={styles.card}>
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Trophies: </Text>
                  {player.trophies}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Best: </Text>
                  {player.bestTrophies}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>XP Level: </Text>
                  {player.expLevel}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Arena: </Text>
                  {player.arena?.name}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Clan: </Text>
                  {player.clan?.name ?? "—"}
                </Text>
              </View>

              {/* League card */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>League</Text>
                <Text style={styles.rowText}>
                  Current: {player.leagueStatistics?.currentSeason?.trophies} (
                  best {player.leagueStatistics?.currentSeason?.bestTrophies})
                </Text>
                <Text style={styles.rowText}>
                  Previous {player.leagueStatistics?.previousSeason?.id}:{" "}
                  {player.leagueStatistics?.previousSeason?.trophies} (best{" "}
                  {player.leagueStatistics?.previousSeason?.bestTrophies})
                </Text>
                <Text style={styles.rowText}>
                  Best {player.leagueStatistics?.bestSeason?.id}:{" "}
                  {player.leagueStatistics?.bestSeason?.trophies}
                </Text>
              </View>

              {/* Deck card */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Current Deck</Text>
                <FlatList
                  data={player.currentDeck}
                  keyExtractor={(c) => String(c.id)}
                  numColumns={4}
                  scrollEnabled={false}
                  contentContainerStyle={{ marginTop: 8 }}
                  renderItem={({ item }) => (
                    <View style={styles.deckItem}>
                      <Image
                        source={{ uri: item.iconUrls?.medium }}
                        style={styles.deckImg}
                      />
                      <Text style={styles.deckName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          )
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  dim: { color: "#CBD5E1", marginTop: 8 },
  error: { color: "#F87171", fontWeight: "700" },

  name: { fontSize: 28, fontWeight: "900", color: "#fff" },
  tag: { fontSize: 14, color: "#93C5FD", marginTop: 4 },

  card: {
    backgroundColor: "rgba(2, 6, 23, 0.82)", // dark navy translucent
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FACC15",
    marginBottom: 6,
  },
  rowText: {
    color: "#E2E8F0",
    fontSize: 15,
    marginTop: 4,
  },
  bold: { fontWeight: "700", color: "#fff" },

  deckItem: {
    flex: 1,
    alignItems: "center",
    marginBottom: 14,
  },
  deckImg: { width: 60, height: 70, borderRadius: 8 },
  deckName: { marginTop: 4, fontSize: 12, color: "#fff", textAlign: "center" },
});

