import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";
import { participants, events } from "@shared/schema";
import { type Participant, type InsertParticipant, type Event } from "@shared/schema";
import type { IStorage } from "./storage";
import { randomUUID } from "crypto";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export class PostgresStorage implements IStorage {
  async createParticipant(data: InsertParticipant): Promise<Participant> {
    const id = randomUUID();
    const participant: Participant = {
      id,
      name: data.name,
      phone: data.phone,
      spinResult: null,
      timestamp: Date.now(),
    };

    await db.insert(participants).values(participant);
    return participant;
  }

  async getParticipant(id: string): Promise<Participant | null> {
    const result = await db
      .select()
      .from(participants)
      .where(eq(participants.id, id))
      .limit(1);

    return result[0] || null;
  }

  async updateParticipantSpinResult(id: string, result: string): Promise<void> {
    await db
      .update(participants)
      .set({ spinResult: result })
      .where(eq(participants.id, id));
  }

  async getEvents(): Promise<Event[]> {
    const result = await db.select().from(events);
    return result;
  }

  async getEvent(id: string): Promise<Event | null> {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    return result[0] || null;
  }

  async incrementEventWinners(eventId: string): Promise<void> {
    const result = await db
      .update(events)
      .set({ 
        currentWinners: sql`${events.currentWinners} + 1` 
      })
      .where(
        sql`${events.id} = ${eventId} AND ${events.currentWinners} < ${events.maxWinners}`
      )
      .returning();

    if (result.length === 0) {
      throw new Error(`Event ${eventId} has reached maximum winners`);
    }
  }

  async initializeEvents(): Promise<void> {
    const existingEvents = await db.select().from(events).limit(1);
    if (existingEvents.length > 0) {
      return;
    }

    const initialEvents: Event[] = [
      {
        id: "event-1",
        name: "Whats in the box",
        maxWinners: 5,
        currentWinners: 0,
        color: "#8B5CF6",
      },
      {
        id: "event-2",
        name: "Guess the beat",
        maxWinners: 5,
        currentWinners: 0,
        color: "#06B6D4",
      },
      {
        id: "event-3",
        name: "Byte the basket",
        maxWinners: 5,
        currentWinners: 0,
        color: "#10B981",
      },
      {
        id: "event-4",
        name: "Tech Quiz",
        maxWinners: 5,
        currentWinners: 0,
        color: "#F59E0B",
      },
      {
        id: "event-5",
        name: "Cross word puzzle",
        maxWinners: 5,
        currentWinners: 0,
        color: "#EC4899",
      },
      {
        id: "event-6",
        name: "Balanzo",
        maxWinners: 5,
        currentWinners: 0,
        color: "#EF4444",
      },
    ];

    await db.insert(events).values(initialEvents);
  }
}

export const postgresStorage = new PostgresStorage();
