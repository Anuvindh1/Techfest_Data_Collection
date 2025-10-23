import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertParticipantSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get storage instance (Firebase or in-memory fallback)
  const storage = await getStorage();
  
  // Initialize events on server start
  await storage.initializeEvents();

  // POST /api/register - Register a new participant
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertParticipantSchema.parse(req.body);
      const participant = await storage.createParticipant(validatedData);
      res.json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        console.error("Error registering participant:", error);
        res.status(500).json({ message: "Failed to register participant" });
      }
    }
  });

  // GET /api/participant/:id - Get participant by ID
  app.get("/api/participant/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const participant = await storage.getParticipant(id);
      
      if (!participant) {
        res.status(404).json({ message: "Participant not found" });
        return;
      }

      res.json(participant);
    } catch (error) {
      console.error("Error fetching participant:", error);
      res.status(500).json({ message: "Failed to fetch participant" });
    }
  });

  // GET /api/events - Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // POST /api/spin/:id - Spin the wheel for a participant
  app.post("/api/spin/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Check if participant exists
      const participant = await storage.getParticipant(id);
      if (!participant) {
        res.status(404).json({ message: "Participant not found" });
        return;
      }

      // Check if already spun
      if (participant.spinResult) {
        res.status(400).json({ 
          message: "Participant has already spun the wheel",
          result: participant.spinResult 
        });
        return;
      }

      // Get all events
      const events = await storage.getEvents();
      
      // Filter events that still have available slots
      const availableEvents = events.filter(
        (event) => event.currentWinners < event.maxWinners
      );

      // Create wheel segments (events + "Better Luck Next Time")
      const wheelSegments: string[] = [];
      
      // Add all events to the wheel (even if full, for display)
      events.forEach((event) => {
        wheelSegments.push(event.name);
        wheelSegments.push("Better Luck Next Time");
      });

      // Randomly select a segment
      let result: string;
      let isWinner = false;

      if (availableEvents.length === 0) {
        // No events available, always "Better Luck Next Time"
        result = "Better Luck Next Time";
      } else {
        // Random selection with weighted probability
        // 25% chance for available events, 75% for "Better Luck Next Time"
        // This means out of 20 people, approximately 5 will win (4-8 range)
        const random = Math.random();
        
        if (random < 0.25 && availableEvents.length > 0) {
          // Select a random available event
          const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
          
          try {
            // Attempt to increment winner count (atomic operation)
            await storage.incrementEventWinners(selectedEvent.id);
            result = selectedEvent.name;
            isWinner = true;
          } catch (error) {
            // If quota reached during increment, fallback to "Better Luck Next Time"
            result = "Better Luck Next Time";
          }
        } else {
          result = "Better Luck Next Time";
        }
      }

      // Update participant with spin result
      await storage.updateParticipantSpinResult(id, result);

      res.json({
        result,
        isWinner,
        participantId: id,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error spinning wheel:", error);
      res.status(500).json({ message: "Failed to spin wheel" });
    }
  });

  // POST /api/admin/reset-winners - Reset all winner counts (FOR TESTING ONLY)
  // Add password protection for safety
  app.post("/api/admin/reset-winners", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Simple password check (change "test123" to your own secret)
      if (password !== "test123") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Reset all events to 0 winners
      await storage.resetAllEventWinners();
      
      // Get updated events to confirm
      const events = await storage.getEvents();
      
      res.json({ 
        message: "✅ Winner counts reset successfully!",
        tip: "You can now test the 5-winner limit again",
        events: events.map(e => ({ name: e.name, currentWinners: e.currentWinners, maxWinners: e.maxWinners }))
      });
    } catch (error) {
      console.error("Error resetting winners:", error);
      res.status(500).json({ message: "Failed to reset winners" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
