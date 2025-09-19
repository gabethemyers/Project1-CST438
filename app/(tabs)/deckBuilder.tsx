import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { CardItem } from '../../components/CardItem';
import { useAuth } from '../../context/AuthContext';
import { useDeckBuilder } from '../../context/DeckBuilderContext';
import { Card } from '../../db/cards';
import * as deckService from '../../db/decks';
import { DeckWithCards } from '../../db/decks';

export default function DeckBuilderScreen() {
    const [userDecks, setUserDecks] = useState<DeckWithCards[]>([]);
    const { activeDeck, startBuildingDeck, removeCard, saveDeck, clearActiveDeck, updateActiveDeckName } = useDeckBuilder();
    const { user } = useAuth();

    // Function to load all user decks with their cards
    const loadUserDecks = async () => {
        if (!user) return; // Don't fetch if no user is logged in
        const basicDecks = await deckService.getUserDecks(user.id);
        const decksWithCards = await Promise.all(
            basicDecks.map(deck => deckService.getDeckWithCards(deck.deck_id))
        );
        // Filter out any nulls in case a deck was deleted during fetch
        setUserDecks(decksWithCards.filter(d => d !== null) as DeckWithCards[]);
    };

    // Re-load decks whenever the user finishes editing or the user changes
    useEffect(() => {
        if (!activeDeck && user) {
            loadUserDecks();
        }
    }, [activeDeck, user]);

    const handleSelectDeck = (deck: DeckWithCards) => {
        startBuildingDeck(deck);
    };

    const handleCreateDeck = async () => {
        if (!user) return; // Guard against no user
        const newDeckName = `New Deck ${userDecks.length + 1}`;
        const newDeckId = await deckService.createDeck(user.id, newDeckName);
        if (newDeckId) {
            startBuildingDeck({
                deck_id: newDeckId,
                user_id: user.id,
                name: newDeckName,
                cards: [],
            });
        }
    };

    const handleDeleteDeck = (deck: DeckWithCards) => {
        Alert.alert(
            "Delete Deck",
            `Are you sure you want to delete "${deck.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deckService.deleteDeck(deck.deck_id);
                        loadUserDecks(); // Refresh the list after deleting
                    },
                },
            ]
        );
    };

    // This is the view for when you are actively editing a deck
    if (activeDeck) {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.deckNameInput}
                    value={activeDeck.name}
                    onChangeText={updateActiveDeckName}
                    placeholder="Deck Name"
                />
                <FlatList
                    key="active-deck-list"
                    data={activeDeck.cards}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }: { item: Card }) => (
                        <CardItem
                            card={item}
                            renderAction={() => (
                                <Button title="Remove" onPress={() => removeCard(item.id)} />
                            )}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Go to the 'Cards' tab to add cards!</Text>}
                />
                <Button
                    title="Save and Finish"
                    onPress={async () => {
                        await saveDeck();
                        clearActiveDeck();
                    }}
                />
            </View>
        );
    }

    // Add a check for the user before rendering the main content
    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to manage your decks.</Text>
            </View>
        );
    }

    // This is the main view showing the list of all your decks
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Decks</Text>
            <FlatList
                key="user-decks-list"
                data={userDecks}
                keyExtractor={(item) => item.deck_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.deckContainer}>
                        <View style={styles.deckHeader}>
                            <Text style={styles.deckName}>{item.name}</Text>
                            <View style={styles.buttonGroup}>
                                <Button title="Edit" onPress={() => handleSelectDeck(item)} />
                                <Button title="Delete" color="red" onPress={() => handleDeleteDeck(item)} />
                            </View>
                        </View>
                        <FlatList
                            data={item.cards}
                            keyExtractor={(card) => card.id.toString()}
                            numColumns={4} // Arrange items in 4 columns
                            scrollEnabled={false} // Disable scrolling for this nested list
                            renderItem={({ item: card }) => (
                                <View style={styles.gridCardItem}>
                                    <Image source={{ uri: card.iconUrls?.medium }} style={styles.gridCardImage} />
                                    <Text style={styles.gridCardName} numberOfLines={1}>{card.name}</Text>
                                </View>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyDeckText}>This deck is empty.</Text>}
                        />
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>You have no decks. Create one!</Text>}
            />
            <Button title="Create New Deck" onPress={handleCreateDeck} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, paddingHorizontal: 8 },
    // Add a new style for the TextInput
    deckNameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    listContainer: { paddingHorizontal: 8 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
    emptyDeckText: { margin: 10, color: '#888' },
    // Deck List Styles
    deckContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    deckHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    deckName: { fontSize: 18, fontWeight: 'bold' },
    buttonGroup: { flexDirection: 'row', gap: 10 },
    // REMOVED smallCardImage style and added new grid styles
    gridCardItem: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
    },
    gridCardImage: {
        width: 65,
        height: 80,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    gridCardName: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});