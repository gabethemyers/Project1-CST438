import { Card } from '../db/cards';
import { getDBConnection } from '../db/connection';
import * as deckService from '../db/decks';

// Mock the database connection
jest.mock('../db/connection');

const mockDb = {
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    // Mock the transaction to just execute the callback
    withTransactionAsync: jest.fn(async (callback) => await callback()),
};

// Cast the mock to the expected type to satisfy TypeScript
const mockedGetDBConnection = getDBConnection as jest.Mock;

describe('Deck Service', () => {

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        mockedGetDBConnection.mockResolvedValue(mockDb);
    });

    describe('createDeck', () => {
        it('should create a new deck and return its ID', async () => {
            const mockUserId = 1;
            const mockDeckName = 'My Awesome Deck';
            const mockInsertId = 5;
            mockDb.runAsync.mockResolvedValue({ lastInsertRowId: mockInsertId, changes: 1 });

            const deckId = await deckService.createDeck(mockUserId, mockDeckName);

            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO decks (user_id, name) VALUES (?,?)',
                [mockUserId, mockDeckName]
            );
            expect(deckId).toBe(mockInsertId);
        });
    });

    describe('addCardToDeck', () => {
        it('should add a card if the deck is not full', async () => {
            const mockDeckId = 5;
            const mockCardId = 101;
            // Simulate a deck with 7 cards
            mockDb.getFirstAsync.mockResolvedValue({ count: 7 });

            await deckService.addCardToDeck(mockDeckId, mockCardId);

            expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM deck_cards WHERE deck_id = ?',
                [mockDeckId]
            );
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO deck_cards (deck_id, card_id) VALUES (?, ?)',
                [mockDeckId, mockCardId]
            );
        });

        it('should throw an error if the deck is full', async () => {
            const mockDeckId = 5;
            const mockCardId = 101;
            // Simulate a deck with 8 cards
            mockDb.getFirstAsync.mockResolvedValue({ count: 8 });

            await expect(deckService.addCardToDeck(mockDeckId, mockCardId)).rejects.toThrow(
                'A deck cannot have more than 8 cards.'
            );

            expect(mockDb.runAsync).not.toHaveBeenCalled();
        });
    });

    describe('removeCardFromDeck', () => {
        it('should remove a card from a deck', async () => {
            const mockDeckId = 5;
            const mockCardId = 101;

            await deckService.removeCardFromDeck(mockDeckId, mockCardId);

            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'DELETE FROM deck_cards WHERE deck_id = ? AND card_id = ?',
                [mockDeckId, mockCardId]
            );
        });
    });

    describe('getUserDecks', () => {
        it('should return all decks for a user', async () => {
            const mockUserId = 1;
            const mockDecks: deckService.Deck[] = [
                { deck_id: 5, user_id: mockUserId, name: 'Deck 1' },
                { deck_id: 6, user_id: mockUserId, name: 'Deck 2' },
            ];
            mockDb.getAllAsync.mockResolvedValue(mockDecks);

            const decks = await deckService.getUserDecks(mockUserId);

            expect(mockDb.getAllAsync).toHaveBeenCalledWith(
                'SELECT * FROM decks WHERE user_id = ?',
                [mockUserId]
            );
            expect(decks).toEqual(mockDecks);
        });
    });

    describe('getDeckWithCards', () => {
        it('should return a deck with its associated cards', async () => {
            const mockDeckId = 5;
            const mockDeck: deckService.Deck = { deck_id: mockDeckId, user_id: 1, name: 'My Deck' };
            // Mock the raw data returned from the DB
            const mockRawCards = [
                { id: 101, name: 'Card 1', icon_url_medium: 'url1' /* ...other snake_case fields */ },
                { id: 102, name: 'Card 2', icon_url_medium: 'url2' /* ...other snake_case fields */ },
            ];
            // Mock the final, mapped card data
            const mockMappedCards: Card[] = [
                { id: 101, name: 'Card 1', iconUrls: { medium: 'url1' } } as Card,
                { id: 102, name: 'Card 2', iconUrls: { medium: 'url2' } } as Card,
            ];

            mockDb.getFirstAsync.mockResolvedValue(mockDeck);
            mockDb.getAllAsync.mockResolvedValue(mockRawCards);

            const result = await deckService.getDeckWithCards(mockDeckId);

            expect(mockDb.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM decks WHERE deck_id = ?', [mockDeckId]);
            // Update the expectation to match the new, more specific query
            expect(mockDb.getAllAsync).toHaveBeenCalledWith(
                expect.stringContaining('SELECT \n            c.card_id AS id'),
                [mockDeckId]
            );
            expect(result).toEqual({
                ...mockDeck,
                cards: mockMappedCards,
            });
        });

        it('should return null if the deck is not found', async () => {
            const mockDeckId = 999;
            mockDb.getFirstAsync.mockResolvedValue(null);

            const result = await deckService.getDeckWithCards(mockDeckId);

            expect(result).toBeNull();
            expect(mockDb.getAllAsync).not.toHaveBeenCalled();
        });
    });

    describe('deleteDeck', () => {
        it('should delete a deck and its card associations within a transaction', async () => {
            const mockDeckId = 5;

            await deckService.deleteDeck(mockDeckId);

            expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
            // Check that the correct delete operations were called
            expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM deck_cards WHERE deck_id = ?;', [mockDeckId]);
            expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM decks WHERE deck_id = ?;', [mockDeckId]);
        });
    });
});