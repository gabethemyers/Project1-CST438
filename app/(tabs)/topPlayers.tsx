// app/(tabs)/topPlayers.tsx
import { router, type Href } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Clan = { name?: string; tag?: string };
type Player = { tag: string; name: string; rank: number; trophies: number; clan?: Clan };
type Season = { id: string };

const apiKey = process.env.EXPO_PUBLIC_CLASH_ROYALE_API_KEY;

export default function TopPlayersScreen() {
  const H = useMemo(
    () => ({
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    []
  );

  /** seasons state (unchanged) */
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2022-09");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.clashroyale.com/v1/locations/global/seasons", { headers: H });
        const txt = await res.text();
        if (!res.ok) throw new Error(txt);
        const json = JSON.parse(txt);
        const items: Season[] = Array.isArray(json?.items) ? json.items : [];

        const ids = items
          .map((s) => String(s.id))
          .filter((id) => /^\d{4}-\d{2}$/.test(id) && id <= "2022-09");
        const uniqueIds = Array.from(new Set(ids)).sort();

        setSeasons(uniqueIds.map((id) => ({ id })));
        if (!uniqueIds.includes(selectedSeason)) {
          setSelectedSeason(uniqueIds.at(-1) ?? "2022-09");
        }
      } catch {
        setSeasons([{ id: "2022-09" }]);
      }
    })();
  }, [H]);

  /** players state (unchanged) */
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.clashroyale.com/v1/locations/global/seasons/${selectedSeason}/rankings/players?limit=50`;
        const res = await fetch(url, { headers: H });
        const txt = await res.text();
        if (cancelled) return;
        if (!res.ok) throw new Error(txt);
        const json = JSON.parse(txt);
        const items: Player[] = Array.isArray(json?.items) ? json.items : [];
        setPlayers(items);
      } catch (e: any) {
        if (!cancelled) {
          setError(String(e?.message || e));
          setPlayers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [H, selectedSeason]);

  /** nav (unchanged) */
  function goToPlayer(rawTag: string) {
    const tag = rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
    const href = `/player/${encodeURIComponent(tag)}`;
    router.push(href as Href);
  }

  const uniqueSeasons = React.useMemo(
    () => Array.from(new Map(seasons.map((s) => [s.id, s])).values()),
    [seasons]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Top Players</Text>
      </View>

      {/* Season selector */}
      <View style={styles.selectorWrap}>
        <Text style={styles.selectorLabel}>Season</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [
            styles.selectorField,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
          ]}
        >
          <Text style={styles.selectorValue}>{selectedSeason}</Text>
          <Text style={styles.selectorChevron}>▾</Text>
        </Pressable>
      </View>

      {/* Seasons modal sheet */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Season</Text>
            <Pressable onPress={() => setPickerOpen(false)} hitSlop={10}>
              <Text style={styles.sheetClose}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            data={[...uniqueSeasons].reverse()}
            keyExtractor={(s) => s.id}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            style={{ maxHeight: 360 }}
            renderItem={({ item }) => {
              const active = item.id === selectedSeason;
              return (
                <Pressable
                  onPress={() => {
                    setSelectedSeason(item.id);
                    setPickerOpen(false);
                  }}
                  style={[styles.optionRow, active && styles.optionActive]}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {item.id}
                  </Text>
                  {active ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </Modal>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dim}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Error</Text>
          <Text style={styles.dim}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(p) => p.tag}
          contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => goToPlayer(item.tag)} style={styles.cardRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  <Text style={styles.trophy}>{item.trophies} 🏆</Text>
                  <Text style={styles.metaDot}> • </Text>
                  <Text style={styles.metaClan}>{item.clan?.name ?? "No clan"}</Text>
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

/** Styles only—no logic changed */
const CLASH_DARK = "#0B1223";
const CLASH_BLUE = "#1E3A8A";
const CLASH_GOLD = "#FACC15";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" }, // slate-900 backdrop

  /** Header */
  headerBar: {
    backgroundColor: CLASH_DARK,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  /** Season selector row */
  selectorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0f172a",
  },
  selectorLabel: {
    color: "#cbd5e1",
    fontWeight: "700",
  },
  selectorField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  selectorValue: { color: "white", fontSize: 16, fontWeight: "700" },
  selectorChevron: { marginLeft: 8, color: "#9CA3AF", fontSize: 14 },

  /** Seasons sheet */
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#0b1220",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sheetTitle: { color: "white", fontSize: 16, fontWeight: "800" },
  sheetClose: { color: CLASH_GOLD, fontWeight: "800" },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(255,255,255,0.08)" },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  optionActive: { backgroundColor: "rgba(30,64,175,0.35)" },
  optionText: { color: "#e5e7eb", fontSize: 16 },
  optionTextActive: { color: "#fff", fontWeight: "800" },
  check: { color: CLASH_GOLD, fontSize: 16, fontWeight: "900" },

  /** Loading / error */
  center: { padding: 16, alignItems: "center", justifyContent: "center" },
  dim: { color: "#94A3B8", marginTop: 8 },
  error: { color: "#F87171", fontWeight: "800", marginTop: 8 },

  /** Player rows */
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CLASH_BLUE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(250,204,21,0.6)",
  },
  rankText: { color: "white", fontWeight: "900" },
  name: { color: "white", fontSize: 16, fontWeight: "800" },
  meta: { marginTop: 2 },
  trophy: { color: CLASH_GOLD, fontWeight: "800" },
  metaDot: { color: "#64748B" },
  metaClan: { color: "#cbd5e1" },
  chev: { color: "#94A3B8", fontSize: 18, fontWeight: "900" },
});


