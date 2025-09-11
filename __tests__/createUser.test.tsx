// __tests__/createUser.test.tsx
import { createUser } from "@/db/auth";
import { getDBConnection } from "@/db/connection";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("@/db/connection");
jest.mock("bcryptjs");

const mockedGetDB = getDBConnection as jest.Mock;
const mockedHashSync = bcrypt.hashSync as unknown as jest.Mock;

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hashes password and inserts a new user into the database", async () => {
    const username = "newuser";
    const plainTextPassword = "password123";
    const hashedPassword = "a_secure_hash";
    const expectedUserId = 1;

    mockedHashSync.mockReturnValue(hashedPassword);

    const mockDb = {
      getFirstAsync: jest.fn().mockResolvedValue(null), // no duplicate
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: expectedUserId }),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    const newUserId = await createUser(username, plainTextPassword);

    expect(newUserId).toBe(expectedUserId);
    expect(mockedHashSync).toHaveBeenCalledWith(plainTextPassword, 10);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
  });

  it("throws an error if the database insert fails", async () => {
    mockedHashSync.mockReturnValue("any_hash");

    const mockDb = {
      getFirstAsync: jest.fn().mockResolvedValue(null), // no duplicate
      runAsync: jest.fn().mockRejectedValue(new Error("Database is locked")),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    await expect(createUser("user", "password")).rejects.toThrow("Database is locked");
  });

  it("throws 'Username already taken' when duplicate is found", async () => {
    mockedHashSync.mockReturnValue("any_hash");

    const mockDb = {
      getFirstAsync: jest.fn().mockResolvedValue({ id: 42 }), // simulate existing user
      runAsync: jest.fn(),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    await expect(createUser("user", "password")).rejects.toThrow(/taken/i);
    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });
});

