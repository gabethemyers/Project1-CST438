// __tests__/verifyUser.test.tsx
import { verifyUser } from "@/db/auth";
import { getDBConnection } from "@/db/connection";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");
jest.mock("@/db/connection");

const mockedGetDB = getDBConnection as jest.Mock;
// ✅ mock the SYNC method now
const mockedCompareSync = bcrypt.compareSync as unknown as jest.Mock;

describe("verifyUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return the user object (without hash) for correct credentials", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      password_hash: "hashedpassword123",
    };

    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(mockUser),
    });
    mockedCompareSync.mockReturnValue(true); // ✅ sync mock

    const result = await verifyUser("testuser", "correctpassword");

    expect(result).toEqual({ id: 1, username: "testuser" });
    expect(mockedGetDB).toHaveBeenCalledTimes(1);
    expect(mockedCompareSync).toHaveBeenCalledWith(
      "correctpassword",
      "hashedpassword123"
    );
  });

  test("should return null if the password is incorrect", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      password_hash: "hashedpassword123",
    };

    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(mockUser),
    });
    mockedCompareSync.mockReturnValue(false); // ✅ sync mock

    const result = await verifyUser("testuser", "wrongpassword");

    expect(result).toBeNull();
    expect(mockedCompareSync).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedpassword123"
    );
  });

  test("should return null if the user is not found", async () => {
    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(null),
    });

    const result = await verifyUser("nouser", "any");

    expect(result).toBeNull();
    expect(mockedCompareSync).not.toHaveBeenCalled();
  });
});

