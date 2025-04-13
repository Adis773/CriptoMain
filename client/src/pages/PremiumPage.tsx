import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Check, CreditCard, Star, Zap, Gift, Clock, Award, Shield, DollarSign, 
  Heart, ChevronsUp, Calendar, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useGameState } from "@/lib/gameState";
import { formatDate } from "@shared/utils";

// Типы для платежных методов и статуса премиум
interface PaymentMethod {
  id: string;
  name: string;
  phone: string;
  instructions: string;
}

interface PremiumInfo {
  isPremium: boolean;
  expiryDate: string | null;
  benefits: {
    miningMultiplier: string;
    dailyClicks: number;
    referralBonus: string;
    exclusiveSkins: boolean;
  }
}

interface PriceInfo {
  monthly: number;
  quarterly: number;
  yearly: number;
}

// Компонент премиум-страницы
export default function PremiumPage() {
  const [premiumInfo, setPremiumInfo] = useState<PremiumInfo | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('monthly');
  const [prices, setPrices] = useState<PriceInfo>({ monthly: 2500, quarterly: 7000, yearly: 25000 });
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [showPaymentSent, setShowPaymentSent] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  const { toast } = useToast();
  const { user } = useGameState();
  
  // Загрузка информации о премиум-статусе и способах оплаты
  useEffect(() => {
    const fetchPremiumInfo = async () => {
      try {
        const response = await apiRequest('GET', '/api/premium/status');
        if (response.ok) {
          const data = await response.json();
          setPremiumInfo(data);
        }
      } catch (error) {
        console.error('Error fetching premium info:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о премиум-статусе",
          variant: "destructive"
        });
      }
    };
    
    const fetchPaymentMethods = async () => {
      try {
        const response = await apiRequest('GET', '/api/premium/payment-info');
        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data.methods);
          setPrices(data.price);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о способах оплаты",
          variant: "destructive"
        });
      }
    };
    
    fetchPremiumInfo();
    fetchPaymentMethods();
  }, [toast]);
  
  // Сопоставление периода подписки с количеством месяцев
  const durationToMonths = {
    monthly: 1,
    quarterly: 3,
    yearly: 12
  };
  
  // Функция активации премиум-подписки
  const activatePremium = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите способ оплаты",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const months = durationToMonths[selectedDuration as keyof typeof durationToMonths];
      const response = await apiRequest('POST', '/api/premium/activate', {
        months,
        paymentMethod: selectedPaymentMethod
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Показываем подтверждение платежа
        setShowPaymentConfirmation(true);
        setIsLoading(false);
      } else {
        throw new Error('Failed to activate premium');
      }
    } catch (error) {
      console.error('Error activating premium:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось активировать премиум-подписку",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Функция подтверждения оплаты
  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ID транзакции",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь должна быть проверка платежа через API Kaspi
      // Мы имитируем успешную проверку
      setTimeout(() => {
        setShowPaymentSent(true);
        setShowPaymentConfirmation(false);
        setIsLoading(false);
        
        // Перезагружаем информацию о премиум-статусе
        apiRequest('GET', '/api/premium/status')
          .then(response => response.json())
          .then(data => setPremiumInfo(data))
          .catch(error => console.error('Error reloading premium info:', error));
      }, 1500);
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось подтвердить оплату",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Получение текущего способа оплаты
  const getCurrentPaymentMethod = () => {
    return paymentMethods.find(method => method.id === selectedPaymentMethod);
  };
  
  // Получение текущей цены подписки
  const getCurrentPrice = () => {
    return prices[selectedDuration as keyof PriceInfo];
  };
  
  // Рендеринг премиум-кнопок и информации
  const renderPremiumButtons = () => {
    if (premiumInfo?.isPremium) {
      return (
        <div className="space-y-6">
          <Alert className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-400">
            <Award className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">Премиум-статус активен!</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Ваша подписка действительна до {premiumInfo.expiryDate ? formatDate(new Date(premiumInfo.expiryDate)) : 'неопределенной даты'}.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Увеличенная добыча
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                  +{(Number(premiumInfo.benefits.miningMultiplier) - 1) * 100}%
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  к заработку при майнинге
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Больше кликов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                  {premiumInfo.benefits.dailyClicks}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  кликов в день
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Реферальный бонус
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                  {premiumInfo.benefits.referralBonus}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  от заработка рефералов
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Продлить подписку</CardTitle>
              <CardDescription>
                Продлите вашу премиум-подписку, чтобы не потерять преимущества
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly" className="w-full" onValueChange={setSelectedDuration}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="monthly">Месяц</TabsTrigger>
                  <TabsTrigger value="quarterly">3 месяца</TabsTrigger>
                  <TabsTrigger value="yearly">Год</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Месячная подписка</CardTitle>
                      <CardDescription>Оплата помесячно</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-3xl font-bold">{prices.monthly} тг/мес</p>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Продлить</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="quarterly" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Квартальная подписка
                        <Badge className="ml-2 bg-amber-500">Выгодно</Badge>
                      </CardTitle>
                      <CardDescription>7% скидка</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-3xl font-bold">
                        {prices.quarterly} тг
                        <span className="text-lg text-gray-500 line-through ml-2">{prices.monthly * 3}</span>
                      </p>
                      <p className="text-lg text-gray-600">{Math.round(prices.quarterly / 3)} тг/мес</p>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Продлить</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="yearly" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Годовая подписка
                        <Badge className="ml-2 bg-green-500">Лучшая цена</Badge>
                      </CardTitle>
                      <CardDescription>16% скидка</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-3xl font-bold">
                        {prices.yearly} тг
                        <span className="text-lg text-gray-500 line-through ml-2">{prices.monthly * 12}</span>
                      </p>
                      <p className="text-lg text-gray-600">{Math.round(prices.yearly / 12)} тг/мес</p>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Дополнительные скины</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Продлить</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Для не-премиум пользователей
    return (
      <div className="space-y-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Улучшите свой игровой опыт с Премиум!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Получите больше возможностей, больше монет и уникальные скины с премиум-подпиской!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-gray-500" />
                Обычный аккаунт
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Базовый заработок при майнинге
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  100 кликов в день
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  5% бонус от заработка рефералов
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Стандартные скины
                </li>
              </ul>
            </div>
            
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 shadow-md border border-amber-200 dark:border-amber-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-500 to-yellow-500 text-white text-xs py-1 px-3 rounded-bl-lg font-semibold">
                Рекомендуем
              </div>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-amber-800 dark:text-amber-400">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Премиум аккаунт
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-amber-500" />
                  <strong>+50% к заработку при майнинге</strong>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-amber-500" />
                  <strong>200 кликов в день</strong>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-amber-500" />
                  <strong>10% бонус от заработка рефералов</strong>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-amber-500" />
                  <strong>Эксклюзивные премиум-скины</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="monthly" className="w-full" onValueChange={setSelectedDuration}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="monthly">Месяц</TabsTrigger>
            <TabsTrigger value="quarterly">3 месяца</TabsTrigger>
            <TabsTrigger value="yearly">Год</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Месячная подписка</CardTitle>
                <CardDescription>Оплата помесячно</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold">{prices.monthly} тг/мес</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Активировать</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="quarterly" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  Квартальная подписка
                  <Badge className="ml-2 bg-amber-500">Выгодно</Badge>
                </CardTitle>
                <CardDescription>7% скидка</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold">
                  {prices.quarterly} тг
                  <span className="text-lg text-gray-500 line-through ml-2">{prices.monthly * 3}</span>
                </p>
                <p className="text-lg text-gray-600">{Math.round(prices.quarterly / 3)} тг/мес</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Активировать</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  Годовая подписка
                  <Badge className="ml-2 bg-green-500">Лучшая цена</Badge>
                </CardTitle>
                <CardDescription>16% скидка</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold">
                  {prices.yearly} тг
                  <span className="text-lg text-gray-500 line-through ml-2">{prices.monthly * 12}</span>
                </p>
                <p className="text-lg text-gray-600">{Math.round(prices.yearly / 12)} тг/мес</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Увеличенная добыча (+50%)</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 200 кликов в день</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 10% реферальный бонус</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Дополнительные скины</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setShowPaymentConfirmation(true)}>Активировать</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Модальное окно подтверждения оплаты
  const renderPaymentConfirmation = () => {
    const paymentMethod = getCurrentPaymentMethod();
    const price = getCurrentPrice();
    const months = durationToMonths[selectedDuration as keyof typeof durationToMonths];
    
    if (!paymentMethod) {
      return (
        <Card className="max-w-md mx-auto p-6">
          <CardHeader>
            <CardTitle>Выберите способ оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{method.instructions}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowPaymentConfirmation(false)}>
              Отмена
            </Button>
            <Button 
              disabled={!selectedPaymentMethod || isLoading} 
              onClick={() => activatePremium()}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  <span>Загрузка...</span>
                </div>
              ) : (
                "Продолжить"
              )}
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    return (
      <Card className="max-w-md mx-auto p-6">
        <CardHeader>
          <CardTitle>Информация об оплате</CardTitle>
          <CardDescription>
            Премиум-подписка на {months} {months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Способ оплаты</p>
              <p className="font-medium">{paymentMethod.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{paymentMethod.instructions}</p>
              <div className="mt-3 font-mono text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                <p className="font-medium">Телефон для перевода:</p>
                <p className="text-amber-800 dark:text-amber-300">{paymentMethod.phone}</p>
              </div>
            </div>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between">
                <span>Стоимость подписки</span>
                <span className="font-medium">{price} тг</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium">После оплаты:</p>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-sm">
                <p className="text-amber-800 dark:text-amber-300">
                  1. Отправьте деньги на указанный номер телефона через {paymentMethod.name}
                </p>
                <p className="text-amber-800 dark:text-amber-300 mt-1">
                  2. Введите ID транзакции или последние 4 цифры вашего телефона для проверки
                </p>
              </div>
              <input
                type="text"
                placeholder="ID транзакции или последние 4 цифры телефона"
                className="w-full p-2 border rounded"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowPaymentConfirmation(false)}>
            Отмена
          </Button>
          <Button 
            onClick={confirmPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span>Проверка...</span>
              </div>
            ) : (
              "Подтвердить оплату"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Модальное окно успешной оплаты
  const renderPaymentSuccess = () => (
    <Card className="max-w-md mx-auto p-6">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center">Платеж отправлен!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Ваш платеж находится в обработке. Премиум-статус будет активирован в течение нескольких минут.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => setShowPaymentSent(false)}>
          Продолжить
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Award className="mr-3 h-8 w-8 text-amber-500" />
          Премиум
        </h1>
        <Separator className="my-4" />
      </div>
      
      {showPaymentConfirmation && renderPaymentConfirmation()}
      {showPaymentSent && renderPaymentSuccess()}
      {!showPaymentConfirmation && !showPaymentSent && renderPremiumButtons()}
    </div>
  );
}