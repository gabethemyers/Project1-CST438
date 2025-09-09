
import { createUser } from "@/db/auth";
import { getDBConnection } from "@/db/connection";
import bcrypt from "bcryptjs";

jest.mock("@/db/connection");
jest.mock("bcryptjs");

const mockedGetDB = getDBConnection as jest.Mock;
const mockedHash = bcrypt.hash as jest.Mock;

describe('createUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Main Test Case: Successful User Creation
    test("should has the password and insert a new user into the database", async () => {
        const username = 'newuser';
        const plainTextPassword = 'password123';
        const hashedPassword = 'a_very_secure_hash';
        const expectedUserId = 1;

        mockedHash.mockResolvedValue(hashedPassword);

        const mockDb = {
            runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: expectedUserId}),
        };
        mockedGetDB.mockResolvedValue(mockDb);

        const newUserId = await createUser(username, plainTextPassword);

        expect(newUserId).toBe(expectedUserId);

        expect(mockedHash).toHaveBeenCalledTimes(1);
        expect(mockedHash).toHaveBeenCalledWith(plainTextPassword, 10); // 10 is the salt rounds

        expect(mockDb.runAsync).toHaveBeenCalledTimes(1);
        expect(mockDb.runAsync).toHaveBeenCalledWith(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );
    });

    test('should throw an error if the database insert fails', async () => {
    const errorMessage = 'Database is locked';
    mockedHash.mockResolvedValue('any_hash');

    const mockDb = {
      runAsync: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    mockedGetDB.mockResolvedValue(mockDb);

    await expect(createUser('user', 'password')).rejects.toThrow(errorMessage);
  });
})
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
