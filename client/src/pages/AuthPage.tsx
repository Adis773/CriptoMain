import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Key, Mail, Phone, ArrowRight, LogIn, UserPlus, ScanFace, 
  Check, Smartphone, Gift, Crown 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/lib/gameState";
import { useLocation } from "wouter";
import { generateRandomReferralId } from "@shared/utils";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Данные формы для входа
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Данные формы для регистрации
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerReferrer, setRegisterReferrer] = useState('');
  const [registerLanguage, setRegisterLanguage] = useState('ru');
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { register } = useGameState();
  
  // Обработчик входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginPhone || !loginPassword) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        phone: loginPhone,
        password: loginPassword
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Здесь должна быть логика авторизации с использованием useAuth из AuthContext
        // Для демонстрации используем текущий gameState
        register(userData.username, userData.phone, userData.language);
        
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${userData.username}!`
        });
        
        // Перенаправляем на главную страницу
        setLocation('/');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка входа');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверный номер телефона или пароль",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработчик регистрации
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername || !registerPhone || !registerPassword) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Генерируем случайный referralId, если не был передан через URL
      const referralId = generateRandomReferralId();
      
      const response = await apiRequest('POST', '/api/auth/register', {
        username: registerUsername,
        phone: registerPhone,
        password: registerPassword,
        email: registerEmail || undefined,
        referralId,
        referrerCode: registerReferrer || undefined,
        language: registerLanguage || 'ru'
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Регистрируем пользователя и уведомляем об успехе
        register(userData.username, userData.phone, userData.language);
        
        toast({
          title: "Успешная регистрация",
          description: `Добро пожаловать, ${userData.username}!`
        });
        
        // Перенаправляем на главную страницу
        setLocation('/');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка регистрации');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрировать аккаунт",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Получаем реферальный код из URL-параметров
  const getRefCodeFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('ref') || '';
    }
    return '';
  };
  
  // При монтировании компонента проверяем наличие ref в URL
  useState(() => {
    const refCode = getRefCodeFromUrl();
    if (refCode) {
      setRegisterReferrer(refCode);
      setActiveTab('register');
    }
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-gray-100 dark:from-background dark:to-gray-900">
      <div className="container flex flex-col md:flex-row w-full max-w-5xl p-4 md:p-0">
        {/* Левая колонка - форма авторизации */}
        <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Вход
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Регистрация
              </TabsTrigger>
            </TabsList>
            
            {/* Вкладка входа */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Вход в аккаунт</CardTitle>
                  <CardDescription>
                    Войдите в свой аккаунт, чтобы продолжить
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Номер телефона</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="phone"
                          placeholder="+7 (777) 123-4567"
                          className="pl-10"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Вход...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Войти <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {/* Вкладка регистрации */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Регистрация аккаунта</CardTitle>
                  <CardDescription>
                    Создайте новый аккаунт для начала игры
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Имя пользователя <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="username"
                          placeholder="username"
                          className="pl-10"
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Номер телефона <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="reg-phone"
                          placeholder="+7 (777) 123-4567"
                          className="pl-10"
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Пароль <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (опционально)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@gmail.com"
                          className="pl-10"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referrer">Реферальный код (опционально)</Label>
                      <div className="relative">
                        <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          id="referrer"
                          placeholder="Реферальный код друга"
                          className="pl-10"
                          value={registerReferrer}
                          onChange={(e) => setRegisterReferrer(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Регистрация...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Зарегистрироваться <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Правая колонка - информация */}
        <div className="w-full md:w-1/2 md:pl-4 flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white rounded-xl p-8 w-full">
            <h2 className="text-3xl font-bold mb-6">CriptoMain</h2>
            <p className="text-xl opacity-90 mb-8">Играй, смотри, кайфуй и получай кучу бабла!</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <span>Майните криптовалюту простыми кликами</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <span>Получайте до $60 виртуальной валюты ежедневно</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <span>Приглашайте друзей и получайте бонусы</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <span>Просматривайте актуальные тренды в TikTok и YouTube</span>
              </li>
            </ul>
            
            <div className="mt-10 p-4 bg-white/10 rounded-lg">
              <div className="flex items-center">
                <Crown className="w-6 h-6 mr-3 text-amber-300" />
                <h3 className="text-lg font-semibold">Премиум-возможности</h3>
              </div>
              <p className="mt-2 opacity-90">
                Активируйте премиум-подписку и получите доступ к эксклюзивным скинам и множителям заработка!
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center">
                  <div className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0">+</div>
                  <span className="opacity-90">Увеличенный заработок на 50%</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0">+</div>
                  <span className="opacity-90">200 кликов в день вместо 100</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0">+</div>
                  <span className="opacity-90">Эксклюзивные скины для майнера</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}