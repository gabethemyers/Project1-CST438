import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDeckBuilder } from '../../context/DeckBuilderContext';
import * as deckService from '../../db/decks';
import { Deck } from '../../db/decks';

export default function DeckBuilderScreen() {
    const [userDecks, setUserDecks] = useState<Deck[]>([]);
    const { activeDeck, startBuildingDeck, removeCard, saveDeck, clearActiveDeck } = useDeckBuilder();
    const MOCK_USER_ID = 1; // Replace with actual logged-in user ID

    useEffect(() => {
        deckService.getUserDecks(MOCK_USER_ID).then(setUserDecks);
    }, []);

    const handleSelectDeck = async (deck: Deck) => {
        const deckWithCards = await deckService.getDeckWithCards(deck.deck_id);
        if (deckWithCards) {
            startBuildingDeck(deckWithCards);
        }
    };

    const handleCreateDeck = async () => {
        const newDeckId = await deckService.createDeck(MOCK_USER_ID, `New Deck ${userDecks.length + 1}`);
        if (newDeckId) {
            const newDeck = await deckService.getDeckWithCards(newDeckId);
            if (newDeck) {
                startBuildingDeck(newDeck);
                // Refresh list
                deckService.getUserDecks(MOCK_USER_ID).then(setUserDecks);
            }
        }
    };

    if (activeDeck) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Building: {activeDeck.name}</Text>
                <FlatList
                    key="active-deck-list" // Add a unique key
                    data={activeDeck.cards}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4}
                    renderItem={({ item }) => (
                        <View style={styles.cardItem}>
                            <Text>{item.name}</Text>
                            <Button title="Remove" onPress={() => removeCard(item.id)} />
                        </View>
                    )}
                    ListEmptyComponent={<Text>Go to the 'Cards' tab to add cards!</Text>}
                />
                <Button title="Save and Finish" onPress={() => {
                    saveDeck();
                    clearActiveDeck();
                }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Decks</Text>
            <FlatList
                key="user-decks-list" // Add a different unique key
                data={userDecks}
                keyExtractor={(item) => item.deck_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.deckItem}>
                        <Text>{item.name}</Text>
                        <Button title="Edit" onPress={() => handleSelectDeck(item)} />
                    </View>
                )}
            />
            <Button title="Create New Deck" onPress={handleCreateDeck} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    deckItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
    cardItem: { flex: 1, alignItems: 'center', padding: 5 },
});