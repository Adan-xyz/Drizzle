import { users, notes, type User, type InsertUser, type Note, type InsertNote } from "@shared/schema";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';

// Create SQLite database connection
const sqlite = new Database(':memory:'); // Using in-memory database for simplicity
const db = drizzle(sqlite);

// Create tables
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

// Storage interface
export interface IStorage {
  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note operations
  getNoteById(id: number): Promise<Note | undefined>;
  getAllNotes(): Promise<Note[]>;
  getNotesByUserId(userId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
}

// Drizzle Storage implementation
export class DrizzleStorage implements IStorage {
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Note operations
  async getNoteById(id: number): Promise<Note | undefined> {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
  }

  async getAllNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async getNotesByUserId(userId: number): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const result = await db.insert(notes).values({
      ...note,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }
}

export const storage = new DrizzleStorage();
