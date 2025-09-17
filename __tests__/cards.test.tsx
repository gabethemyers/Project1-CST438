import * as cardService from '../db/cards';
import { getDBConnection } from '../db/connection';

// Mock the dependencies
jest.mock('../db/connection');

// Mock the global fetch function
global.fetch = jest.fn();

const mockDb = {
    runAsync: jest.fn(),
};

const mockCards = [
    {
        id: 1,
        name: 'Knight',
        rarity: 'Common',
        elixirCost: 3,
        maxLevel: 14,
        maxEvolutionLevel: 1,
        iconUrls: {
            medium: 'knight-medium.png',
            evolutionMedium: 'knight-evo-medium.png',
        },
    },
    {
        id: 2,
        name: 'Archer',
        rarity: 'Common',
        elixirCost: 3,
        maxLevel: 14,
        maxEvolutionLevel: 1,
        iconUrls: {
            medium: 'archer-medium.png',
            evolutionMedium: 'archer-evo-medium.png',
        },
    },
];

describe('cacheCards', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        (getDBConnection as jest.Mock).mockResolvedValue(mockDb);
    });

    it('should fetch cards from the API and insert them into the database', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ items: mockCards }),
        });

        await cardService.cacheCards();

        expect(getDBConnection).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockDb.runAsync).toHaveBeenCalledTimes(mockCards.length);

        // Check the first card insertion
        expect(mockDb.runAsync).toHaveBeenCalledWith(
            `INSERT OR REPLACE INTO cards 
          (card_id, name, rarity, elixir_cost, max_level, max_evolution, icon_url_medium, icon_url_large)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mockCards[0].id,
                mockCards[0].name,
                mockCards[0].rarity,
                mockCards[0].elixirCost,
                mockCards[0].maxLevel,
                mockCards[0].maxEvolutionLevel,
                mockCards[0].iconUrls.medium,
                mockCards[0].iconUrls.evolutionMedium,
            ]
        );

        // Check the second card insertion
        expect(mockDb.runAsync).toHaveBeenCalledWith(
            `INSERT OR REPLACE INTO cards 
          (card_id, name, rarity, elixir_cost, max_level, max_evolution, icon_url_medium, icon_url_large)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mockCards[1].id,
                mockCards[1].name,
                mockCards[1].rarity,
                mockCards[1].elixirCost,
                mockCards[1].maxLevel,
                mockCards[1].maxEvolutionLevel,
                mockCards[1].iconUrls.medium,
                mockCards[1].iconUrls.evolutionMedium,
            ]
        );
    });

    it('should handle API failure gracefully', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        await expect(cardService.cacheCards()).rejects.toThrow("Failed to fetch cards");

        expect(getDBConnection).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockDb.runAsync).not.toHaveBeenCalled();
    });

    it('should handle cards with missing icon URLs', async () => {
        const cardsWithMissingUrls = [
            {
                id: 3,
                name: 'Goblin',
                rarity: 'Common',
                elixirCost: 2,
                maxLevel: 14,
                maxEvolutionLevel: 0,
                iconUrls: {}, // Missing medium and evolutionMedium
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ items: cardsWithMissingUrls }),
        });

        await cardService.cacheCards();

        expect(mockDb.runAsync).toHaveBeenCalledWith(
            `INSERT OR REPLACE INTO cards 
          (card_id, name, rarity, elixir_cost, max_level, max_evolution, icon_url_medium, icon_url_large)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cardsWithMissingUrls[0].id,
                cardsWithMissingUrls[0].name,
                cardsWithMissingUrls[0].rarity,
                cardsWithMissingUrls[0].elixirCost,
                cardsWithMissingUrls[0].maxLevel,
                cardsWithMissingUrls[0].maxEvolutionLevel,
                '', // Expect empty string for missing medium URL
                '', // Expect empty string for missing evolution medium URL
            ]
        );
    });
});
