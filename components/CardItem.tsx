import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Card } from '../db/cards';

type CardItemProps = {
    card: Card;
    renderAction?: () => React.ReactNode; // Render prop for action buttons
};

export const CardItem = ({ card, renderAction }: CardItemProps) => {
    return (
        <View style={styles.cardContainer}>
            <Image
                source={{ uri: card.iconUrls?.medium }}
                style={styles.cardImage}
            />
            <Text style={styles.cardName}>{card.name}</Text>
            {renderAction && renderAction()}
        </View>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const styles = StyleSheet.create({
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