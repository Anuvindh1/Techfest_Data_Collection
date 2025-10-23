import { type Participant, type InsertParticipant, type Event } from "@shared/schema";
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

export class MemoryStorage implements IStorage {
  private participants: Map<string, Participant> = new Map();
  private events: Map<string, Event> = new Map();

  async createParticipant(data: InsertParticipant): Promise<Participant> {
    const id = randomUUID();
    const participant: Participant = {
      id,
      name: data.name,
      phone: data.phone,
      spinResult: null,
      timestamp: Date.now(),
    };

    this.participants.set(id, participant);
    return participant;
  }

  async getParticipant(id: string): Promise<Participant | null> {
    return this.participants.get(id) || null;
  }

  async updateParticipantSpinResult(id: string, result: string): Promise<void> {
    const participant = this.participants.get(id);
    if (participant) {
      participant.spinResult = result;
      this.participants.set(id, participant);
    }
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | null> {
    return this.events.get(id) || null;
  }

  async incrementEventWinners(eventId: string): Promise<void> {
    const event = this.events.get(eventId);
    if (event) {
      // Atomic check: only increment if under max limit
      if (event.currentWinners < event.maxWinners) {
        event.currentWinners = (event.currentWinners || 0) + 1;
        this.events.set(eventId, event);
      } else {
        throw new Error(`Event ${eventId} has reached maximum winners`);
      }
    }
  }

  async initializeEvents(): Promise<void> {
    if (this.events.size > 0) {
      return; // Already initialized
    }

    const defaultEvents: Event[] = [
      {
        id: "event-1",
        name: "What's In The Box",
        maxWinners: 5,
        currentWinners: 0,
        color: "#8B5CF6", // Vibrant Purple
      },
      {
        id: "event-2",
        name: "Guess The Beat",
        maxWinners: 5,
        currentWinners: 0,
        color: "#06B6D4", // Neon Cyan
      },
      {
        id: "event-3",
        name: "Byte The Basket",
        maxWinners: 5,
        currentWinners: 0,
        color: "#10B981", // Electric Green
      },
      {
        id: "event-4",
        name: "Memory Game",
        maxWinners: 5,
        currentWinners: 0,
        color: "#F59E0B", // Golden Amber
      },
      {
        id: "event-5",
        name: "Cross Word Puzzle",
        maxWinners: 5,
        currentWinners: 0,
        color: "#EC4899", // Hot Pink
      },
      {
        id: "event-6",
        name: "Balanzo",
        maxWinners: 5,
        currentWinners: 0,
        color: "#EF4444", // Electric Red
      },
    ];

    defaultEvents.forEach((event) => {
      this.events.set(event.id, event);
    });
  }
}

export const memoryStorage = new MemoryStorage();
