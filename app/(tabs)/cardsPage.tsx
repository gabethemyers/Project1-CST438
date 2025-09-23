import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { CardItem } from '../../components/CardItem'; // Import the new component
import { useDeckBuilder } from '../../context/DeckBuilderContext';
import { Card, fetchCardsFromAPI } from '../../db/cards';

const rarities = [
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
    { label: 'Legendary', value: 'legendary' },
    { label: 'Champion', value: 'Champion' },
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


    // Enter your own api key inside of this apikey variable

    const apiKey = process.env.EXPO_PUBLIC_CLASH_ROYAL_API_KEY;

    
    // Url used to fetch all the cards in the api request
    const url = "https://api.clashroyale.com/v1/cards";

    // requestOptions is used in order to enter api key in the format that the clash royale api is expecting
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`, 
            'Content-Type': 'application/json'
        }
    };
 


    // Intialized An array of type Card to the apis response
    const[data, setData] = useState<Card[]>([]);

    useEffect(()=>{

        // Function to fetch the apis response
        const fetchCardData = async () => {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log(result)
        setData(result.items || []);
        }
        fetchCardData();
    }, [])

    // Used for debugging
    useEffect(() => {
        console.log("Updated data:", data);
    }, [data]);


    


    

    const [rarityFilter, setRarityFilter] = useState<string | null>(null);
    const [elixirFilter, setElixirFilter] = useState<number | null>(null);
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
        );
    };


    return (
        // Set a flex: 1 on the outer container to ensure FlatList can scroll
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.filterContainer}>
                <Text style={styles.headerText}>Card Collection</Text>
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

            {/* --- 3. Configured FlatList ---
                This replaces the ScrollView and .map() function.
                `numColumns` creates the grid layout.
            */}
            <FlatList
                data={displayedCards}
                renderItem={renderCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default CardsScreen;

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // (Screen width / 2 columns) - (horizontal margins)

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: 'white',
        padding: 16,
        paddingBottom: 8,
    },
    listContainer: {
        paddingHorizontal: 8, // Adds space on the sides of the grid
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 8,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});