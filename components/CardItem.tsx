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
const smallCardWidth = width / 4 - 16;

const mediumStyles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 8,
        alignItems: 'center',
        padding: 12,
        position: 'relative',
    },
    elixirContainer: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: '#6a0dad',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    elixirCost: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    cardName: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
});

const smallStyles = StyleSheet.create({
    cardContainer: {
        width: smallCardWidth,
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        margin: 4,
        alignItems: 'center',
        padding: 6,
        position: 'relative',
    },
    elixirContainer: {
        position: 'absolute',
        top: 2,
        left: 2,
        backgroundColor: '#6a0dad',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    elixirCost: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardImage: {
        width: '100%',
        height: 80,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    cardName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
});