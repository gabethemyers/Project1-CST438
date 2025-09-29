import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import LoginScreen from "../app/login";
import { AuthProvider } from "../context/AuthContext";

// --- Mocks ---
const mockReplace = jest.fn();

jest.mock("expo-router", () => {
  const { Text } = require("react-native");
  return {
    __esModule: true,
    useRouter: () => ({ replace: mockReplace }),
    Link: (props: { href: string; children: React.ReactNode }) => (
      <Text {...props}>{props.children}</Text>
    ),
  };
});

jest.mock("react-native/Libraries/Alert/Alert");

jest.mock("../db/auth", () => ({
  verifyUser: jest.fn(),
}));
const mockVerifyUser = require("../db/auth").verifyUser;

// --- Helpers ---
const renderWithProvider = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

// Prefer the real button label if present (“Enter the Arena”), otherwise
// fall back to an exact “Log In” match (to avoid picking the header “Log In”)
function getLoginButton(utils: ReturnType<typeof renderWithProvider>) {
  const { queryByText, getByText } = utils;
  return (
    queryByText(/Enter the Arena/i) ||
    // exact match to avoid catching header "Log In"
    getByText(/^Log In$/i)
  );
}

describe("LoginScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    mockVerifyUser.mockClear();
  });

  it("renders username, password inputs and the login action", () => {
    const utils = renderWithProvider(<LoginScreen />);
    const { getByPlaceholderText } = utils;

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getLoginButton(utils)).toBeTruthy();
  });

  it("lets user type and navigates on successful login", async () => {
    mockVerifyUser.mockResolvedValue({ id: 1, username: "testuser" });
    const utils = renderWithProvider(<LoginScreen />);
    const { getByPlaceholderText } = utils;

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getLoginButton(utils));

    await act(async () => {});
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/landingPage");
    });
  });

  it("shows error (no navigation) on invalid credentials", async () => {
    mockVerifyUser.mockResolvedValue(null);
    const utils = renderWithProvider(<LoginScreen />);
    const { getByPlaceholderText } = utils;

    fireEvent.changeText(getByPlaceholderText("Username"), "wronguser");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getLoginButton(utils));

    await act(async () => {});
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});