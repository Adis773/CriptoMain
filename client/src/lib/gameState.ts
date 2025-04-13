// No JSX version of the game state - avoiding any React JSX syntax that might cause issues
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "./storage";

// Type definitions
export type Theme = "light" | "dark";

export interface UserState {
  name: string;
  phone: string;
  balance: number;
  clicks: number;
  lastResetDate: string | null;
  referrals: number;
  referralId: string;
  theme: Theme;
}

export interface AdminProfit {
  total: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  earnings: string;
}

export interface GameStateContextType {
  user: UserState;
  adminProfit: AdminProfit;
  isRegistered: boolean;
  isMining: boolean;
  cooldownActive: boolean;
  leaderboard: LeaderboardEntry[];
  toastMessage: string | null;
  setToastMessage: (message: string | null) => void;
  register: (name: string, phone: string) => void;
  mine: () => void;
  withdraw: () => void;
  toggleTheme: () => void;
  copyReferralLink: () => void;
}

// Generate a random referral ID
function generateReferralId() {
  return Math.random().toString(36).substring(2, 8);
}

// Initial state
const initialUserState: UserState = {
  name: "",
  phone: "",
  balance: 0,
  clicks: 0,
  lastResetDate: null,
  referrals: 0,
  referralId: generateReferralId(),
  theme: "light",
};

const initialAdminProfit: AdminProfit = {
  total: 0,
};

// Create context with default values to avoid undefined checks
const defaultContextValue: GameStateContextType = {
  user: initialUserState,
  adminProfit: initialAdminProfit,
  isRegistered: false,
  isMining: false,
  cooldownActive: false,
  leaderboard: [],
  toastMessage: null,
  setToastMessage: () => {},
  register: () => {},
  mine: () => {},
  withdraw: () => {},
  toggleTheme: () => {},
  copyReferralLink: () => {},
};

// Create context with the default values
const GameStateContext = createContext<GameStateContextType>(defaultContextValue);

// Provider component using React.createElement instead of JSX
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(initialUserState);
  const [adminProfit, setAdminProfit] = useState<AdminProfit>(initialAdminProfit);
  const [isMining, setIsMining] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = loadFromStorage();
    if (storedData) {
      const { user: storedUser, adminProfit: storedAdmin } = storedData;
      
      // Check if we need to reset daily clicks
      const today = new Date().toDateString();
      if (storedUser.lastResetDate !== today && storedUser.name) {
        storedUser.clicks = 0;
        storedUser.lastResetDate = today;
      }
      
      setUser(storedUser);
      setAdminProfit(storedAdmin);
    }
    
    // Initialize leaderboard
    updateLeaderboard();
    
    // Update leaderboard every 2 minutes
    const interval = setInterval(updateLeaderboard, 120000);
    return () => clearInterval(interval);
  }, []);

  // Check for referral in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');
    
    if (refId && !user.name) {
      // This is a new user coming from a referral
      localStorage.setItem('cryptoMinerReferrer', refId);
    }
  }, [user.name]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (user.name) {
      saveToStorage({ user, adminProfit });
    }
  }, [user, adminProfit]);

  // Check if user is registered
  const isRegistered = Boolean(user.name && user.phone);

  // Register new user
  const register = (name: string, phone: string) => {
    // Get referrer from localStorage if it exists
    const referrer = localStorage.getItem('cryptoMinerReferrer');
    
    setUser({
      ...user,
      name,
      phone,
      lastResetDate: new Date().toDateString()
    });
    
    // If there was a referrer, remove it from localStorage
    if (referrer) {
      localStorage.removeItem('cryptoMinerReferrer');
    }
    
    updateLeaderboard();
    setToastMessage(`Welcome, ${name}!`);
  };

  // Mining function
  const mine = () => {
    if (cooldownActive || user.clicks >= 100) {
      return;
    }

    setCooldownActive(true);
    setIsMining(true);

    // Calculate earnings for this click
    const baseEarning = parseFloat((Math.random() * 0.6).toFixed(2));
    const multiplier = 1 + (user.referrals * 0.05);
    const earning = baseEarning * multiplier;

    // Update user balance and admin profit
    const newBalance = user.balance + earning;
    const newAdminProfitTotal = adminProfit.total + (earning * 0.4); // Admin gets 40%

    // Update state
    setUser({
      ...user,
      clicks: user.clicks + 1,
      balance: parseFloat(newBalance.toFixed(2))
    });
    
    setAdminProfit({
      ...adminProfit,
      total: parseFloat(newAdminProfitTotal.toFixed(2))
    });

    // Set cooldown timer
    setTimeout(() => {
      setIsMining(false);
      setTimeout(() => {
        setCooldownActive(false);
      }, 1000);
    }, 1000);
  };

  // Withdraw function
  const withdraw = () => {
    if (user.balance <= 0) {
      setToastMessage("No earnings to withdraw");
      return;
    }
    
    setToastMessage("Withdrawal request sent!");
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = user.theme === "light" ? "dark" : "light";
    setUser({
      ...user,
      theme: newTheme
    });
  };

  // Copy referral link
  const copyReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/?ref=${user.referralId}`;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setToastMessage("Referral link copied!");
      })
      .catch((err) => {
        setToastMessage("Failed to copy: " + err);
      });
  };
  
  // Generate leaderboard
  const updateLeaderboard = () => {
    // Names for the leaderboard
    const names = [
      'CryptoKing', 'BitMaster', 'CoinHunter', 'MinerPro', 'BlockchainGuru', 
      'HashPower', 'TokenMiner', 'DigiGold', 'CryptoNinja', 'BitLord', 
      'MinerElite', 'CoinMaster', 'CryptoWhale'
    ];
    
    // Generate random leaderboard data
    const newLeaderboard: LeaderboardEntry[] = Array.from({length: 10}, (_, i) => {
      return {
        rank: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        earnings: (Math.random() * 400 + 100).toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.earnings) - parseFloat(a.earnings));
    
    // Add current user to leaderboard if they have earnings
    if (user.balance > 0 && user.name) {
      const userRecord: LeaderboardEntry = {
        rank: 0, // Will be updated
        name: user.name,
        earnings: user.balance.toFixed(2)
      };
      
      // Find position for user based on earnings
      const position = newLeaderboard.findIndex(
        item => parseFloat(item.earnings) < user.balance
      );
      
      if (position !== -1) {
        newLeaderboard.splice(position, 0, userRecord);
        newLeaderboard.pop(); // Remove the last item to keep 10 items
      } else if (user.balance > parseFloat(newLeaderboard[newLeaderboard.length - 1].earnings)) {
        newLeaderboard[newLeaderboard.length - 1] = userRecord;
      }
      
      // Update ranks
      newLeaderboard.forEach((item, index) => {
        item.rank = index + 1;
      });
    }
    
    setLeaderboard(newLeaderboard);
  };

  // Create context value
  const contextValue = {
    user,
    adminProfit,
    isRegistered,
    isMining,
    cooldownActive,
    leaderboard,
    toastMessage,
    setToastMessage,
    register,
    mine,
    withdraw,
    toggleTheme,
    copyReferralLink
  };

  // Using createElement directly to avoid JSX syntax issues
  return React.createElement(
    GameStateContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the game state
export function useGameState() {
  return useContext(GameStateContext);
}
