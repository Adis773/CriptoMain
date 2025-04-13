// Storage interface for the game
interface UserState {
  name: string;
  phone: string;
  balance: number;
  clicks: number;
  lastResetDate: string | null;
  referrals: number;
  referralId: string;
  theme: "light" | "dark";
  language: string;
}

interface AdminProfit {
  total: number;
}

interface StorageData {
  user: UserState;
  adminProfit: AdminProfit;
}

// Default initial values
const initialUser: UserState = {
  name: "",
  phone: "",
  balance: 0,
  clicks: 0,
  lastResetDate: null,
  referrals: 0,
  referralId: Math.random().toString(36).substring(2, 8),
  theme: "light",
  language: "ru"
};

const initialAdminProfit: AdminProfit = {
  total: 0
};

// Save data to localStorage
export const saveToStorage = (data: StorageData): void => {
  try {
    localStorage.setItem('cryptoMinerUser', JSON.stringify(data.user));
    localStorage.setItem('cryptoMinerAdmin', JSON.stringify(data.adminProfit));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load data from localStorage
export const loadFromStorage = (): StorageData | null => {
  try {
    const savedUser = localStorage.getItem('cryptoMinerUser');
    const savedAdmin = localStorage.getItem('cryptoMinerAdmin');
    
    if (!savedUser && !savedAdmin) return null;
    
    return {
      user: savedUser ? JSON.parse(savedUser) : initialUser,
      adminProfit: savedAdmin ? JSON.parse(savedAdmin) : initialAdminProfit
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Clear data from localStorage
export const clearStorage = (): void => {
  try {
    localStorage.removeItem('cryptoMinerUser');
    localStorage.removeItem('cryptoMinerAdmin');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
