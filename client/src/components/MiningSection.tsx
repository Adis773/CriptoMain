import { useGameState } from "@/lib/gameState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MiningButton from "./ui/mining-button";
import ProgressWithText from "./ui/progress-with-text";

export default function MiningSection() {
  const { user, mine, withdraw, cooldownActive, isMining } = useGameState();
  
  // Calculate mining power based on referrals
  const miningPower = (1 + (user.referrals * 0.05)).toFixed(2);
  
  // Calculate progress percentage
  const progressPercentage = (user.clicks / 100) * 100;
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-['Orbitron'] font-bold text-gray-800 dark:text-white mb-2">Mining Station</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Click to mine crypto coins</p>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          {/* Mining stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily clicks</p>
              <p className="text-lg font-semibold">{user.clicks}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">/ 100</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Mining power</p>
              <p className="text-lg font-semibold">{miningPower}x</p>
              <p className="text-xs text-emerald-500">+{user.referrals * 5}% bonus</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <ProgressWithText value={progressPercentage} />
          
          {/* Mining button */}
          <MiningButton 
            onClick={mine} 
            disabled={cooldownActive || user.clicks >= 100}
            isActive={isMining}
            cooldownActive={cooldownActive}
          />
          
          {/* Withdraw button */}
          <Button 
            onClick={withdraw} 
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Withdraw Earnings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
