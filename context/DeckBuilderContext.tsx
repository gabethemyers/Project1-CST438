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
    updateActiveDeckName: (name: string) => void; // Add this function
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

    const updateActiveDeckName = (name: string) => {
        setActiveDeck(prev => {
            if (!prev) return null;
            return { ...prev, name: name };
        });
    };

    const saveDeck = async () => {
        if (!activeDeck) {
            console.log("SaveDeck: No active deck to save.");
            return;
        }
        console.log(`SaveDeck: Saving deck ${activeDeck.deck_id} with ${activeDeck.cards.length} cards.`);
        try {
            // Save both the name and the cards in parallel
            await Promise.all([
                deckService.updateDeckName(activeDeck.deck_id, activeDeck.name),
                deckService.updateDeckCards(activeDeck.deck_id, activeDeck.cards)
            ]);
            console.log(`SaveDeck: Successfully saved deck ${activeDeck.deck_id}.`);
        } catch (error) {
            console.error(`SaveDeck: Failed to save deck ${activeDeck.deck_id}.`, error);
        }
    };

    const clearActiveDeck = () => {
        setActiveDeck(null);
    };

    return (
        <DeckBuilderContext.Provider value={{ activeDeck, startBuildingDeck, addCard, removeCard, updateActiveDeckName, saveDeck, clearActiveDeck }}>
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