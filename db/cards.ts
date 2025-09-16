import { getDBConnection } from "./connection";

const API_URL = "https://api.clashroyale.com/v1/cards";
const API_KEY = process.env.EXPO_PUBLIC_CLASH_ROYALE_API_KEY; // store securely, don’t hardcode in production

export const fetchCardsFromAPI = async (): Promise<Card[]> => {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch cards");

    const data = await response.json();
    return data.items; // array of cards
};

export interface Card {
    name: string;
    id: number;
    elixirCost: number;
    rarity: string;
    maxLevel: number;
    maxEvolutionLevel: number;
    iconUrls?: {
        medium?: string;
        evolutionMedium?: string;
    };
}

export const cacheCards = async () => {
    const db = await getDBConnection();

    const cards: Card[] = await fetchCardsFromAPI();

    const insertPromises = cards.map((card) => {
        return db.runAsync(`INSERT OR REPLACE INTO cards 
          (card_id, name, rarity, elixir_cost, max_level, max_evolution, icon_url_medium, icon_url_large)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                card.id,
                card.name,
                card.rarity,
                card.elixirCost,
                card.maxLevel,
                card.maxEvolutionLevel,
                card.iconUrls?.medium ?? "",
                card.iconUrls?.evolutionMedium ?? "",
            ]);
    });

    await Promise.all(insertPromises);
}