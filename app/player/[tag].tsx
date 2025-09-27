// app/player/[tag].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

type Arena = { id: number; name: string };
type Clan = { name?: string };
type CardIconUrls = { medium?: string; evolutionMedium?: string };
type Card = { id: number; name: string; iconUrls?: CardIconUrls };
type SeasonLite = { id?: string; trophies?: number; bestTrophies?: number };

type Player = {
  tag: string;
  name: string;
  trophies: number;
  bestTrophies?: number;
  expLevel?: number;
  clan?: Clan;
  arena?: Arena;
  leagueStatistics?: {
    currentSeason?: SeasonLite;
    previousSeason?: SeasonLite;
    bestSeason?: SeasonLite;
  };
  currentDeck?: Card[];
};

const apiKey = process.env.EXPO_PUBLIC_CLASH_ROYALE_API_KEY;

export default function PlayerScreen() {
  const { tag: rawTag } = useLocalSearchParams<{ tag: string }>();
  const tag = decodeURIComponent(rawTag ?? "");

  const H = useMemo(
    () => ({
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    []
  );

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(
          `https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`,
          { headers: H }
        );
        const txt = await res.text();
        if (cancelled) return;
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${txt}`);
        const json = JSON.parse(txt) as Player;
        setPlayer(json);
      } catch (e: any) {
        if (!cancelled) setErr(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [H, tag]);

  return (
    <>
      <Stack.Screen options={{ title: "Player" }} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.dim}>Loading…</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.error}>Failed to load player</Text>
            <Text style={styles.dim}>{err}</Text>
          </View>
        ) : !player ? (
          <View style={styles.center}>
            <Text style={styles.dim}>No data.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>{player.name || "Player"}</Text>
            <Text style={styles.tag}>{player.tag}</Text>

            <View style={styles.card}>
              <Line label="Trophies" value={fmt(player.trophies)} />
              <Line label="Best" value={fmt(player.bestTrophies)} />
              <Line label="XP Level" value={fmt(player.expLevel)} />
              <Line label="Arena" value={player.arena?.name} />
              <Line label="Clan" value={player.clan?.name ?? "No clan"} />
            </View>

            <View style={styles.card}>
              <Text style={styles.section}>League</Text>
              <Text style={styles.line}>
                Current: {fmt(player.leagueStatistics?.currentSeason?.trophies)}{" "}
                (best {fmt(player.leagueStatistics?.currentSeason?.bestTrophies)})
              </Text>
              <Text style={styles.line}>
                Previous {player.leagueStatistics?.previousSeason?.id ?? "—"}:{" "}
                {fmt(player.leagueStatistics?.previousSeason?.trophies)} (best{" "}
                {fmt(player.leagueStatistics?.previousSeason?.bestTrophies)})
              </Text>
              <Text style={styles.line}>
                Best {player.leagueStatistics?.bestSeason?.id ?? "—"}:{" "}
                {fmt(player.leagueStatistics?.bestSeason?.trophies)}
              </Text>
            </View>

            {/* Current Deck images as grid */}
            <View style={styles.card}>
              <Text style={styles.section}>Current Deck</Text>

              {player.currentDeck?.length ? (
                <View style={styles.deckGrid}>
                  {player.currentDeck.map((c) => {
                    const uri =
                      c.iconUrls?.evolutionMedium ||
                      c.iconUrls?.medium ||
                      undefined;
                    return (
                      <View style={styles.deckItem} key={c.id}>
                        {uri ? (
                          <Image
                            source={{ uri }}
                            style={styles.cardImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={[styles.cardImage, styles.cardImageFallback]}>
                            <Text style={styles.cardImageFallbackText}>No Img</Text>
                          </View>
                        )}
                        <Text style={styles.cardName} numberOfLines={1}>
                          {c.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.dim}>No deck available.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

function Line({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Text style={styles.line}>
      <Text style={{ fontWeight: "700" }}>{label}:</Text> {value ?? "—"}
    </Text>
  );
}

function fmt(n?: number | null) {
  return typeof n === "number" ? n.toLocaleString() : "—";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { padding: 24, alignItems: "center", justifyContent: "center" },
  dim: { color: "#6B7280", marginTop: 8 },
  error: { color: "#DC2626", fontWeight: "700" },

  title: { fontSize: 34, fontWeight: "800", paddingHorizontal: 16, paddingTop: 12 },
  tag: { color: "#6B7280", paddingHorizontal: 16, marginTop: 4, marginBottom: 12 },

  card: {
    backgroundColor: "#F3F4F6",
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
  },
  section: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  line: { fontSize: 16, color: "#111827", marginTop: 4 },

  // deck grid
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  deckItem: {
    width: "23%", // ~4 per row
    marginBottom: 16,
    alignItems: "center",
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardImageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  cardImageFallbackText: { color: "#6B7280", fontSize: 12 },
  cardName: {
    marginTop: 6,
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
});

