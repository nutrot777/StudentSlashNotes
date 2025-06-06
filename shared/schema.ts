import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  blocks: jsonb("blocks").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Block types
export const blockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'paragraph',
    'heading-1',
    'heading-2', 
    'heading-3',
    'bullet-list',
    'numbered-list',
    'checkbox-list',
    'code'
  ]),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type Block = z.infer<typeof blockSchema>;

export const updateNoteSchema = z.object({
  title: z.string().optional(),
  blocks: z.array(blockSchema).optional(),
});

export type UpdateNote = z.infer<typeof updateNoteSchema>;
