import { useGameState } from "@/lib/gameState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReferralSection() {
  const { user, copyReferralLink } = useGameState();
  
  // Construct referral link
  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/?ref=${user.referralId}`;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-['Orbitron'] font-bold text-gray-800 dark:text-white mb-2">Invite Friends</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Get 5% bonus for each friend who joins!</p>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input 
              type="text" 
              id="referral-link" 
              className="flex-grow px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700" 
              readOnly
              value={referralLink}
            />
            <Button 
              onClick={copyReferralLink} 
              className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Copy Link
            </Button>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
            <div className="flex items-center">
              <div className="mr-4 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">Your Referrals</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">{user.referrals} friends joined</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
