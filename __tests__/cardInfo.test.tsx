import { getCardInfo } from '../db/cards'; // adjust path as needed
import { getDBConnection } from '../db/connection'; // adjust path as needed

// Mock the DB connection
jest.mock('../db/connection', () => ({
  getDBConnection: jest.fn(),
}));

describe('getCardInfo', () => {
  const mockGetFirstAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getDBConnection as jest.Mock).mockResolvedValue({
      getFirstAsync: mockGetFirstAsync,
    });
  });

  it('returns card info when card exists in DB', async () => {
    mockGetFirstAsync.mockResolvedValue({
      card_id: 1,
      name: 'Knight',
      rarity: 'Common',
      elixir_cost: 3,
      max_level: 14,
      max_evolution: 3,
      icon_url_medium: 'http://example.com/knight.png',
      icon_url_large: 'http://example.com/knight_evolution.png',
    });

    const card = await getCardInfo('Knight');

    expect(card).toEqual({
      id: 1,
      name: 'Knight',
      rarity: 'Common',
      elixirCost: 3,
      maxLevel: 14,
      maxEvolutionLevel: 3,
      iconUrls: {
        medium: 'http://example.com/knight.png',
        evolutionMedium: 'http://example.com/knight_evolution.png',
      },
    });
  });

  it('returns null when card does not exist', async () => {
    mockGetFirstAsync.mockResolvedValue(null);

    const card = await getCardInfo('Nonexistent Card');

    expect(card).toBeNull();
  });
});
