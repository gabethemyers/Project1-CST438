import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock expo-router correctly
jest.mock("expo-router", () => {
  return {
    router: {
      push: jest.fn(),
    },
  };
});

// Mock LinearGradient to a View
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { LinearGradient: (props: any) => <View {...props} /> };
});

// Mock assets
jest.mock("../assets/images/diamond background.webp", () => ({}), {
  virtual: true,
});
jest.mock("../assets/images/arena8.png", () => ({}), { virtual: true });
jest.mock("../assets/images/arena_spooky.png", () => ({}), { virtual: true });
jest.mock("../assets/images/arena_mine.png", () => ({}), { virtual: true });

import LandingPage from "../app/(tabs)/landingPage";

describe("LandingPage", () => {
  const { router } = require("expo-router") as {
    router: { push: jest.Mock };
  };

  beforeEach(() => {
    router.push.mockClear();
  });

  it("navigates when tapping Arena 8 label", () => {
    const { getByText } = render(<LandingPage />);
    fireEvent.press(getByText(/Arena 8/i));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/ArenaDecks",
      params: { arena: "arena8" },
    });
  });

  it("navigates when tapping Arena 12 label", () => {
    const { getByText } = render(<LandingPage />);
    fireEvent.press(getByText(/Arena 12/i));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/ArenaDecks",
      params: { arena: "arena12" },
    });
  });

  it("navigates when tapping Arena 15 label", () => {
    const { getByText } = render(<LandingPage />);
    fireEvent.press(getByText(/Arena 15/i));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/ArenaDecks",
      params: { arena: "arena15" },
    });
  });
});

