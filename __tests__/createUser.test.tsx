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