import { 
  users, adminProfit, 
  skins as skinsTable,
  userSkins as userSkinsTable,
  payments as paymentsTable, 
  type User, type InsertUser, 
  type Skin, type UserSkin, type Payment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Interface for the storage
export interface IStorage {
  // Базовые методы
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralId(referralId: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserMining(id: number, clicks: number, earning: number): Promise<User>;
  incrementReferrals(id: number): Promise<User>;
  updateAdminProfit(amount: number, isPremium?: boolean): Promise<void>;
  getAdminProfit(): Promise<{total: number, premiumTotal: number}>;
  
  // Методы для аутентификации
  validateUserCredentials(phone: string, password: string): Promise<User | null>;
  
  // Премиум методы
  activatePremium(userId: number, months: number, paymentMethod: string, amount: number): Promise<User>;
  deactivateExpiredPremiums(): Promise<void>;
  isPremiumActive(userId: number): Promise<boolean>;
  
  // Скины
  getAllSkins(): Promise<Skin[]>;
  getUserSkins(userId: number): Promise<Skin[]>;
  addSkinToUser(userId: number, skinId: string): Promise<void>;
  setSelectedSkin(userId: number, skinId: string): Promise<User>;
  
  // Платежи
  createPayment(userId: number, amount: number, paymentMethod: string): Promise<Payment>;
  updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<Payment>;
  getUserPayments(userId: number): Promise<Payment[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Базовые методы
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByReferralId(referralId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralId, referralId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const today = new Date().toDateString();
    
    // Хешируем пароль перед сохранением
    const hashedPassword = await hashPassword(insertUser.password);
    
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
      lastResetDate: today,
      language: insertUser.language || "ru",
      dailyClicks: 100 // Начальное значение кликов в день
    }).returning();
    
    return user;
  }

  async validateUserCredentials(phone: string, password: string): Promise<User | null> {
    const user = await this.getUserByPhone(phone);
    if (!user) return null;
    
    const isValid = await comparePasswords(password, user.password);
    return isValid ? user : null;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.balance));
  }

  async updateUserMining(id: number, clicks: number, earning: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new Error("User not found");
    
    const today = new Date().toDateString();
    
    // Обновляем значения пользователя
    let newClicks = clicks;
    let newLastResetDate = user.lastResetDate;
    
    // Сбрасываем счетчик кликов, если наступил новый день
    if (user.lastResetDate !== today) {
      // Устанавливаем доступное количество кликов в зависимости от премиум-статуса
      const dailyClicks = user.isPremium ? 200 : 100;
      newClicks = clicks;
      newLastResetDate = today;
      
      // Обновляем dailyClicks
      await db.update(users)
        .set({ dailyClicks })
        .where(eq(users.id, id));
    }
    
    // Вычисляем множитель заработка на основе премиум-статуса
    let earningMultiplier = 1.0;
    
    if (user.isPremium) {
      earningMultiplier = Number(user.miningMultiplier) || 1.5;
    }
    
    // Вычисляем новый баланс с учетом множителя
    const currentBalance = parseFloat(user.balance);
    const adjustedEarning = earning * earningMultiplier;
    const newBalance = (currentBalance + adjustedEarning).toFixed(2);
    
    // Обновляем пользователя в базе данных
    const [updatedUser] = await db.update(users)
      .set({
        clicks: newClicks,
        lastResetDate: newLastResetDate,
        balance: newBalance,
        dailyClicks: user.dailyClicks - 1 // Уменьшаем количество доступных кликов
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async incrementReferrals(id: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new Error("User not found");
    
    // Пользователи с премиумом получают дополнительный бонус за рефералов
    const referralBonus = user.isPremium ? 0.1 : 0.05; // 10% для премиум, 5% для обычных
    
    const [updatedUser] = await db.update(users)
      .set({
        referrals: user.referrals + 1
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  // Премиум методы
  async activatePremium(userId: number, months: number, paymentMethod: string, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    // Рассчитываем новую дату окончания премиума
    const now = new Date();
    let expiryDate = user.premiumExpiry && new Date(user.premiumExpiry) > now 
      ? new Date(user.premiumExpiry) 
      : now;
    
    // Добавляем месяцы к текущей дате окончания
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    // Обновляем премиум статус пользователя
    const [updatedUser] = await db.update(users)
      .set({
        isPremium: true,
        premiumExpiry: expiryDate,
        lastPaymentAmount: amount.toString(),
        paymentMethod: paymentMethod,
        miningMultiplier: "1.5", // 50% бонус к майнингу
        dailyClicks: 200, // Увеличенное количество кликов
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Создаем запись о платеже
    await this.createPayment(userId, amount, paymentMethod);
    
    // Обновляем доход от премиум
    await this.updateAdminProfit(amount, true);
    
    return updatedUser;
  }

  async deactivateExpiredPremiums(): Promise<void> {
    const now = new Date();
    
    await db.update(users)
      .set({
        isPremium: false,
        miningMultiplier: "1.0",
        dailyClicks: 100,
      })
      .where(
        and(
          eq(users.isPremium, true),
          sql`${users.premiumExpiry} IS NOT NULL`,
          sql`${users.premiumExpiry} < ${now}`
        )
      );
  }

  async isPremiumActive(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    if (!user.isPremium) return false;
    
    if (!user.premiumExpiry) return false;
    
    const now = new Date();
    const expiryDate = new Date(user.premiumExpiry);
    
    return expiryDate > now;
  }
  
  // Методы для скинов
  async getAllSkins(): Promise<Skin[]> {
    return await db.select().from(skinsTable);
  }

  async getUserSkins(userId: number): Promise<Skin[]> {
    const userSkinRecords = await db
      .select()
      .from(userSkinsTable)
      .where(eq(userSkinsTable.userId, userId));
    
    if (userSkinRecords.length === 0) return [];
    
    // Получаем информацию о каждом скине
    const skinIds = userSkinRecords.map(record => record.skinId);
    
    return await db
      .select()
      .from(skinsTable)
      .where(sql`${skinsTable.skinId} IN (${skinIds.join(',')})`);
  }

  async addSkinToUser(userId: number, skinId: string): Promise<void> {
    // Проверяем, нет ли уже такого скина у пользователя
    const [existingSkin] = await db
      .select()
      .from(userSkinsTable)
      .where(
        and(
          eq(userSkinsTable.userId, userId),
          eq(userSkinsTable.skinId, skinId)
        )
      );
    
    if (!existingSkin) {
      await db
        .insert(userSkinsTable)
        .values({
          userId,
          skinId,
        });
    }
  }

  async setSelectedSkin(userId: number, skinId: string): Promise<User> {
    // Проверяем, есть ли такой скин у пользователя
    const [userSkin] = await db
      .select()
      .from(userSkinsTable)
      .where(
        and(
          eq(userSkinsTable.userId, userId),
          eq(userSkinsTable.skinId, skinId)
        )
      );
    
    if (!userSkin) {
      throw new Error("У пользователя нет этого скина");
    }
    
    // Получаем информацию о скине для установки бонусов
    const [skin] = await db
      .select()
      .from(skinsTable)
      .where(eq(skinsTable.skinId, skinId));
    
    if (!skin) {
      throw new Error("Скин не найден");
    }
    
    // Обновляем выбранный скин и его бонусы
    const [updatedUser] = await db
      .update(users)
      .set({ selectedSkin: skinId })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  // Платежи
  async createPayment(userId: number, amount: number, paymentMethod: string): Promise<Payment> {
    const [payment] = await db
      .insert(paymentsTable)
      .values({
        userId,
        amount: amount.toString(),
        paymentMethod,
      })
      .returning();
    
    return payment;
  }

  async updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<Payment> {
    const updates: any = { status };
    
    if (status === "completed") {
      updates.completedAt = new Date();
    }
    
    if (transactionId) {
      updates.transactionId = transactionId;
    }
    
    const [updatedPayment] = await db
      .update(paymentsTable)
      .set(updates)
      .where(eq(paymentsTable.id, paymentId))
      .returning();
    
    return updatedPayment;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, userId))
      .orderBy(desc(paymentsTable.createdAt));
  }

  // Методы для дохода администратора
  async updateAdminProfit(amount: number, isPremium: boolean = false): Promise<void> {
    const [adminRow] = await db.select().from(adminProfit);
    
    if (adminRow) {
      // Обновляем общий доход
      const currentTotal = parseFloat(adminRow.total);
      const newTotal = (currentTotal + amount).toFixed(2);
      
      const updates: Record<string, any> = { total: newTotal };
      
      // Обновляем доход от премиум, если нужно
      if (isPremium) {
        const currentPremiumTotal = parseFloat(adminRow.premiumTotal || "0");
        updates.premiumTotal = (currentPremiumTotal + amount).toFixed(2);
      }
      
      await db.update(adminProfit)
        .set(updates)
        .where(eq(adminProfit.id, adminRow.id));
    } else {
      // Создаем начальную запись о доходе администратора, если она не существует
      const insertData: Record<string, any> = { 
        total: amount.toFixed(2) 
      };
      
      if (isPremium) {
        insertData.premiumTotal = amount.toFixed(2);
      }
      
      await db.insert(adminProfit).values(insertData);
    }
  }

  async getAdminProfit(): Promise<{total: number, premiumTotal: number}> {
    const [adminRow] = await db.select().from(adminProfit);
    return adminRow 
      ? { 
          total: parseFloat(adminRow.total), 
          premiumTotal: parseFloat(adminRow.premiumTotal || "0")
        } 
      : { total: 0, premiumTotal: 0 };
  }
}

// Export instance of storage
export const storage = new DatabaseStorage();
