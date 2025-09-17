import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

// This interface is created in order to store the api's response inside of an array of type Card
interface Card{
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


const CardsScreen = () => {

    // Enter your own api key inside of this apikey variable
    const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImJiOTU5ZWViLTQ2YzAtNGI3NS1iYjdkLTBkMTRiNzg2ZjIxNCIsImlhdCI6MTc1ODA1MTIzNiwic3ViIjoiZGV2ZWxvcGVyLzY5MzY3ODE2LTM2YjctYTMzYy0zNzY5LTE5NmMyNDcyYTc3MSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxOTguMTg5LjI0OS43MyIsIjE3NC44NS45OS4xNjkiXSwidHlwZSI6ImNsaWVudCJ9XX0.7J0lte_XOk25woxuxAzBqrylSQcBVr2cSz4pD1Wr4f1-qAUvU4qlBpTDeq1ZJ3ZdweAzlaLAQHVLpQUiGQ4CpA";
    
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
  
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Card Info:</Text>
            {/* This ScrollView iterates through all of the data that was retrieved by the API response
                and displays all the info and images associated with each card */}
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
        </View>
    )
}



export default CardsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
})