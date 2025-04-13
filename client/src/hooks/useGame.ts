import { useGameState } from "@/lib/gameState";

export function useGame() {
  const gameState = useGameState();
  return gameState;
}
