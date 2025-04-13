import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the game
  
  // Get all users (for leaderboard)
  app.get("/api/users/leaderboard", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Sort users by balance in descending order
      const sortedUsers = users
        .sort((a, b) => Number(b.balance) - Number(a.balance))
        .slice(0, 10) // Get top 10
        .map((user, index) => ({
          rank: index + 1,
          name: user.username,
          earnings: Number(user.balance).toFixed(2)
        }));
      
      res.json(sortedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });
  
  // Register a new user
  app.post("/api/users/register", async (req, res) => {
    try {
      const { username, phone, referralId } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        username,
        phone,
        referralId
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Update user balance (after mining)
  app.patch("/api/users/:id/mine", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { clicks, earning } = req.body;
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user
      const updatedUser = await storage.updateUserMining(userId, clicks, earning);
      
      // Update admin profit (40% of earnings)
      await storage.updateAdminProfit(earning * 0.4);
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Handle referrals
  app.post("/api/users/referral", async (req, res) => {
    try {
      const { referrerId, newUserId } = req.body;
      
      // Update referrer's referral count
      const updatedReferrer = await storage.incrementReferrals(referrerId);
      
      res.json(updatedReferrer);
    } catch (error) {
      res.status(500).json({ message: "Failed to process referral" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
