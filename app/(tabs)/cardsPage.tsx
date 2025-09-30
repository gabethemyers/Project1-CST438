import AntDesign from '@expo/vector-icons/AntDesign';
import { router, type Href } from "expo-router";
import React from 'react';
import { Button, FlatList, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { CardItem } from '../../components/CardItem';
import { useDeckBuilder } from '../../context/DeckBuilderContext';
import { Card, fetchCardsFromAPI } from '../../db/cards';

const rarities = [
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
    { label: 'Legendary', value: 'legendary' },
    { label: 'Champion', value: 'champion' },
];

const elixirs = [
    { label: 'All', value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
];

const CardsScreen = () => {
    const [data, setData] = React.useState<Card[]>([]);

    React.useEffect(() => {
        const loadCards = async () => {
            try {
                const cards = await fetchCardsFromAPI();
                setData(cards);
            } catch (error) {
                console.error("Failed to fetch cards:", error);
            }
        };
        loadCards();
    }, []);

    const [rarityFilter, setRarityFilter] = React.useState<string | null>(null);
    const [elixirFilter, setElixirFilter] = React.useState<number | null>(null);

    const displayedCards = data.filter(card => {
        const rarityMatch = rarityFilter ? card.rarity.toLowerCase() === rarityFilter : true;
        const elixirMatch = elixirFilter ? card.elixirCost === elixirFilter : true;
        return rarityMatch && elixirMatch;
    });

    const { activeDeck, addCard } = useDeckBuilder();

    const renderCard = ({ item }: { item: Card }) => {
        const isCardInDeck = activeDeck?.cards.some(c => c.id === item.id) ?? false;
        const isDeckFull = activeDeck ? activeDeck.cards.length >= 8 : false;

        return (
            <Pressable onPress={() => goToCard(item.name)} style={{ flex: 1, alignItems: 'center' }}>
                <CardItem
                    card={item}
                    renderAction={() => (
                        // Only show the button if a deck is being built
                        activeDeck && (
                            <Button
                                title={isCardInDeck ? "Added" : "Add"}
                                onPress={() => addCard(item)}
                                disabled={isCardInDeck || isDeckFull}
                            />
                        )
                    )}
                />
            </Pressable>
        );
    };

    function goToCard(rawTag: string) {
        //const tag = rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
        const href = `/card/${encodeURIComponent(rawTag)}`;
        router.push(href as Href);
    }


    return (
        <ImageBackground
            source={require('../../assets/images/diamond background.webp')}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Card Collection</Text>
                    <View style={styles.filterContainer}>
                        <Button title="Reset Filters" onPress={() => {
                            setRarityFilter(null);
                            setElixirFilter(null);
                        }} />

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={rarities}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Rarity"
                            value={rarityFilter}
                            onChange={item => setRarityFilter(item.value)}
                            renderLeftIcon={() => <AntDesign style={styles.icon} name="filter" size={20} />}
                        />

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={elixirs}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Elixir Cost"
                            value={elixirFilter}
                            onChange={item => setElixirFilter(item.value)}
                            renderLeftIcon={() => <AntDesign style={styles.icon} name="filter" size={20} />}
                        />
                    </View>

                    <FlatList
                        data={displayedCards}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={[styles.listContainer, { paddingBottom: 24 }]}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default CardsScreen;

// responsive sizing handled in CardItem; column spacing below prevents clipping

const styles = StyleSheet.create({
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
    filterContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#90caf9',
        marginBottom: 16,
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: 'space-around', // Distribute cards evenly
        marginVertical: 8, // Add consistent vertical spacing
    },
    cardWrapper: {
        width: '48%', // Each card takes up 48% of the row
        marginHorizontal: 4, // Small horizontal margin
        aspectRatio: 0.75, // Ensure cards are not too skinny
    },
    dropdown: {
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#90caf9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    icon: {
        marginRight: 5,
        color: '#90caf9',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#90caf9',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'white',
    },
});