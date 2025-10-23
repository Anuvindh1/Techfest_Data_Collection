import { type Participant, type InsertParticipant, type Event } from "@shared/schema";
import { db } from "./firebase";
import { memoryStorage } from "./storage-memory";
import { randomUUID } from "crypto";

export interface IStorage {
  createParticipant(data: InsertParticipant): Promise<Participant>;
  getParticipant(id: string): Promise<Participant | null>;
  updateParticipantSpinResult(id: string, result: string): Promise<void>;
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | null>;
  incrementEventWinners(eventId: string): Promise<void>;
  initializeEvents(): Promise<void>;
}

export class FirebaseStorage implements IStorage {
  private participantsRef = db.ref("participants");
  private eventsRef = db.ref("events");

  async createParticipant(data: InsertParticipant): Promise<Participant> {
    const id = randomUUID();
    const participant: Participant = {
      id,
      name: data.name,
      phone: data.phone,
      spinResult: null,
      timestamp: Date.now(),
    };

    await this.participantsRef.child(id).set(participant);
    return participant;
  }

  async getParticipant(id: string): Promise<Participant | null> {
    const snapshot = await this.participantsRef.child(id).once("value");
    return snapshot.exists() ? snapshot.val() : null;
  }

  async updateParticipantSpinResult(id: string, result: string): Promise<void> {
    await this.participantsRef.child(id).update({
      spinResult: result,
    });
  }

  async getEvents(): Promise<Event[]> {
    const snapshot = await this.eventsRef.once("value");
    if (!snapshot.exists()) {
      return [];
    }

    const eventsObj = snapshot.val();
    return Object.values(eventsObj);
  }

  async getEvent(id: string): Promise<Event | null> {
    const snapshot = await this.eventsRef.child(id).once("value");
    return snapshot.exists() ? snapshot.val() : null;
  }

  async incrementEventWinners(eventId: string): Promise<void> {
    const eventRef = this.eventsRef.child(eventId);
    
    // Atomic increment with quota check
    // Transaction ensures only one increment happens at a time
    let wasIncremented = false;
    
    await eventRef.transaction((event) => {
      if (!event) {
        return event; // Event doesn't exist, abort
      }
      
      // Check if we're under the max limit
      if (event.currentWinners < event.maxWinners) {
        event.currentWinners = (event.currentWinners || 0) + 1;
        wasIncremented = true;
        return event; // Commit the increment
      }
      
      // Quota reached, don't increment
      wasIncremented = false;
      return; // Abort transaction (returns undefined)
    });
    
    // If transaction was aborted because quota was reached, throw error
    if (!wasIncremented) {
      throw new Error(`Event ${eventId} has reached maximum winners`);
    }
  }

  async initializeEvents(): Promise<void> {
    const snapshot = await this.eventsRef.once("value");
    if (snapshot.exists()) {
      return;
    }

    const events: Event[] = [
      {
        id: "event-1",
        name: "Coding Challenge",
        maxWinners: 5,
        currentWinners: 0,
        color: "#8B5CF6",
      },
      {
        id: "event-2",
        name: "Hackathon",
        maxWinners: 5,
        currentWinners: 0,
        color: "#06B6D4",
      },
      {
        id: "event-3",
        name: "Tech Talk",
        maxWinners: 5,
        currentWinners: 0,
        color: "#10B981",
      },
      {
        id: "event-4",
        name: "Workshop",
        maxWinners: 5,
        currentWinners: 0,
        color: "#F59E0B",
      },
      {
        id: "event-5",
        name: "Gaming Arena",
        maxWinners: 5,
        currentWinners: 0,
        color: "#EC4899",
      },
    ];

    const eventsObj: Record<string, Event> = {};
    events.forEach((event) => {
      eventsObj[event.id] = event;
    });

    await this.eventsRef.set(eventsObj);
  }
}

// Use Firebase if DATABASE_URL is configured and accessible, otherwise fallback to memory
async function createStorage(): Promise<IStorage> {
  if (!process.env.FIREBASE_DATABASE_URL) {
    console.log("⚠️  No FIREBASE_DATABASE_URL found. Using in-memory storage.");
    console.log("⚠️  Data will be lost when the server restarts!");
    return memoryStorage;
  }

  try {
    const firebaseStorage = new FirebaseStorage();
    // Test Firebase connection
    await firebaseStorage.getEvents();
    console.log("✅ Firebase Realtime Database connected successfully!");
    return firebaseStorage;
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    console.log("⚠️  Falling back to in-memory storage.");
    console.log("⚠️  Please configure Firebase Database security rules:");
    console.log('   { "rules": { ".read": true, ".write": true } }');
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
