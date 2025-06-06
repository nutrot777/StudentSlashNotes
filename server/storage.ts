import { notes, type Note, type InsertNote, type UpdateNote } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, updates: UpdateNote): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  searchNotes(query: string): Promise<Note[]>;
}

export class DatabaseStorage implements IStorage {
  async getNotes(): Promise<Note[]> {
    const result = await db.select().from(notes).orderBy(desc(notes.updatedAt));
    return result;
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values({
        ...insertNote,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return note;
  }

  async updateNote(id: number, updates: UpdateNote): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();
    return note || undefined;
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async searchNotes(query: string): Promise<Note[]> {
    const result = await db
      .select()
      .from(notes)
      .where(ilike(notes.title, `%${query}%`))
      .orderBy(desc(notes.updatedAt));
    return result;
  }
}

export const storage = new DatabaseStorage();
