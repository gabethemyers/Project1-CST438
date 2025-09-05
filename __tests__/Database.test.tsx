// verifyUser.test.ts

import bcrypt from 'bcryptjs';
import { getDBConnection} from '@/db/connection';
import { verifyUser } from '@/db/auth';

// --- Mocks Setup ---
jest.mock('bcryptjs');
jest.mock('@/db/connection');

const mockedGetDB = getDBConnection as jest.Mock;
const mockedBcryptCompare = bcrypt.compare as jest.Mock;


describe('verifyUser', () => {

    // Reset mocks before each test to ensure they don't interfere with each other
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Successful Login
    test('should return the user object (without hash) for correct credentials', async () => {
        // Arrange: Set up the conditions for the test
        const mockUser = {
            id: 1,
            username: 'testuser',
            password_hash: 'hashedpassword123',
        };

        // Fake the database call to "find" our mock user
        mockedGetDB.mockResolvedValue({
            getFirstAsync: jest.fn().mockResolvedValue(mockUser),
        });

        // Fake bcrypt.compare to return true (password matches)
        mockedBcryptCompare.mockResolvedValue(true);

        // Act: Call the function we are testing
        const result = await verifyUser('testuser', 'correctpassword');

        // Assert: Check if the outcome is what we expect
        expect(result).toEqual({ id: 1, username: 'testuser' });
        expect(mockedGetDB).toHaveBeenCalledTimes(1);
        expect(mockedBcryptCompare).toHaveBeenCalledWith('correctpassword', 'hashedpassword123');
    });


    // Test Case 2: Incorrect Password
    test('should return null if the password is incorrect', async () => {
        // Arrange
        const mockUser = {
            id: 1,
            username: 'testuser',
            password_hash: 'hashedpassword123',
        };
        mockedGetDB.mockResolvedValue({
            getFirstAsync: jest.fn().mockResolvedValue(mockUser),
        });

        // Fake bcrypt.compare to return false (password does not match)
        mockedBcryptCompare.mockResolvedValue(false);

        // Act
        const result = await verifyUser('testuser', 'wrongpassword');

        // Assert
        expect(result).toBeNull();
        expect(mockedBcryptCompare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
    });


    // Test Case 3: User Not Found
    test('should return null if the user is not found', async () => {
        // Arrange: Fake the database call to return nothing
        mockedGetDB.mockResolvedValue({
            getFirstAsync: jest.fn().mockResolvedValue(null),
        });

        // Act
        const result = await verifyUser('nonexistentuser', 'anypassword');

        // Assert
        expect(result).toBeNull();
        // Crucially, ensure we never tried to compare passwords if no user was found
        expect(mockedBcryptCompare).not.toHaveBeenCalled();
    });
});