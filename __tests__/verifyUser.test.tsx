// verifyUser.test.ts
import { verifyUser } from '@/db/auth';
import { getDBConnection } from '@/db/connection';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');
jest.mock('@/db/connection');

const mockedGetDB = getDBConnection as jest.Mock;
// mock the SYNC method now
const mockedCompareSync = bcrypt.compareSync as unknown as jest.Mock;

describe('verifyUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns user (without hash) for correct credentials', async () => {
    const mockUser = { id: 1, username: 'testuser', password_hash: 'hashed' };

    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(mockUser),
    });
    mockedCompareSync.mockReturnValue(true);

    const result = await verifyUser('testuser', 'correctpassword');

    expect(result).toEqual({ id: 1, username: 'testuser' });
    expect(mockedCompareSync).toHaveBeenCalledWith('correctpassword', 'hashed');
  });

  test('returns null for incorrect password', async () => {
    const mockUser = { id: 1, username: 'testuser', password_hash: 'hashed' };
    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(mockUser),
    });
    mockedCompareSync.mockReturnValue(false);

    const result = await verifyUser('testuser', 'wrongpassword');

    expect(result).toBeNull();
    expect(mockedCompareSync).toHaveBeenCalledWith('wrongpassword', 'hashed');
  });

  test('returns null when user not found', async () => {
    mockedGetDB.mockResolvedValue({
      getFirstAsync: jest.fn().mockResolvedValue(null),
    });

    const result = await verifyUser('nouser', 'any');

    expect(result).toBeNull();
    expect(mockedCompareSync).not.toHaveBeenCalled();
  });
});
