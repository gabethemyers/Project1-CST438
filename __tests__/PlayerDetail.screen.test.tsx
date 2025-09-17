import { render } from "@testing-library/react-native";
import React from "react";
import { Image } from "react-native";

// Mock expo-router:
// - provide a tag param
// - stub Stack.Screen so it doesn't crash in tests
jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    useLocalSearchParams: () => ({ tag: "%23ABC123" }), // "#ABC123" URL-encoded
    Stack: {
      Screen: (props: any) => <View {...props} />,
    },
  };
});

// Minimal player payload your component expects
const mockPlayer = {
  tag: "#ABC123",
  name: "Pro One",
  trophies: 8000,
  clan: { name: "Legends" },
  currentDeck: [
    {
      id: 26000021,
      name: "Hog Rider",
      iconUrls: {
        medium:
          "https://api-assets.clashroyale.com/cards/300/Ubu0oUl8tZkusnkZf8Xv9Vno5IO29Y-jbZ4fhoNJ5oc.png",
      },
    },
    {
      id: 28000000,
      name: "Fireball",
      iconUrls: {
        medium:
          "https://api-assets.clashroyale.com/cards/300/lZD9MILQv7O-P3XBr_xOLS5idwuz3_7Ws9G60U36yhc.png",
      },
    },
  ],
};

function makePlayerOk() {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify(mockPlayer),
  } as Response;
}

function makeHttpError() {
  return {
    ok: false,
    status: 404,
    statusText: "Not Found",
    text: async () => JSON.stringify({ message: "not found" }),
  } as Response;
}

describe("PlayerDetail", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue(makePlayerOk());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loads and displays player profile + deck images", async () => {
    const PlayerScreen = require("../app/player/[tag]").default;
    const { findByText, UNSAFE_getAllByType } = render(<PlayerScreen />);

    // Wait for name to appear
    expect(await findByText("Pro One")).toBeTruthy();

    // Deck section title exists
    expect(await findByText(/Current Deck/i)).toBeTruthy();

    // Count <Image/> components directly (no need for testID changes)
    const images = UNSAFE_getAllByType(Image);
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it("shows error UI on HTTP failure", async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue(makeHttpError());

    const PlayerScreen = require("../app/player/[tag]").default;
    const { findByText } = render(<PlayerScreen />);

    // Your screen text is "Failed to load player" (not "Error")
    expect(await findByText(/Failed to load player/i)).toBeTruthy();
  });
});


