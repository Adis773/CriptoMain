import { useGameState } from "@/lib/gameState";
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardSection() {
  const { leaderboard, user } = useGameState();
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-['Orbitron'] font-bold text-gray-800 dark:text-white mb-4">Top Miners</h2>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Miner</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Earnings</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((item) => (
                <tr key={item.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.name === user.name ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">YOU</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300">{item.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    ${item.earnings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Leaderboard updates every 2 minutes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
