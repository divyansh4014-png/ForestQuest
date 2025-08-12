import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize achievements on startup
  await storage.initializeAchievements();

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Task routes
  app.get("/api/users/:userId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getUserTasks(req.params.userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks", error });
    }
  });

  app.post("/api/users/:userId/tasks", async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        userId: req.params.userId,
      };
      const validatedData = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data", error });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task", error });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task", error });
    }
  });

  // Complete task with game mechanics
  app.post("/api/tasks/:id/complete", async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await storage.completeTask(req.params.id, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete task", error });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements", error });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userAchievements = await storage.getUserAchievements(req.params.userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
