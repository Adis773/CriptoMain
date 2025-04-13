import { useGameState } from "@/lib/gameState";

export function useTheme() {
  const { user, toggleTheme } = useGameState();
  
  return {
    theme: user.theme,
    toggleTheme
  };
}
