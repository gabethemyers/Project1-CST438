import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// This function will be our single point of access to the database
export async function getDBConnection() {
  // If the connection is already open, return it
  if (db) {
    return db;
  }

  try {
    // If not, open a new connection
    db = await SQLite.openDatabaseAsync("deckbuilder.db");

    // Create tables if they don't exist
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS api_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL
      );
    `);
    
    console.log('Database connection initialized successfully.');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}