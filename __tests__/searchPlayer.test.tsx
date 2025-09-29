import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock expo-router. Create fns **inside** the factory.
jest.mock("expo-router", () => {
  return {
    router: {
      push: jest.fn(),
    },
  };
});

// Mock the background image so RN doesn’t try to load it.
jest.mock("../assets/images/diamond background.webp", () => ({}), {
  virtual: true,
});

// Import after mocks
import SearchPlayerScreen from "../app/(tabs)/searchPlayer";

describe("SearchPlayerScreen", () => {
  // Get a handle to the mocked router for assertions
  const { router } = require("expo-router") as {
    router: { push: jest.Mock };
  };

  beforeEach(() => {
    router.push.mockClear();
  });

  it("falls back to the placeholder tag when input is empty", () => {
    const { getByText } = render(<SearchPlayerScreen />);
    fireEvent.press(getByText(/View Profile/i));

    expect(router.push).toHaveBeenCalledTimes(1);
    const arg = router.push.mock.calls[0][0] as string;
    expect(decodeURIComponent(arg)).toContain("#CVVCU2JJ8"); // placeholder
  });

  it("adds # when user omits it", () => {
    const { getByPlaceholderText, getByText } = render(<SearchPlayerScreen />);
    fireEvent.changeText(getByPlaceholderText("#CVVCU2JJ8"), "ABC123");
    fireEvent.press(getByText(/View Profile/i));

    const arg = router.push.mock.calls[0][0] as string;
    expect(decodeURIComponent(arg)).toContain("#ABC123");
  });

  it("keeps # when user includes it", () => {
    const { getByPlaceholderText, getByText } = render(<SearchPlayerScreen />);
    fireEvent.changeText(getByPlaceholderText("#CVVCU2JJ8"), "#HELLO");
    fireEvent.press(getByText(/View Profile/i));

    const arg = router.push.mock.calls[0][0] as string;
    expect(decodeURIComponent(arg)).toContain("#HELLO");
  });
});

