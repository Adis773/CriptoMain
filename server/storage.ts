import { users, adminProfit, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for the storage
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralId(referralId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserMining(id: number, clicks: number, earning: number): Promise<User>;
  incrementReferrals(id: number): Promise<User>;
  updateAdminProfit(amount: number): Promise<void>;
  getAdminProfit(): Promise<number>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByReferralId(referralId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralId, referralId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const today = new Date().toDateString();
    const [user] = await db.insert(users).values({
      ...insertUser,
      lastResetDate: today,
      language: insertUser.language || "ru"
    }).returning();
    
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserMining(id: number, clicks: number, earning: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new Error("User not found");
    
    const today = new Date().toDateString();
    
    // Update user with new values
    let newClicks = clicks;
    let newLastResetDate = user.lastResetDate;
    
    // Reset clicks if it's a new day
    if (user.lastResetDate !== today) {
      newClicks = clicks;
      newLastResetDate = today;
    }
    
    // Calculate new balance
    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + earning).toFixed(2);
    
    // Update user in database
    const [updatedUser] = await db.update(users)
      .set({
        clicks: newClicks,
        lastResetDate: newLastResetDate,
        balance: newBalance
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async incrementReferrals(id: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new Error("User not found");
    
    const [updatedUser] = await db.update(users)
      .set({
        referrals: user.referrals + 1
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async updateAdminProfit(amount: number): Promise<void> {
    const [adminRow] = await db.select().from(adminProfit);
    
    if (adminRow) {
      const currentTotal = parseFloat(adminRow.total);
      const newTotal = (currentTotal + amount).toFixed(2);
      
      await db.update(adminProfit)
        .set({ total: newTotal })
        .where(eq(adminProfit.id, adminRow.id));
    } else {
      // Create initial admin profit record if it doesn't exist
      await db.insert(adminProfit).values({
        total: amount.toFixed(2)
      });
    }
  }

  async getAdminProfit(): Promise<number> {
    const [adminRow] = await db.select().from(adminProfit);
    return adminRow ? parseFloat(adminRow.total) : 0;
  }
}

// Export instance of storage
export const storage = new DatabaseStorage();
