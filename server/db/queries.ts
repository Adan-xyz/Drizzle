import { db } from './index';
import { users, notes } from '../../shared/schema';
import { and, or, eq, ne, gt, lt, like, desc, asc, sql } from 'drizzle-orm';

// Filter notes by title and importance
export async function searchNotes(titleQuery: string, importantOnly: boolean = false) {
  let query = db.select().from(notes);
  
  // Add conditions
  const conditions = [];
  
  if (titleQuery) {
    conditions.push(like(notes.title, `%${titleQuery}%`));
  }
  
  if (importantOnly) {
    conditions.push(eq(notes.isImportant, true));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  // Order by creation date, newest first
  query = query.orderBy(desc(notes.createdAt));
  
  return await query;
}

// Pagination example
export async function getPaginatedNotes(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  
  // Get notes with pagination
  const paginatedNotes = await db.select()
    .from(notes)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(notes.createdAt));
  
  // Get total count for pagination info
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(notes);
  
  const total = countResult[0].count;
  
  return {
    data: paginatedNotes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Join example - get notes with author info
export async function getNotesWithUsers() {
  return await db.select({
    note: {
      id: notes.id,
      title: notes.title,
      content: notes.content,
      isImportant: notes.isImportant,
      createdAt: notes.createdAt
    },
    user: {
      id: users.id,
      username: users.username
    }
  })
  .from(notes)
  .innerJoin(users, eq(notes.userId, users.id))
  .orderBy(desc(notes.createdAt));
}

// Get user notes with additional metadata
export async function getUserWithNotes(userId: number) {
  // Get user first
  const user = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user[0]) {
    return null;
  }

  // Get user's notes
  const userNotes = await db.select().from(notes).where(eq(notes.userId, userId));
  
  // Get notes statistics
  const importantNotesCount = userNotes.filter(note => note.isImportant).length;
  
  return {
    user: user[0],
    notes: userNotes,
    stats: {
      totalNotes: userNotes.length,
      importantNotes: importantNotesCount
    }
  };
}
