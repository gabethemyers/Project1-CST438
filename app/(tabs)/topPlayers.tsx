import { router, type Href } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

type Clan = { name?: string; tag?: string };
type Player = { tag: string; name: string; rank: number; trophies: number; clan?: Clan };
type Season = { id: string; startTime?: string; endTime?: string; isActive?: boolean };

// 🔑 put your key here or import from a shared config
const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImJiOTU5ZWViLTQ2YzAtNGI3NS1iYjdkLTBkMTRiNzg2ZjIxNCIsImlhdCI6MTc1ODA1MTIzNiwic3ViIjoiZGV2ZWxvcGVyLzY5MzY3ODE2LTM2YjctYTMzYy0zNzY5LTE5NmMyNDcyYTc3MSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxOTguMTg5LjI0OS43MyIsIjE3NC44NS45OS4xNjkiXSwidHlwZSI6ImNsaWVudCJ9XX0.7J0lte_XOk25woxuxAzBqrylSQcBVr2cSz4pD1Wr4f1-qAUvU4qlBpTDeq1ZJ3ZdweAzlaLAQHVLpQUiGQ4CpA";

export default function TopPlayersScreen() {
  const H = useMemo(
    () => ({
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    []
  );

  // --- seasons picker (only working seasons) ---
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2022-09"); // default to last reliable

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.clashroyale.com/v1/locations/global/seasons", { headers: H });
        const txt = await res.text();
        if (!res.ok) throw new Error(txt);
        const json = JSON.parse(txt);
        const items: Season[] = Array.isArray(json?.items) ? json.items : [];

        // keep only seasons <= 2022-09 (API newer ones broken)
        const allowed = items
          .map(s => s.id)
          .filter((id: string) => typeof id === "string" && id <= "2022-09")
          .sort(); // ascending

        setSeasons(allowed.map(id => ({ id } as Season)));
        if (!allowed.includes(selectedSeason)) setSelectedSeason(allowed.at(-1) ?? "2022-09");
      } catch (_) {
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

  // --- tap handler: navigate with a simple string path ---
  function goToPlayer(rawTag: string) {
  const tag = rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
  const href = `/player/${encodeURIComponent(tag)}`;
  router.push(href as Href);
}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Players</Text>

      <View style={styles.pickerRow}>
        <Text style={styles.pickerLabel}>Season:</Text>
        <RNPickerSelect
          onValueChange={(v) => v && setSelectedSeason(v)}
          value={selectedSeason}
          items={seasons.map((s) => ({ label: s.id, value: s.id }))}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
            iconContainer: { right: 10, top: 10 },
          }}
          placeholder={{}}
        />
      </View>

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

  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  pickerLabel: { fontWeight: "600", marginRight: 8 },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },

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


