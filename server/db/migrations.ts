import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './index';

// This will run migrations on the database, creating required tables
export async function runMigrations() {
  console.log('Running migrations...');
  
  // For a real application with migrations files:
  // await migrate(db, { migrationsFolder: './drizzle' });
  
  // For this example, we'll directly create the tables
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
  
  console.log('Migrations completed!');
}

// Example of seed data function for development
export async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      // Insert sample users
      await db.insert(users).values([
        { username: 'johndoe', password: 'password123' },
        { username: 'janedoe', password: 'password456' }
      ]);
      
      // Get the inserted users to use their IDs
      const allUsers = await db.select().from(users);
      
      // Insert sample notes
      if (allUsers.length > 0) {
        await db.insert(notes).values([
          {
            title: 'Getting Started with Drizzle',
            content: 'Drizzle ORM is a TypeScript ORM for SQL databases...',
            isImportant: true,
            userId: allUsers[0].id,
            createdAt: new Date()
          },
          {
            title: 'SQLite Setup',
            content: 'SQLite is a lightweight database that works great for development...',
            isImportant: false,
            userId: allUsers[0].id,
            createdAt: new Date()
          },
          {
            title: 'My First Note',
            content: 'This is a test note created by Jane Doe.',
            isImportant: false,
            userId: allUsers[1].id,
            createdAt: new Date()
          }
        ]);
      }
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Import the schema to use in the seed function
import { users, notes } from '../../shared/schema';

// Export functions to be called from the application entry point
export default {
  runMigrations,
  seedDatabase
};
