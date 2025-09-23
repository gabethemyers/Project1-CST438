import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

// Mock the global fetch function
global.fetch = jest.fn();

// Mock the router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockPlayers = [
  { tag: "#123", name: "Player One", rank: 1, trophies: 5000 },
  { tag: "#456", name: "Player Two", rank: 2, trophies: 4900 },
];

describe("TopPlayersScreen", () => {
  beforeEach(() => {
    // Clear mocks before each test
    (fetch as jest.Mock).mockClear();
    (router.push as jest.Mock).mockClear();
  });

  it("renders a loading indicator initially", () => {
    // This test is fine, but we need to provide a pending promise for fetch
    (fetch as jest.Mock).mockReturnValue(new Promise(() => { }));
    const TopPlayersScreen = require("../app/(tabs)/topPlayers").default;
    const { getByText } = render(<TopPlayersScreen />);
    // Use the correct ellipsis character
    expect(getByText("Loading…")).toBeTruthy();
  });

  it("renders a list of players after fetching", async () => {
    // Provide a complete mock response object
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: mockPlayers }),
      text: () => Promise.resolve(JSON.stringify({ items: mockPlayers })),
    });
    // require AFTER mocks are set up
    const TopPlayersScreen = require("../app/(tabs)/topPlayers").default;
    const { findByText } = render(<TopPlayersScreen />);

    expect(await findByText("Player One")).toBeTruthy();
    expect(await findByText("Player Two")).toBeTruthy();
  });

  it("renders a player and navigates to player detail when tapped", async () => {
    // Provide a complete mock response object
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: mockPlayers }),
      text: () => Promise.resolve(JSON.stringify({ items: mockPlayers })),
    });
    // require AFTER mocks are set up
    const TopPlayersScreen = require("../app/(tabs)/topPlayers").default;
    const { findByText } = render(<TopPlayersScreen />);

    const playerOne = await findByText("Player One");
    fireEvent.press(playerOne);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/player/%23123");
    });
  });
});



