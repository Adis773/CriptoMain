import { useEffect } from "react";
import { useGameState } from "@/lib/gameState";

export default function Toast() {
  const { toastMessage, setToastMessage } = useGameState();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage) return null;

  return (
    <div 
      className={`
        fixed bottom-20 left-1/2 transform -translate-x-1/2 
        bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 
        transition-opacity duration-300 flex items-center
        ${toastMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <span>{toastMessage}</span>
    </div>
  );
}
