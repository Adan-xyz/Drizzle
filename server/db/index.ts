import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../shared/schema';

// Initialize SQLite database (using in-memory for this example)
// For persistent storage, use a file path like 'sqlite.db'
export const sqlite = new Database(':memory:');

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Prepare tables if they don't exist yet
export const prepareDb = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_important INTEGER NOT NULL DEFAULT 0,
      user_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

// Initialize database tables
prepareDb();

// Export for use in other files
export default db;
