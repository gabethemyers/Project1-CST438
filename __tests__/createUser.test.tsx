// createUser.test.ts
import { createUser } from "@/db/auth";
import { getDBConnection } from "@/db/connection";
import bcrypt from "bcryptjs";

jest.mock("@/db/connection");
jest.mock("bcryptjs");

const mockedGetDB = getDBConnection as jest.Mock;
const mockedHashSync = bcrypt.hashSync as unknown as jest.Mock;

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hashes password and inserts a new user", async () => {
    const username = 'newuser';
    const plain = 'password123';
    const hash = 'secure_hash';
    const expectedId = 1;

    mockedHashSync.mockReturnValue(hash);

    const mockDb = {
      // if you added a duplicate check, return null (no existing user)
      getFirstAsync: jest.fn().mockResolvedValue(null),
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: expectedId }),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    const newUserId = await createUser(username, plain);

    expect(newUserId).toBe(expectedId);
    expect(mockedHashSync).toHaveBeenCalledWith(plain, 10);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash]
    );
  });

  test('throws when DB insert fails', async () => {
    mockedHashSync.mockReturnValue('hash');
    const mockDb = {
      getFirstAsync: jest.fn().mockResolvedValue(null),
      runAsync: jest.fn().mockRejectedValue(new Error('Database is locked')),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    await expect(createUser('user', 'password')).rejects.toThrow('Database is locked');
  });

  test('throws "Username already taken" when duplicate found (if you added the check)', async () => {
    mockedHashSync.mockReturnValue('hash');
    const mockDb = {
      getFirstAsync: jest.fn().mockResolvedValue({ id: 42 }), // existing user
      runAsync: jest.fn(),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    await expect(createUser('user', 'password')).rejects.toThrow(/taken/i);
    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });
});
