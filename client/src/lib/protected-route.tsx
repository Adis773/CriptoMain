import { useEffect } from 'react';
import { Redirect, Route, useLocation } from 'wouter';
import { useGameState } from './gameState';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
}

/**
 * Компонент защищенного маршрута, который проверяет авторизацию
 * пользователя и перенаправляет на страницу авторизации, если
 * пользователь не авторизован.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  path 
}) => {
  const { isRegistered, user } = useGameState();
  const [, setLocation] = useLocation();
  
  // Проверка авторизации
  useEffect(() => {
    // Если пользователь не авторизован, перенаправляем на страницу авторизации
    if (!isRegistered && !localStorage.getItem('auth_token')) {
      setLocation('/auth');
    }
  }, [isRegistered, setLocation]);
  
  // Если идет проверка авторизации, показываем индикатор загрузки
  if (!isRegistered && !localStorage.getItem('auth_token')) {
    return (
      <Route path={path}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Route>
    );
  }
  
  // Если пользователь авторизован, отображаем защищенный компонент
  return (
    <Route path={path} component={Component} />
  );
};

/**
 * Компонент защищенного премиум-маршрута, который проверяет наличие
 * премиум-подписки и перенаправляет на страницу премиум, если
 * пользователь не имеет премиум-подписки.
 */
export const PremiumRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  path 
}) => {
  const { isRegistered, user } = useGameState();
  
  // Сначала проверяем авторизацию
  if (!isRegistered) {
    return <Redirect to="/auth" />;
  }
  
  // Затем проверяем наличие премиум-подписки
  if (!user?.isPremium) {
    return <Redirect to="/premium" />;
  }
  
  // Если пользователь авторизован и имеет премиум, отображаем защищенный компонент
  return (
    <Route path={path} component={Component} />
  );
};