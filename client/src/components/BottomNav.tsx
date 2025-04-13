import { useState } from "react";
import { useGameState } from "@/lib/gameState";
import { Home, Ticket, User, Settings, Sun, Moon } from "lucide-react";

export default function BottomNav() {
  const { toggleTheme, user, withdraw } = useGameState();
  const [activeTab, setActiveTab] = useState("mining");
  
  // Прокрутка к соответствующей секции
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setActiveTab(sectionId);
  };
  
  // Локализованные тексты для разных языков
  const translations: Record<string, Record<string, string>> = {
    "en": {
      "home": "Home",
      "videos": "Videos",
      "profile": "Profile",
      "settings": "Settings"
    },
    "ru": {
      "home": "Главная",
      "videos": "Видео",
      "profile": "Профиль",
      "settings": "Настройки"
    },
    "es": {
      "home": "Inicio",
      "videos": "Videos",
      "profile": "Perfil",
      "settings": "Ajustes"
    },
    "zh": {
      "home": "首页",
      "videos": "视频",
      "profile": "个人资料",
      "settings": "设置"
    },
    "kk": {
      "home": "Басты",
      "videos": "Бейнелер",
      "profile": "Профиль",
      "settings": "Параметрлер"
    }
  };
  
  // Получение текста на выбранном языке или по умолчанию
  const getText = (key: string): string => {
    const lang = user.language && translations[user.language] ? user.language : "ru";
    return translations[lang]?.[key] || translations["ru"][key] || key;
  };
  
  // Обработчик нажатия на кнопку настроек
  const handleSettingsClick = () => {
    // Переключение темы
    toggleTheme();
  };
  
  // Обработчик нажатия на кнопку профиля
  const handleProfileClick = () => {
    // Открыть модальное окно для вывода средств
    withdraw();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around py-2 z-40">
      <button 
        onClick={() => scrollToSection("mining")}
        className={`p-2 rounded-full flex flex-col items-center ${activeTab === "mining" ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">{getText("home")}</span>
      </button>
      
      <button 
        onClick={() => scrollToSection("videos")}
        className={`p-2 rounded-full flex flex-col items-center ${activeTab === "videos" ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Ticket className="h-6 w-6" />
        <span className="text-xs mt-1">{getText("videos")}</span>
      </button>
      
      <button 
        onClick={handleProfileClick}
        className={`p-2 rounded-full flex flex-col items-center ${activeTab === "profile" ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">{getText("profile")}</span>
      </button>
      
      <button 
        onClick={handleSettingsClick}
        className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
      >
        {user.theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        <span className="text-xs mt-1">{getText("settings")}</span>
      </button>
    </nav>
  );
}
