import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
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
            <ImageBackground
                source={require('../../assets/images/diamond background.webp')}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
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
                </SafeAreaView>
            </ImageBackground>
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
        <ImageBackground
            source={require('../../assets/images/diamond background.webp')}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>My Decks</Text>
                    <FlatList
                        key="user-decks-list"
                        data={userDecks}
                        keyExtractor={(item) => item.deck_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.deckContainer}>
                                <View style={styles.deckHeader}>
                                    <View>
                                        <Text style={styles.deckName}>{item.name}</Text>
                                        <Text style={styles.elixirText}>Average Elixir: {calculateAverageElixir(item.cards)}</Text>
                                    </View>
                                    <View style={styles.buttonGroup}>
                                        <Button title="Edit" onPress={() => handleSelectDeck(item)} />
                                        <Button title="Delete" color="red" onPress={() => handleDeleteDeck(item)} />
                                    </View>
                                </View>
                                <FlatList
                                    data={item.cards}
                                    keyExtractor={(card) => card.id.toString()}
                                    numColumns={4}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.deckCardList}
                                    renderItem={({ item: card }) => (
                                        <View style={styles.deckCardItem}>
                                            <CardItem card={card} size="small" />
                                        </View>
                                    )}
                                    ListEmptyComponent={<Text style={styles.emptyDeckText}>This deck is empty.</Text>}
                                />
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>You have no decks. Create one!</Text>}
                    />
                    <View style={styles.createButtonContainer}>
                        <Button title="Create New Deck" onPress={handleCreateDeck} />
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const calculateAverageElixir = (cards: Card[]): number => {
    if (cards.length === 0) return 0;
    const totalElixir = cards.reduce((sum, card) => sum + card.elixirCost, 0);
    return Number((totalElixir / cards.length).toFixed(1));
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    deckNameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#90caf9',
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
    },
    listContainer: {
        paddingHorizontal: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'white',
    },
    emptyDeckText: {
        margin: 10,
        color: '#90caf9',
    },
    deckContainer: {
        marginBottom: 16,
        padding: 8, // Reduced padding
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#90caf9',
    },
    deckHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    deckName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    elixirText: {
        fontSize: 16,
        color: '#90caf9',
        marginTop: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    gridCardItem: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 12,
    },
    gridCardImage: {
        width: 65,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#90caf9',
    },
    gridCardName: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
        color: 'white',
    },
    createButtonContainer: {
        marginTop: 16,
        paddingHorizontal: 32,
    },
    deckCardList: {
        justifyContent: 'flex-start',
    },
    deckCardItem: {
        width: '25%',
        padding: 2,
        aspectRatio: 1, // Changed from 0.8 to make it square
    },
});