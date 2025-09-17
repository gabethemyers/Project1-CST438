import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Use a mock variable name Jest allows inside the mock factory
const mockPush = jest.fn();

// Mock expo-router BEFORE requiring the component
jest.mock("expo-router", () => {
  const React = require("react");
  return {
    // hook-style router
    useRouter: () => ({ push: mockPush }),

    // singleton router (covers `import { router } from "expo-router"`)
    router: { push: mockPush },

    // stub Link so it doesn’t crash if used
    Link: ({ children }: any) =>
      typeof children === "function" ? children({}) : children ?? null,
  };
});

// Helper: one good response with a single player
function makePlayersOk() {
  const body = {
    items: [
      {
        tag: "#ABC123",
        name: "Pro One",
        rank: 1,
        trophies: 8000,
        clan: { name: "Legends" },
      },
    ],
  };
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify(body),
  } as Response;
}

// Helper: an error HTTP response
function makeHttpError() {
  return {
    ok: false,
    status: 403,
    statusText: "Forbidden",
    text: async () => JSON.stringify({ message: "nope" }),
  } as Response;
}

describe("TopPlayersScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue(makePlayersOk());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a player and navigates to player detail when tapped", async () => {
    // require AFTER mocks are set up
    const TopPlayersScreen = require("../app/(tabs)/topPlayers").default;

    const { findByText, getByText } = render(<TopPlayersScreen />);

    // Wait for player row
    const row = await findByText("Pro One");
    expect(row).toBeTruthy();

    // Tap the row (pressing the Text is fine here)
    fireEvent.press(getByText("Pro One"));

    // Should push to encoded path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/player/%23ABC123");
    });
  });

  it("shows error UI on HTTP failure", async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue(makeHttpError());

    const TopPlayersScreen = require("../app/(tabs)/topPlayers").default;
    const { findByText } = render(<TopPlayersScreen />);

    // Your screen shows "Error" heading when fetch fails
    expect(await findByText(/Error/i)).toBeTruthy();
  });
});



