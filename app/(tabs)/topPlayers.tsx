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


const apiKey = process.env.EXPO_PUBLIC_CLASH_ROYAL_API_KEY;


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

  // --- seasons picker state ---
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2022-09"); // default to last reliable
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.clashroyale.com/v1/locations/global/seasons", { headers: H });
        const txt = await res.text();
        if (!res.ok) throw new Error(txt);
        const json = JSON.parse(txt);
        const items: Season[] = Array.isArray(json?.items) ? json.items : [];

        // Collect ids, filter valid, dedupe, and sort
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

  // --- players for chosen season ---
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

  // --- tap handler for player ---
  function goToPlayer(rawTag: string) {
    const tag = rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
    const href = `/player/${encodeURIComponent(tag)}`;
    router.push(href as Href);
  }

  // Ensure seasons are unique
  const uniqueSeasons = React.useMemo(
    () => Array.from(new Map(seasons.map((s) => [s.id, s])).values()),
    [seasons]
  );

  return (
    <View style={styles.container}>

      {/* Season selector field */}
      <View style={styles.pickerRow}>
        <Text style={styles.pickerLabel}>Season:</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [
            styles.pickerField,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.pickerValue}>{selectedSeason}</Text>
          <Text style={styles.pickerChevron}>▾</Text>
        </Pressable>
      </View>

      {/* Bottom sheet modal for seasons */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Season</Text>
            <Pressable onPress={() => setPickerOpen(false)} hitSlop={10}>
              <Text style={styles.sheetClose}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            data={[...uniqueSeasons].reverse()} // show newest first
            keyExtractor={(s) => s.id}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            renderItem={({ item }) => {
              const active = item.id === selectedSeason;
              return (
                <Pressable
                  onPress={() => {
                    setSelectedSeason(item.id);
                    setPickerOpen(false);
                  }}
                  style={[
                    styles.optionRow,
                    active && styles.optionActive,
                  ]}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {item.id}
                  </Text>
                  {active ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 8 }}
            style={{ maxHeight: 360 }}
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
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => goToPlayer(item.tag)} style={styles.row}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtle}>
                  {item.trophies} 🏆 • {item.clan?.name ?? "No clan"}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 12,
    backgroundColor: "#111827",
    color: "white",
  },
  center: { padding: 16, alignItems: "center", justifyContent: "center" },
  dim: { color: "#6B7280", marginTop: 8 },
  error: { color: "#DC2626", fontWeight: "700", marginTop: 8 },

  // picker field
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  pickerLabel: { fontWeight: "600", marginRight: 8 },
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  pickerValue: { fontSize: 16, fontWeight: "600" },
  pickerChevron: { marginLeft: 8, fontSize: 14, color: "#6B7280" },

  // sheet
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff",
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  sheetTitle: { fontSize: 16, fontWeight: "700" },
  sheetClose: { color: "#2563EB", fontWeight: "600" },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionActive: { backgroundColor: "#EEF2FF" },
  optionText: { fontSize: 16 },
  optionTextActive: { fontWeight: "700", color: "#1D4ED8" },
  check: { color: "#1D4ED8", fontSize: 16, fontWeight: "700" },

  // list rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { color: "white", fontWeight: "700" },
  name: { fontSize: 16, fontWeight: "700" },
  subtle: { color: "#374151", marginTop: 2 },
});


