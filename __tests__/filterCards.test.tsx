import { Card } from '@/app/(tabs)/cardsPage';

const mockCards: Card[] = [
  { id: 1, name: "Knight", elixirCost: 3, rarity: "Common", maxLevel: 13, maxEvolutionLevel: 0 },
  { id: 2, name: "Baby Dragon", elixirCost: 4, rarity: "Epic", maxLevel: 11, maxEvolutionLevel: 0 },
  { id: 3, name: "Fireball", elixirCost: 4, rarity: "Rare", maxLevel: 11, maxEvolutionLevel: 0 },
  { id: 4, name: "Log", elixirCost: 2, rarity: "Legendary", maxLevel: 6, maxEvolutionLevel: 0 },
];

function filterCards(cards: Card[], rarityFilter: string | null, elixirFilter: number | null): Card[] {
  return cards.filter(card => {
    const rarityMatch = rarityFilter ? card.rarity.toLowerCase() === rarityFilter : true;
    const elixirMatch = elixirFilter ? card.elixirCost === elixirFilter : true;
    return rarityMatch && elixirMatch;
  });
}

describe("CardsScreen filtering logic", () => {
  test("returns all cards when no filters applied", () => {
    expect(filterCards(mockCards, null, null)).toHaveLength(4);
  });

  test("filters by rarity only", () => {
    const result = filterCards(mockCards, "epic", null);
    expect(result.map(c => c.name)).toEqual(["Baby Dragon"]);
  });

  test("filters by elixir only", () => {
    const result = filterCards(mockCards, null, 4);
    expect(result.map(c => c.name)).toEqual(["Baby Dragon", "Fireball"]);
  });

  test("filters by rarity and elixir", () => {
    const result = filterCards(mockCards, "rare", 4);
    expect(result.map(c => c.name)).toEqual(["Fireball"]);
  });

  test("returns empty array if no match", () => {
    expect(filterCards(mockCards, "legendary", 9)).toHaveLength(0);
  });

  test("rarity filter is case-insensitive", () => {
    const result = filterCards(mockCards, "legendary", 2);
    expect(result.map(c => c.name)).toEqual(["Log"]);
  });
});
