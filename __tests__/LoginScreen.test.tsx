import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../app/login"; // adjust if your file lives in (tabs)/login

// Mock expo-router's Link to avoid navigation errors in tests
jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children || null,
}));

describe("LoginScreen", () => {
  it("renders username, password inputs and login button", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("lets user type and press login button", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "alice");
    fireEvent.changeText(getByPlaceholderText("Password"), "secret123");

    fireEvent.press(getByText("Log In"));
    expect(logSpy).toHaveBeenCalledWith("Logging in...");

    logSpy.mockRestore();
  });
});
