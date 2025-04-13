import { useState, useEffect } from "react";

interface MiningButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  cooldownActive?: boolean;
}

export default function MiningButton({ 
  onClick, 
  disabled = false, 
  isActive = false, 
  cooldownActive = false 
}: MiningButtonProps) {
  const [cooldownTime, setCooldownTime] = useState(2);

  useEffect(() => {
    let timer: number;
    if (cooldownActive) {
      setCooldownTime(2);
      timer = window.setInterval(() => {
        setCooldownTime((prev) => {
          const newTime = prev - 1;
          return newTime >= 0 ? newTime : 0;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownActive]);

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`
        relative w-32 h-32 rounded-full 
        bg-gradient-to-r from-indigo-600 to-purple-600 
        hover:from-indigo-700 hover:to-purple-700 
        text-white font-['Orbitron'] font-bold text-xl 
        shadow-lg transform transition-all duration-200 
        active:scale-95
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'animate-[glow_1.5s_ease-in-out_infinite_alternate]'}
        ${isActive ? 'scale-95' : ''}
      `}
      style={{
        boxShadow: disabled ? 'none' : '0 0 15px #4f46e5'
      }}
    >
      MINE
      {cooldownActive && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
          {cooldownTime}
        </div>
      )}
    </button>
  );
}
