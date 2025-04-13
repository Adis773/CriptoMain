import { useGameState } from "@/lib/gameState";
import RegistrationForm from "@/components/RegistrationForm";
import MainGameScreen from "@/components/MainGameScreen";

export default function Home() {
  const { isRegistered } = useGameState();

  return (
    <div id="app" className="font-sans min-h-screen transition-colors duration-300">
      {!isRegistered && <RegistrationForm />}
      {isRegistered && <MainGameScreen />}
    </div>
  );
}
