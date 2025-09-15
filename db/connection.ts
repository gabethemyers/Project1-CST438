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
      CREATE TABLE IF NOT EXISTS decks (
        deck_id INTEGER PRIMARY KEY NOT NULL,
        user_id INTEGER,
        name TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
      CREATE TABLE IF NOT EXISTS cards (
        card_id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        rarity TEXT,
        elixir_cost INTEGER,
        max_level INTEGER,
        max_evolution INTEGER,
        icon_url_medium TEXT,
        icon_url_large TEXT
      );
      CREATE TABLE IF NOT EXISTS deck_cards (
        deck_id INTEGER,
        card_id INTEGER,
        slot_number INTEGER,
        PRIMARY KEY (deck_id, slot_number),
        FOREIGN KEY (deck_id) REFERENCES decks(deck_id),
        FOREIGN KEY (card_id) REFERENCES cards(card_id)
      );
    `);
    
    console.log('Database connection initialized successfully.');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}