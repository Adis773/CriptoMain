import { useState } from "react";
import { useGameState } from "@/lib/gameState";
import { 
  Home, Ticket, User, Settings, Sun, Moon, 
  Crown, Palette, LogOut, DollarSign
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const { toggleTheme, user, withdraw } = useGameState();
  const [activeTab, setActiveTab] = useState("mining");
  const [location, setLocation] = useLocation();
  
  // Прокрутка к соответствующей секции (только на главной странице)
  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      setLocation('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setActiveTab(sectionId);
  };
  
  // Локализованные тексты для разных языков
  const translations: Record<string, Record<string, string>> = {
    "en": {
      "home": "Home",
      "videos": "Videos",
      "profile": "Profile",
      "premium": "Premium",
      "skins": "Skins",
      "settings": "Settings",
      "withdraw": "Withdraw"
    },
    "ru": {
      "home": "Главная",
      "videos": "Видео",
      "profile": "Профиль",
      "premium": "Премиум",
      "skins": "Скины",
      "settings": "Настройки",
      "withdraw": "Вывод"
    },
    "es": {
      "home": "Inicio",
      "videos": "Videos",
      "profile": "Perfil",
      "premium": "Premium",
      "skins": "Skins",
      "settings": "Ajustes",
      "withdraw": "Retirar"
    },
    "zh": {
      "home": "首页",
      "videos": "视频",
      "profile": "个人资料",
      "premium": "高级版",
      "skins": "皮肤",
      "settings": "设置",
      "withdraw": "提现"
    },
    "kk": {
      "home": "Басты",
      "videos": "Бейнелер",
      "profile": "Профиль",
      "premium": "Премиум",
      "skins": "Скиндер",
      "settings": "Параметрлер",
      "withdraw": "Шығару"
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
  
  // Навигация к странице премиум
  const goToPremium = () => {
    setLocation('/premium');
    setActiveTab('premium');
  };
  
  // Навигация к странице скинов
  const goToSkins = () => {
    setLocation('/skins');
    setActiveTab('skins');
  };

  // Отображаем разные панели навигации в зависимости от текущей страницы
  if (location === '/auth') {
    return null; // На странице авторизации нет нижней навигации
  }
  
  if (location === '/premium') {
    // Специальная навигация на странице премиум
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around py-2 z-40">
        <Link 
          href="/"
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">{getText("home")}</span>
        </Link>
        
        <button 
          onClick={handleProfileClick}
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
        >
          <DollarSign className="h-6 w-6" />
          <span className="text-xs mt-1">{getText("withdraw")}</span>
        </button>
        
        <button 
          onClick={goToSkins}
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
        >
          <Palette className="h-6 w-6" />
          <span className="text-xs mt-1">{getText("skins")}</span>
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
  
  if (location === '/skins') {
    // Специальная навигация на странице скинов
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around py-2 z-40">
        <Link 
          href="/"
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">{getText("home")}</span>
        </Link>
        
        <button 
          onClick={goToPremium}
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
        >
          <Crown className="h-6 w-6" />
          <span className="text-xs mt-1">{getText("premium")}</span>
        </button>
        
        <button 
          onClick={handleProfileClick}
          className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
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

  // Основная навигация на главной странице и других
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
        onClick={goToPremium}
        className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400 relative"
      >
        <Crown className="h-6 w-6 text-amber-500" />
        <span className="text-xs mt-1">{getText("premium")}</span>
        {!user.isPremium && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            !
          </span>
        )}
      </button>
      
      <button 
        onClick={goToSkins}
        className="p-2 rounded-full flex flex-col items-center text-gray-500 dark:text-gray-400"
      >
        <Palette className="h-6 w-6" />
        <span className="text-xs mt-1">{getText("skins")}</span>
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
