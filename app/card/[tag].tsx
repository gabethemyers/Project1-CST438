import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { Card, getCardInfo } from '../../db/cards';

export default function CardScreen() {
    const { tag: rawTag } = useLocalSearchParams<{ tag: string }>();
    const tag = decodeURIComponent(rawTag ?? "")

    const [card, setCard] = useState<Card | null>(null);

    useEffect(() => {
    const fetchCard = async () => {
      const result = await getCardInfo(tag);
      setCard(result);
    };

        fetchCard();
    }, [tag]);


    return (
        <View >
        <View style={styles.card}>
            <Text style={styles.title}>{card?.name}</Text>

            {card?.maxEvolutionLevel ? (
            <View style={styles.imageGrid}>
                <Image
                    source={{ uri: card?.iconUrls?.medium}}
                    style={styles.doubleCardImages}
                />

                <Image
                    source={{ uri: card?.iconUrls?.evolutionMedium}}
                    style={styles.doubleCardImages}
                />

            </View>
            ) : (
                <View style={styles.singleImageGrid}>
                    <Image
                        source={{ uri: card?.iconUrls?.medium}}
                        style={styles.doubleCardImages}
                    />
                </View>
            )}

            <View style={{paddingTop: 50}}>

                <Text style={styles.text}>
                    <Text style={{ fontWeight: "700" }}>Rarity:</Text> {card?.rarity}
                </Text>
                
                <Text style={styles.text}>
                    <Text style={{ fontWeight: "700" }}>Max Level:</Text> {card?.maxLevel}
                </Text>


                {card?.maxEvolutionLevel ? (
                    
                <Text style={styles.text}>
                        <Text style={{ fontWeight: "700" }}>Max Evolution Level:</Text> {card?.maxEvolutionLevel}
                    </Text>
                ) : (
                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "700" }}>{card?.name} Has No Max Evolution Level</Text>
                    </Text>
                )}

                <Text style={styles.text}>
                    <Text style={{ fontWeight: "700" }}>Cost:</Text> {card?.elixirCost}
                </Text>
            
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    imageGrid: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8,
        gap: 10
    },
    title: { fontSize: 34, 
        fontWeight: "800", 
        paddingHorizontal: 16, 
        paddingTop: 12, 
        textAlign:"center", 
        paddingBottom: 50
    },
    doubleCardImages: {
        width: 180,
        height: 180,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    singleImageGrid: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        fontSize: 20, 
        color: "#111827", 
        marginTop: 8,
    },
    card: {
        backgroundColor: "#b5adac",
        marginHorizontal: 12,
        marginTop: 12,
        padding: 50,
        borderRadius: 40,
        height: 700
    },
    centerCard: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});