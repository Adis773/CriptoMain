import { Card, CardContent } from "@/components/ui/card";

export default function VideoSection() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-['Orbitron'] font-bold text-gray-800 dark:text-white mb-4">Featured Videos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-700 aspect-video flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Crypto Mining Tutorial</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to maximize your earnings</p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-700 aspect-video flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Latest Crypto News</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with market trends</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
