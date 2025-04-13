import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  phone: text("phone").notNull(),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  clicks: integer("clicks").notNull().default(0),
  lastResetDate: text("last_reset_date"),
  referrals: integer("referrals").notNull().default(0),
  referralId: text("referral_id").notNull().unique(),
  theme: text("theme").notNull().default("light"),
  language: text("language").notNull().default("ru"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  phone: true,
  referralId: true,
  language: true,
});

export const adminProfit = pgTable("admin_profit", {
  id: serial("id").primaryKey(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull().default("0"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AdminProfit = typeof adminProfit.$inferSelect;
