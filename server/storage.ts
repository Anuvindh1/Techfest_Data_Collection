import { type Participant, type InsertParticipant, type Event } from "@shared/schema";
import { postgresStorage } from "./storage-postgres";
import { memoryStorage } from "./storage-memory";

export interface IStorage {
  createParticipant(data: InsertParticipant): Promise<Participant>;
  getParticipant(id: string): Promise<Participant | null>;
  updateParticipantSpinResult(id: string, result: string): Promise<void>;
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | null>;
  incrementEventWinners(eventId: string): Promise<void>;
  initializeEvents(): Promise<void>;
}

async function createStorage(): Promise<IStorage> {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  No DATABASE_URL found. Using in-memory storage.");
    console.log("⚠️  Data will be lost when the server restarts!");
    return memoryStorage;
  }

  try {
    await postgresStorage.getEvents();
    console.log("✅ PostgreSQL database connected successfully!");
    return postgresStorage;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    console.log("⚠️  Falling back to in-memory storage.");
    return memoryStorage;
  }
}

let storageInstance: IStorage | null = null;

export async function getStorage(): Promise<IStorage> {
  if (!storageInstance) {
    storageInstance = await createStorage();
  }
  return storageInstance;
}

export const storage = memoryStorage; // Default export for backward compatibility
