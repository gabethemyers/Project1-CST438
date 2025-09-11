import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import LoginScreen from "../app/login";
import { verifyUser } from "../db/auth";

// ✅ Mock expo-router: Link + useRouter
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children || null,
  useRouter: () => ({ replace: mockReplace }),
}));

// ✅ Mock verifyUser so it doesn't hit SQLite
jest.mock("../db/auth", () => ({
  verifyUser: jest.fn(),
}));

// (Optional) silence Alerts in tests
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("LoginScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (verifyUser as jest.Mock).mockReset();
  });

  it("renders username, password inputs and login button", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("lets user type and navigates on successful login", async () => {
    (verifyUser as jest.Mock).mockResolvedValue({ id: 1, username: "alice" });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Username"), "alice");
    fireEvent.changeText(getByPlaceholderText("Password"), "secret123");
    fireEvent.press(getByText("Log In"));

    // ⬇️ wait for the async handler to finish and assert navigation
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/landingPage")
    );
  });

  it("shows error (no navigation) on invalid credentials", async () => {
    (verifyUser as jest.Mock).mockResolvedValue(null);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Username"), "alice");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrong");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
      // optionally assert an alert was shown:
      // expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
