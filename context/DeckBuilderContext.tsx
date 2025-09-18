import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Card } from '../db/cards';
import * as deckService from '../db/decks';
import { Deck } from '../db/decks';

interface DeckWithCards extends Deck {
    cards: Card[];
}

interface DeckBuilderContextType {
    activeDeck: DeckWithCards | null;
    startBuildingDeck: (deck: DeckWithCards) => void;
    addCard: (card: Card) => void;
    removeCard: (cardId: number) => void;
    saveDeck: () => Promise<void>;
    clearActiveDeck: () => void;
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(undefined);

export const DeckBuilderProvider = ({ children }: { children: ReactNode }) => {
    const [activeDeck, setActiveDeck] = useState<DeckWithCards | null>(null);

    const startBuildingDeck = (deck: DeckWithCards) => {
        setActiveDeck(deck);
    };

    const addCard = (card: Card) => {
        setActiveDeck(prev => {
            if (!prev) return null;
            // Prevent adding more than 8 cards or duplicate cards
            if (prev.cards.length >= 8 || prev.cards.find(c => c.id === card.id)) {
                return prev;
            }
            return { ...prev, cards: [...prev.cards, card] };
        });
    };

    const removeCard = (cardId: number) => {
        setActiveDeck(prev => {
            if (!prev) return null;
            return { ...prev, cards: prev.cards.filter(c => c.id !== cardId) };
        });
    };

    const saveDeck = async () => {
        if (!activeDeck) return;
        // This is a simplified save logic.
        // You would first clear all cards for the deck, then add the new ones.
        await deckService.deleteDeck(activeDeck.deck_id); // You might want a 'clearDeck' function instead
        await deckService.createDeck(activeDeck.user_id, activeDeck.name); // This is simplified

        // A more robust solution would be to calculate the difference and
        // only add/remove the cards that changed.
        for (const card of activeDeck.cards) {
            await deckService.addCardToDeck(activeDeck.deck_id, card.id);
        }
    };

    const clearActiveDeck = () => {
        setActiveDeck(null);
    };

    return (
        <DeckBuilderContext.Provider value={{ activeDeck, startBuildingDeck, addCard, removeCard, saveDeck, clearActiveDeck }}>
            {children}
        </DeckBuilderContext.Provider>
    );
};

export const useDeckBuilder = () => {
    const context = useContext(DeckBuilderContext);
    if (context === undefined) {
        throw new Error('useDeckBuilder must be used within a DeckBuilderProvider');
    }
    return context;
};