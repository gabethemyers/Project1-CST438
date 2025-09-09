import * as bcrypt from 'bcryptjs';
import { getDBConnection } from './connection';

import * as Random from "expo-random";
import { getDBConnection } from './connection';

bcrypt.setRandomFallback((len: number) => {
  const buf = Random.getRandomBytes(len);
  return Array.from(buf).map(x => x % 256);
});

interface User {
    id: number;
    username: string;
    password_hash: string;
}

const saltRounds = 10;

// creates a new user with a securely hashed password.
// returns the ID of the newly created user.
export async function createUser(username: string, plainTextPassword: string): Promise<number> {
    const db = await getDBConnection();
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    const result = await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]
    );
    return result.lastInsertRowId;
}

// finds a user by username and verifies their password.
// returns the user object if credentials are correct, otherwise null.
export async function verifyUser(username: string, plainTextPassword: string) {
    const db = await getDBConnection();
    const user = await db.getFirstAsync<User>("SELECT id, username, password as password_hash FROM users WHERE users.username = ?", [username]);

    if (!user) {
        return null; //User not found
    }

    //compare password with stored hash
    const isPasswordCorrect = await bcrypt.compare(plainTextPassword, user.password_hash);
    if (isPasswordCorrect) {
        const {password_hash, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }

    return null; // Password does not match

  const db = await getDBConnection();

  // (optional) prevent dup usernames if table isn’t UNIQUE
  const existing = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );
  if (existing) throw new Error("Username already taken");

  //  hashes password entered 
  const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);

  const result = await db.runAsync(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword]
  );
  return result.lastInsertRowId;
}

export async function verifyUser(username: string, plainTextPassword: string) {
  const db = await getDBConnection();
  const user = await db.getFirstAsync<{ id: number; username: string; password_hash: string }>(
    "SELECT id, username, password AS password_hash FROM users WHERE username = ?",
    [username]
  );
  if (!user) return null;

  // ✅ compare synchronously
  const ok = bcrypt.compareSync(plainTextPassword, user.password_hash);
  if (!ok) return null;

  const { password_hash, ...safeUser } = user;
  return safeUser;
}
