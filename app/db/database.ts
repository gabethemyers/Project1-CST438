import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('deckbuilder.db');

export async function initDB() {
  try {
    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);
    
    // Create api_data table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS api_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { db };