import { useState } from "react";
import { useGameState } from "@/lib/gameState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegistrationForm() {
  const { register } = useGameState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    register(name, phone);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl md:text-3xl font-['Orbitron'] font-bold text-indigo-600 dark:text-indigo-400 text-center mb-6">
            CryptoMiner
          </h1>
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-full mb-6 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shine_3s_infinite]"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium mb-1">
                Your Name
              </Label>
              <Input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+1 (123) 456-7890"
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Start Mining
            </Button>
          </form>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
