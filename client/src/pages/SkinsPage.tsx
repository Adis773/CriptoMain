import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, Lock, DollarSign, Sparkles, Award, StarIcon, Check, 
  AlertTriangle, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useGameState } from "@/lib/gameState";
import { Link } from "wouter";

// Определяем типы для скинов
interface Skin {
  id: number;
  skinId: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  miningBonus: string;
  clickBonus: number;
  isPremium: boolean;
  price: string | null;
  owned: boolean;
}

// Компонент для отображения скинов
export default function SkinsPage() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [userSkins, setUserSkins] = useState<Skin[]>([]);
  const [selectedSkinId, setSelectedSkinId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [skinLoading, setSkinLoading] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { user } = useGameState();
  
  // Загрузка скинов при монтировании компонента
  useEffect(() => {
    fetchSkins();
  }, []);
  
  // Функция для загрузки скинов
  const fetchSkins = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/skins');
      if (response.ok) {
        const data = await response.json();
        setSkins(data);
        
        // Если у пользователя уже есть выбранный скин, устанавливаем его
        if (user?.selectedSkin) {
          setSelectedSkinId(user.selectedSkin);
        } else if (data.length > 0) {
          // Иначе выбираем первый доступный скин
          const defaultSkin = data.find(skin => skin.owned) || data[0];
          setSelectedSkinId(defaultSkin.skinId);
        }
      }
      
      // Загружаем скины пользователя
      const userSkinsResponse = await apiRequest('GET', `/api/users/${user?.id}/skins`);
      if (userSkinsResponse.ok) {
        const userSkinsData = await userSkinsResponse.json();
        setUserSkins(userSkinsData);
      }
    } catch (error) {
      console.error('Error fetching skins:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить скины",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Функция выбора скина
  const selectSkin = async (skinId: string) => {
    // Проверяем, владеет ли пользователь этим скином
    const skin = skins.find(s => s.skinId === skinId);
    if (!skin || !skin.owned) {
      toast({
        title: "Ошибка",
        description: "Вы не владеете этим скином",
        variant: "destructive"
      });
      return;
    }
    
    setSkinLoading(true);
    try {
      const response = await apiRequest('POST', `/api/users/${user?.id}/select-skin`, { skinId });
      if (response.ok) {
        const data = await response.json();
        setSelectedSkinId(skinId);
        toast({
          title: "Успех",
          description: "Скин успешно выбран",
        });
      }
    } catch (error) {
      console.error('Error selecting skin:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выбрать скин",
        variant: "destructive"
      });
    } finally {
      setSkinLoading(false);
    }
  };
  
  // Функция покупки скина
  const buySkin = async (skinId: string) => {
    const skin = skins.find(s => s.skinId === skinId);
    if (!skin) return;
    
    // Проверяем, требуется ли премиум
    if (skin.isPremium && !user?.isPremium) {
      toast({
        title: "Только для премиум",
        description: "Этот скин доступен только для премиум-пользователей",
        variant: "destructive"
      });
      return;
    }
    
    // Проверяем, может ли пользователь приобрести скин
    if (skin.price && parseFloat(skin.price) > parseFloat(user?.balance || "0")) {
      toast({
        title: "Недостаточно средств",
        description: "У вас недостаточно средств для покупки этого скина",
        variant: "destructive"
      });
      return;
    }
    
    setSkinLoading(true);
    try {
      const response = await apiRequest('POST', `/api/users/${user?.id}/skins`, { skinId });
      if (response.ok) {
        const data = await response.json();
        
        // Обновляем список скинов
        fetchSkins();
        
        toast({
          title: "Успех",
          description: "Скин успешно приобретен",
        });
      }
    } catch (error) {
      console.error('Error buying skin:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось приобрести скин",
        variant: "destructive"
      });
    } finally {
      setSkinLoading(false);
    }
  };
  
  // Получение цвета для редкости скина
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      case 'epic':
        return 'bg-purple-500 text-white';
      case 'legendary':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Получение текста для редкости скина
  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'Обычный';
      case 'rare':
        return 'Редкий';
      case 'epic':
        return 'Эпический';
      case 'legendary':
        return 'Легендарный';
      default:
        return 'Обычный';
    }
  };
  
  // Генерация градиента для редкости скина
  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-300 to-gray-500';
      case 'rare':
        return 'from-blue-300 to-blue-600';
      case 'epic':
        return 'from-purple-300 to-purple-600';
      case 'legendary':
        return 'from-amber-300 to-amber-600';
      default:
        return 'from-gray-300 to-gray-500';
    }
  };
  
  // Получение выбранного скина
  const getSelectedSkin = () => {
    return skins.find(skin => skin.skinId === selectedSkinId);
  };
  
  // Фильтрация скинов по категории
  const getFilteredSkins = () => {
    switch (activeTab) {
      case 'all':
        return skins;
      case 'owned':
        return skins.filter(skin => skin.owned);
      case 'available':
        return skins.filter(skin => !skin.owned && (!skin.isPremium || user?.isPremium));
      case 'premium':
        return skins.filter(skin => skin.isPremium);
      default:
        return skins;
    }
  };
  
  // Рендеринг карточки скина
  const renderSkinCard = (skin: Skin) => {
    const isSelected = selectedSkinId === skin.skinId;
    const isPremiumLocked = skin.isPremium && !user?.isPremium;
    const isOwned = skin.owned;
    
    return (
      <Card 
        key={skin.skinId}
        className={`overflow-hidden transition-shadow ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg' 
            : 'hover:shadow-md'
        } ${isPremiumLocked ? 'opacity-70' : ''}`}
      >
        <div 
          className={`h-40 bg-gradient-to-r ${getRarityGradient(skin.rarity)} relative`}
        >
          {/* Здесь может быть изображение скина */}
          <div className="absolute inset-0 flex items-center justify-center">
            {skin.imageUrl ? (
              <img 
                src={skin.imageUrl} 
                alt={skin.name} 
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center">
                <StarIcon className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-1">
            <Badge className={getRarityColor(skin.rarity)}>
              {getRarityText(skin.rarity)}
            </Badge>
            
            {skin.isPremium && (
              <Badge className="bg-amber-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Премиум
              </Badge>
            )}
            
            {isOwned && (
              <Badge className="bg-green-500 text-white">
                <Check className="h-3 w-3 mr-1" />
                Ваш
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{skin.name}</span>
            {isPremiumLocked && <Lock className="h-4 w-4 text-gray-400" />}
          </CardTitle>
          <CardDescription>{skin.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 pb-2">
          <div className="space-y-1 text-sm">
            {parseFloat(skin.miningBonus) > 0 && (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Sparkles className="h-4 w-4 mr-1" />
                <span>+{parseFloat(skin.miningBonus) * 100}% к майнингу</span>
              </div>
            )}
            
            {skin.clickBonus > 0 && (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Award className="h-4 w-4 mr-1" />
                <span>+{skin.clickBonus} к количеству кликов</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          {isOwned ? (
            <Button 
              variant={isSelected ? "default" : "outline"} 
              className="w-full"
              onClick={() => selectSkin(skin.skinId)}
              disabled={skinLoading || isSelected}
            >
              {isSelected ? "Выбрано" : "Выбрать"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => buySkin(skin.skinId)}
              disabled={skinLoading || isPremiumLocked}
            >
              {skin.price ? (
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {skin.price}
                </span>
              ) : (
                "Получить"
              )}
              {isPremiumLocked && (
                <span className="ml-2 flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  Премиум
                </span>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  // Рендеринг информации о выбранном скине
  const renderSelectedSkinInfo = () => {
    const skin = getSelectedSkin();
    if (!skin) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full mr-2 bg-gradient-to-r ${getRarityGradient(skin.rarity)} flex items-center justify-center`}
            >
              <StarIcon className="h-4 w-4 text-white" />
            </div>
            {skin.name}
            <Badge className={`ml-2 ${getRarityColor(skin.rarity)}`}>
              {getRarityText(skin.rarity)}
            </Badge>
          </CardTitle>
          <CardDescription>{skin.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                {skin.imageUrl ? (
                  <img 
                    src={skin.imageUrl} 
                    alt={skin.name} 
                    className="w-24 sm:w-32 h-24 sm:h-32 object-contain"
                  />
                ) : (
                  <div className="w-24 sm:w-32 h-24 sm:h-32 bg-black/10 rounded-full flex items-center justify-center">
                    <StarIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">Характеристики:</h3>
                <ul className="space-y-2 mt-2">
                  {parseFloat(skin.miningBonus) > 0 && (
                    <li className="flex items-center text-green-600 dark:text-green-400">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>+{parseFloat(skin.miningBonus) * 100}% к добыче при майнинге</span>
                    </li>
                  )}
                  
                  {skin.clickBonus > 0 && (
                    <li className="flex items-center text-blue-600 dark:text-blue-400">
                      <Award className="h-4 w-4 mr-2" />
                      <span>+{skin.clickBonus} дополнительных кликов в день</span>
                    </li>
                  )}
                  
                  {skin.isPremium && (
                    <li className="flex items-center text-amber-600 dark:text-amber-400">
                      <Crown className="h-4 w-4 mr-2" />
                      <span>Премиум скин</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {skin.isPremium && !user?.isPremium && (
              <Alert className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-400">Требуется премиум</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  Этот скин доступен только для премиум-пользователей.
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-1 text-amber-600 dark:text-amber-400"
                    asChild
                  >
                    <Link to="/premium">Активировать премиум</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[500px]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          Скины
        </h1>
        <Separator className="my-4" />
      </div>
      
      {renderSelectedSkinInfo()}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="owned">Мои скины</TabsTrigger>
            <TabsTrigger value="available">Доступные</TabsTrigger>
            <TabsTrigger value="premium">Премиум</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/premium">
              <Crown className="h-4 w-4 mr-2" />
              Премиум скины
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getFilteredSkins().map(renderSkinCard)}
        </div>
        
        {getFilteredSkins().length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Info className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">Нет доступных скинов</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              В этой категории пока нет скинов
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
}