import { useEffect } from "react";
import { useGameState } from "@/lib/gameState";
import MiningSection from "./MiningSection";
import VideoSection from "./VideoSection";
import LeaderboardSection from "./LeaderboardSection";
import ReferralSection from "./ReferralSection";
import BottomNav from "./BottomNav";

export default function MainGameScreen() {
  const { user, toggleTheme } = useGameState();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = user.theme === "dark" 
      ? "bg-gray-900 text-gray-100"
      : "bg-slate-50 text-slate-800";
  }, [user.theme]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              <span className="text-xl">C</span>
            </div>
            <h1 className="text-xl font-['Orbitron'] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              CriptoMain
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-indigo-50 dark:bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">$</span>
              <span className="ml-1 font-semibold text-indigo-700 dark:text-indigo-300">
                {user.balance.toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {user.theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div id="mining">
          <MiningSection />
        </div>
        <div id="videos">
          <VideoSection />
        </div>
        <div id="leaderboard">
          <LeaderboardSection />
        </div>
        <div id="referrals">
          <ReferralSection />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
