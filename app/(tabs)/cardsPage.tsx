import { View, Text, StyleSheet, TextInput, Button, Image, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';




// This interface is created in order to store the api's response inside of an array of type Card
export interface Card{
    name: string;
    id: number;
    elixirCost: number;
    rarity: string;
    maxLevel: number;
    maxEvolutionLevel: number;
    iconUrls?: {
        medium?: string;
        evolutionMedium?: string;
    };
}

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

    // Enter your own api key inside of this apikey variable

    const apiKey = "Enter Api Key Here";

    
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

    const displayedCards = data.filter(card => {
        const rarityMatch = rarityFilter ? card.rarity.toLowerCase() === rarityFilter : true;
        const elixirMatch = elixirFilter ? card.elixirCost === elixirFilter : true;
        return rarityMatch && elixirMatch;
    });


  
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Card Info:</Text>
            <View style={styles.container}>
                <Button title="Reset Filters" onPress={() => {
                        setRarityFilter(null);
                        setElixirFilter(null);
                    }
                } />
        
                
                <Dropdown
                    style={[styles.dropdown, { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={rarities}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Rarity"
                    value={rarityFilter}
                    onChange={item => setRarityFilter(item.value)}
                    renderLeftIcon={() => (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name="filter"
                        size={20}
                        />
                )}
                />

                <Dropdown
                    style={[styles.dropdown, { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={elixirs}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Elixir Cost"
                    value={elixirFilter}
                    onChange={item => setElixirFilter(item.value)}
                    renderLeftIcon={() => (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name="filter"
                        size={20}
                        />
                )}
                />

            </View>
            {/* This ScrollView iterates through all of the data that was retrieved by the API response
                and displays all the info and images associated with each card */}

            {/* Show either all or filtered cards */}
            <ScrollView>
                {displayedCards.map(card => (
                <View key={card.id} style={{ marginBottom: 8 }}>
                    <Text>Name: {card.name}</Text>
                    <Text>Elixir Cost: {card.elixirCost}</Text>
                    <Text>Rarity: {card.rarity}</Text>
                    <Text>Max Level: {card.maxLevel}</Text>
                    <Text>Max Evolution Level: {card.maxEvolutionLevel}</Text>
                    {card.iconUrls?.medium && (
                    <Image
                        source={{ uri: card.iconUrls.medium }}
                        style={{ width: 80, height: 80, marginVertical: 8 }}
                    />
                    )}
                </View>
                ))}
            </ScrollView>
            {/*
            <ScrollView>    
                {data.map((card) => (
                <View key={card.id} style={{ marginBottom: 8 }}>
                    <Text>Name: {card.name}</Text>
                    <Text>Elixir Cost: {card.elixirCost}</Text>
                    <Text>Rarity: {card.rarity}</Text>
                    <Text>Max Level: {card.maxLevel}</Text>
                    <Text>Max Evolution Level: {card.maxEvolutionLevel}</Text>
                    {card.iconUrls?.medium && (
                    <Image 
                        source={{ uri: card.iconUrls.medium }}
                        style={{ width: 80, height: 80, marginVertical: 8 }}
                    />
                    )}
                </View>
                ))
            }
            </ScrollView>
            */}

        </View>
    )
}



export default CardsScreen

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200,

    }
});
