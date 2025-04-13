import { users, adminProfit, type User, type InsertUser } from "@shared/schema";

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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private admin: { total: number };
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.admin = { total: 0 };
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByReferralId(referralId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralId === referralId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const today = new Date().toDateString();
    
    const user: User = {
      id,
      username: insertUser.username,
      phone: insertUser.phone,
      balance: "0",
      clicks: 0,
      lastResetDate: today,
      referrals: 0,
      referralId: insertUser.referralId,
      theme: "light"
    };
    
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserMining(id: number, clicks: number, earning: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const today = new Date().toDateString();
    
    // Reset clicks if it's a new day
    if (user.lastResetDate !== today) {
      user.clicks = clicks;
      user.lastResetDate = today;
    } else {
      user.clicks = clicks;
    }
    
    // Update balance
    const currentBalance = parseFloat(user.balance);
    user.balance = (currentBalance + earning).toFixed(2);
    
    this.users.set(id, user);
    return user;
  }

  async incrementReferrals(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    user.referrals += 1;
    this.users.set(id, user);
    
    return user;
  }

  async updateAdminProfit(amount: number): Promise<void> {
    this.admin.total += amount;
  }

  async getAdminProfit(): Promise<number> {
    return this.admin.total;
  }
}

export const storage = new MemStorage();
