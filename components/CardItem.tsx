import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Card } from '../db/cards';

type CardItemProps = {
    card: Card;
    renderAction?: () => React.ReactNode;
    size?: 'small' | 'medium';
};

export const CardItem = ({ card, renderAction, size = 'medium' }: CardItemProps) => {
    const styles = size === 'small' ? smallStyles : mediumStyles;

    return (
        <View style={styles.cardContainer}>
            <View style={styles.elixirContainer}>
                <Text style={styles.elixirCost}>{card.elixirCost}</Text>
            </View>
            <Image
                source={{ uri: card.iconUrls?.medium }}
                style={styles.cardImage}
            />
            <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
            {renderAction && renderAction()}
        </View>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const mediumStyles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        width: '100%', // Ensure the card takes up the full width of its wrapper
        aspectRatio: 0.75, // Maintain a consistent aspect ratio
        backgroundColor: '#1a237e',
        borderRadius: 12,
        margin: 4, // Reduce margin to avoid excessive spacing
        alignItems: 'center',
        padding: 12, // Adjust padding for better spacing
        position: 'relative',
        borderWidth: 1,
        borderColor: '#90caf9',
        justifyContent: 'space-between',
    },
    elixirContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#6a0dad',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    elixirCost: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cardImage: {
        width: '80%', // Scale image to fit within the container
        height: '60%', // Maintain proportional height
        resizeMode: 'contain',
        marginVertical: 8,
    },
    cardName: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 4,
        marginBottom: 8,
    },
});


const smallStyles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        borderRadius: 4,
        alignItems: 'center',
        padding: 4,
        position: 'relative',
        justifyContent: 'center',
    },
    elixirContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#6a0dad',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    elixirCost: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cardImage: {
        width: '100%',
        flex: 1,
        resizeMode: 'contain',
    },
    cardName: {
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
        marginTop: 2,
    },
});