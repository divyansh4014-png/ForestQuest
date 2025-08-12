import {
  users,
  tasks,
  achievements,
  userAchievements,
  type User,
  type InsertUser,
  type UpsertUser,
  type Task,
  type InsertTask,
  type Achievement,
  type UserAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Task operations
  getUserTasks(userId: string): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  
  // Game mechanics
  completeTask(taskId: string, userId: string): Promise<{ user: User; task: Task }>;
  initializeAchievements(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return userAchievement;
  }

  async completeTask(taskId: string, userId: string): Promise<{ user: User; task: Task }> {
    // Get the task
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Update task to completed
    const completedTask = await this.updateTask(taskId, {
      status: "completed",
      completedAt: new Date(),
    });

    // Get current user
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate new experience and level
    const currentExperience = user.experience || 0;
    const taskReward = task.experienceReward || 25;
    const newExperience = currentExperience + taskReward;
    const newLevel = Math.floor(newExperience / 100) + 1;
    const currentHitPoints = user.hitPoints || 100;
    const newHitPoints = Math.min(currentHitPoints + 5, 100); // Restore some HP
    const newTreeStage = Math.min(Math.floor(newExperience / 100) + 1, 10);
    const currentStreak = user.streak || 0;

    // Update user stats
    const updatedUser = await this.updateUser(userId, {
      experience: newExperience,
      level: newLevel,
      hitPoints: newHitPoints,
      treeStage: newTreeStage,
      streak: currentStreak + 1,
    });

    return { user: updatedUser, task: completedTask };
  }

  async initializeAchievements(): Promise<void> {
    const defaultAchievements = [
      {
        name: "Task Master",
        description: "Complete 10 tasks",
        type: "task_master" as const,
        icon: "fas fa-trophy",
        color: "from-yellow-400 to-yellow-500",
        requirement: 10,
      },
      {
        name: "Green Thumb",
        description: "Reach level 5",
        type: "green_thumb" as const,
        icon: "fas fa-seedling",
        color: "from-forest-400 to-forest-500",
        requirement: 5,
      },
      {
        name: "Consistent",
        description: "Maintain a 7-day streak",
        type: "consistent" as const,
        icon: "fas fa-calendar-check",
        color: "from-blue-400 to-blue-500",
        requirement: 7,
      },
      {
        name: "Speed Demon",
        description: "Complete 5 tasks in one day",
        type: "speed_demon" as const,
        icon: "fas fa-bolt",
        color: "from-purple-400 to-purple-500",
        requirement: 5,
      },
      {
        name: "Precious",
        description: "Complete 50 tasks total",
        type: "precious" as const,
        icon: "fas fa-gem",
        color: "from-red-400 to-red-500",
        requirement: 50,
      },
      {
        name: "Streak Keeper",
        description: "Maintain a 30-day streak",
        type: "streak_keeper" as const,
        icon: "fas fa-fire",
        color: "from-orange-400 to-orange-500",
        requirement: 30,
      },
    ];

    // Check if achievements already exist
    const existingAchievements = await this.getAllAchievements();
    if (existingAchievements.length === 0) {
      await db.insert(achievements).values(defaultAchievements);
    }
  }
}

export const storage = new DatabaseStorage();
