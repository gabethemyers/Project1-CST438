import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CardsScreen from "../app/(tabs)/cardsPage"; 

// Mock fetch globally
global.fetch = jest.fn();

describe("CardsScreen API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches cards and checks the first object", async () => {
    // Mock API response
    const mockResponse = {
      items: [
        {
          name: "Knight",
          id: 26000000,
          elixirCost: 3,
          rarity: "Common",
          maxLevel: 14,
          maxEvolutionLevel: 1,
          iconUrls: {
            medium: "https://example.com/knight.png",
          },
        },
        {
          name: "Archers",
          id: 26000001,
          elixirCost: 3,
          rarity: "Common",
          maxLevel: 14,
          maxEvolutionLevel: 1,
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Render component
    const { findByText } = render(<CardsScreen />);

    // Wait until data is set
    expect(fetch).toHaveBeenCalledWith(
      "https://api.clashroyale.com/v1/cards",
      expect.any(Object)
    );

    // Assert the first object
    const firstItem = mockResponse.items[0];
    expect(firstItem.name).toBe("Knight");
    expect(firstItem.elixirCost).toBe(3);
    expect(firstItem.rarity).toBe("Common");
  });
});
