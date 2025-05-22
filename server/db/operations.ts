import { db } from './index';
import { users, notes, type InsertUser, type InsertNote } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// ----------------
// User Operations
// ----------------

// Create a new user
export async function createUser(user: InsertUser) {
  const result = await db.insert(users).values(user).returning();
  return result[0];
}

// Get user by ID
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}

// Get user by username
export async function getUserByUsername(username: string) {
  const result = await db.select().from(users).where(eq(users.username, username));
  return result[0] || null;
}

// Get all users
export async function getAllUsers() {
  return await db.select().from(users);
}

// Update user
export async function updateUser(id: number, data: Partial<Omit<InsertUser, 'id'>>) {
  const result = await db.update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  
  return result[0] || null;
}

// Delete user
export async function deleteUser(id: number) {
  const result = await db.delete(users)
    .where(eq(users.id, id))
    .returning();
  
  return result[0] || null;
}

// ----------------
// Note Operations
// ----------------

// Create a new note
export async function createNote(note: InsertNote) {
  const result = await db.insert(notes).values({
    ...note,
    createdAt: new Date(),
  }).returning();
  
  return result[0];
}

// Get note by ID
export async function getNoteById(id: number) {
  const result = await db.select().from(notes).where(eq(notes.id, id));
  return result[0] || null;
}

// Get all notes
export async function getAllNotes() {
  return await db.select().from(notes);
}

// Get notes by user ID
export async function getNotesByUserId(userId: number) {
  return await db.select().from(notes).where(eq(notes.userId, userId));
}

// Update note
export async function updateNote(id: number, data: Partial<Omit<InsertNote, 'id'>>) {
  const result = await db.update(notes)
    .set(data)
    .where(eq(notes.id, id))
    .returning();
  
  return result[0] || null;
}

// Delete note
export async function deleteNote(id: number) {
  const result = await db.delete(notes)
    .where(eq(notes.id, id))
    .returning();
  
  return result[0] || null;
}

// Delete all notes by a user
export async function deleteUserNotes(userId: number) {
  return await db.delete(notes)
    .where(eq(notes.userId, userId));
}
