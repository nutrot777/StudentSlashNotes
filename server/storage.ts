import { notes, type Note, type InsertNote, type UpdateNote } from "@shared/schema";

export interface IStorage {
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, updates: UpdateNote): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  searchNotes(query: string): Promise<Note[]>;
}

export class MemStorage implements IStorage {
  private notes: Map<number, Note>;
  private currentId: number;

  constructor() {
    this.notes = new Map();
    this.currentId = 1;
    
    // Create a sample note for demo
    const sampleNote: Note = {
      id: 1,
      title: "Welcome to StudyNotes",
      blocks: [
        {
          id: "block-1",
          type: "heading-1",
          content: "Getting Started"
        },
        {
          id: "block-2", 
          type: "paragraph",
          content: "Welcome to your new note-taking app! Type / to see available commands."
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notes.set(1, sampleNote);
    this.currentId = 2;
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const now = new Date();
    const note: Note = {
      ...insertNote,
      id: this.currentId++,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(note.id, note);
    return note;
  }

  async updateNote(id: number, updates: UpdateNote): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) {
      return undefined;
    }

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  async searchNotes(query: string): Promise<Note[]> {
    const allNotes = await this.getNotes();
    const lowercaseQuery = query.toLowerCase();
    
    return allNotes.filter(note => {
      // Search in title
      if (note.title.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in block content
      if (Array.isArray(note.blocks)) {
        return note.blocks.some((block: any) => 
          block.content && block.content.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      return false;
    });
  }
}

export const storage = new MemStorage();
