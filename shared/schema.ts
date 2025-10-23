import { z } from "zod";
import { pgTable, varchar, integer, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Participant registration schema
export const participantSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid WhatsApp number"),
  spinResult: z.string().nullable(),
  timestamp: z.number(),
});

export const insertParticipantSchema = participantSchema.omit({ 
  id: true, 
  spinResult: true, 
  timestamp: true 
});

export type Participant = z.infer<typeof participantSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

// Event configuration schema
export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  maxWinners: z.number(),
  currentWinners: z.number(),
  color: z.string(),
});

export type Event = z.infer<typeof eventSchema>;

// Spin result schema
export const spinResultSchema = z.object({
  participantId: z.string(),
  result: z.string(),
  isWinner: z.boolean(),
  timestamp: z.number(),
});

export type SpinResult = z.infer<typeof spinResultSchema>;

// Drizzle ORM Table Definitions
export const participants = pgTable("participants", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  spinResult: varchar("spin_result"),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  maxWinners: integer("max_winners").notNull(),
  currentWinners: integer("current_winners").notNull().default(0),
  color: varchar("color").notNull(),
});
