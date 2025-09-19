import { Card } from "./cards";
import { getDBConnection } from "./connection";

export interface Deck {
    deck_id: number;
    user_id: number;
    name: string;
}

// creates a new deck for a user. returns the id of the new deck
export const createDeck = async (userId: number, deckName: string): Promise<number | undefined> => {
    const db = await getDBConnection();
    const result = await db.runAsync('INSERT INTO decks (user_id, name) VALUES (?,?)', [userId, deckName]);
    return result.lastInsertRowId;
}

// adds a card to a deck. throws an error if deck is full
export const addCardToDeck = async (deckId: number, cardId: number) => {
    const db = await getDBConnection();

    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM deck_cards WHERE deck_id = ?',
        [deckId]
    );

    // Check if the deck is full (has 8 or more cards).
    if (result && result.count >= 8) {
        throw new Error('A deck cannot have more than 8 cards.');
    }

    // If the deck is not full, proceed with inserting the new card.
    await db.runAsync('INSERT INTO deck_cards (deck_id, card_id) VALUES (?, ?)', [deckId, cardId]);
};

export const removeCardFromDeck = async (deckId: number, cardId: number) => {
    const db = await getDBConnection();
    await db.runAsync('DELETE FROM deck_cards WHERE deck_id = ? AND card_id = ?', [deckId, cardId]);
};

export const getUserDecks = async (userId: number): Promise<Deck[]> => {
    const db = await getDBConnection();
    const decks = await db.getAllAsync<Deck>('SELECT * FROM decks WHERE user_id = ?', [userId]);
    return decks;
};

export interface DeckWithCards extends Deck {
    cards: Card[];
}

// Fetches a single deck and all of its associated cards.
export const getDeckWithCards = async (deckId: number): Promise<DeckWithCards | null> => {
    const db = await getDBConnection();
    const deck = await db.getFirstAsync<Deck>('SELECT * FROM decks WHERE deck_id = ?', [deckId]);

    // If no deck is found, return null
    if (!deck) {
        return null;
    }

    // Fetch the raw card data from the database, aliasing snake_case columns to camelCase
    const rawCards = await db.getAllAsync<any>(`
        SELECT 
            c.card_id AS id,
            c.name,
            c.rarity,
            c.elixir_cost AS elixirCost,
            c.max_level AS maxLevel,
            c.max_evolution AS maxEvolutionLevel,
            c.icon_url_medium,
            c.icon_url_large 
        FROM cards c
        JOIN deck_cards dc ON c.card_id = dc.card_id
        WHERE dc.deck_id = ?
    `, [deckId]);

    // Manually map the raw data to the Card interface, creating the nested iconUrls object
    const cards: Card[] = rawCards.map(card => ({
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        elixirCost: card.elixirCost,
        maxLevel: card.maxLevel,
        maxEvolutionLevel: card.maxEvolutionLevel,
        iconUrls: {
            medium: card.icon_url_medium,
            evolutionMedium: card.icon_url_large, // Assuming icon_url_large is the evolution icon
        },
    }));

    return {
        ...deck,
        cards: cards,
    };
};

/**
 * Updates the name of a specific deck.
 */
export const updateDeckName = async (deckId: number, newName: string) => {
    const db = await getDBConnection();
    await db.runAsync('UPDATE decks SET name = ? WHERE deck_id = ?', [newName, deckId]);
};

export const updateDeckCards = async (deckId: number, cards: Card[]) => {
    const db = await getDBConnection();
    await db.withTransactionAsync(async () => {
        // Clear all existing cards for the deck
        await db.runAsync('DELETE FROM deck_cards WHERE deck_id = ?', [deckId]);
        // Insert the new set of cards
        const insertPromises = cards.map(card =>
            db.runAsync('INSERT INTO deck_cards (deck_id, card_id) VALUES (?, ?)', [deckId, card.id])
        );
        await Promise.all(insertPromises);
    });
};

export const deleteDeck = async (deckId: number) => {
    const db = await getDBConnection();
    await db.withTransactionAsync(async () => {
        // These run sequentially inside the transaction.
        await db.runAsync('DELETE FROM deck_cards WHERE deck_id = ?;', [deckId]);
        await db.runAsync('DELETE FROM decks WHERE deck_id = ?;', [deckId]);
    });
};