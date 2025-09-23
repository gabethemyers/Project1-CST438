import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
// Import Alert directly to make mocking and referencing easier
import { Alert } from "react-native";
import LoginScreen from "../app/login";
import { AuthProvider } from "../context/AuthContext";

// --- START: Updated Mocking Setup ---

const mockReplace = jest.fn();

// This mock for expo-router is more robust.
// It explicitly handles ES module interoperability and simplifies the Link mock.
jest.mock('expo-router', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockReplace,
  }),
  // A simplified, stable mock for the Link component.
  Link: (props: { href: string; children: React.ReactNode }) => {
    const MockText = require('react-native').Text;
    return <MockText {...props}>{props.children}</MockText>;
  },
}));

// Mock the Alert module. This is simpler than mocking the full path.
jest.mock("react-native/Libraries/Alert/Alert");

// Mock the auth service used by the context
jest.mock("../db/auth", () => ({
  verifyUser: jest.fn(),
}));
const mockVerifyUser = require("../db/auth").verifyUser;

// --- END: Updated Mocking Setup ---


describe("LoginScreen", () => {
  beforeEach(() => {
    // Clear mock history before each test using consistent and clear methods
    mockReplace.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    mockVerifyUser.mockClear(); // Also good practice to clear this mock's history
  });

  // Helper function to render with the provider
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it("renders username, password inputs and login button", () => {
    const { getByPlaceholderText, getByText } = renderWithProvider(<LoginScreen />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("lets user type and navigates on successful login", async () => {
    mockVerifyUser.mockResolvedValue({ id: 1, username: "testuser" });
    const { getByPlaceholderText, getByText } = renderWithProvider(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Log In"));

    // Force promises to resolve before the assertion
    await act(async () => {});

    // Now, the expectation should be met
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/landingPage");
    });
});

it("shows error (no navigation) on invalid credentials", async () => {
    mockVerifyUser.mockResolvedValue(null); // Simulate failed login
    const { getByPlaceholderText, getByText } = renderWithProvider(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "wronguser");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Log In"));

    // Force promises to resolve before the assertion
    await act(async () => {});

    // Now, the expectation should be met
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
});

  it("shows error (no navigation) on invalid credentials", async () => {
    mockVerifyUser.mockResolvedValue(null); // Simulate failed login
    const { getByPlaceholderText, getByText } = renderWithProvider(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "wronguser");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      // Reference the mocked Alert module directly
      expect(Alert.alert).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});