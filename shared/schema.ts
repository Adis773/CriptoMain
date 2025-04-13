
import { pgTable, text, serial, integer, boolean, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  email: text("email"),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  clicks: integer("clicks").notNull().default(0),
  lastResetDate: text("last_reset_date"),
  referrals: integer("referrals").notNull().default(0),
  referralId: text("referral_id").notNull().unique(),
  theme: text("theme").notNull().default("light"),
  language: text("language").notNull().default("ru"),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiry: timestamp("premium_expiry"),
  lastPaymentAmount: numeric("last_payment_amount", { precision: 10, scale: 2 }),
  paymentMethod: text("payment_method"),
  selectedSkin: text("selected_skin").default("default"),
  miningMultiplier: numeric("mining_multiplier", { precision: 5, scale: 2 }).notNull().default("1"),
  dailyClicks: integer("daily_clicks").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skins = pgTable("skins", {
  id: serial("id").primaryKey(),
  skinId: text("skin_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rarity: text("rarity").notNull().default("common"),
  miningBonus: numeric("mining_bonus", { precision: 5, scale: 2 }).notNull().default("0"),
  clickBonus: integer("click_bonus").notNull().default(0),
  isPremium: boolean("is_premium").notNull().default(false),
  price: numeric("price", { precision: 10, scale: 2 }),
});

export const userSkins = pgTable("user_skins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  skinId: text("skin_id").notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("pending"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const adminProfit = pgTable("admin_profit", {
  id: serial("id").primaryKey(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull().default("0"),
  premiumTotal: numeric("premium_total", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  phone: true,
  password: true,
  email: true,
  referralId: true,
  language: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  amount: true,
  paymentMethod: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Skin = typeof skins.$inferSelect;
export type UserSkin = typeof userSkins.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type AdminProfit = typeof adminProfit.$inferSelect;

export const loginSchema = z.object({
  phone: z.string().min(1, "Телефон обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});
