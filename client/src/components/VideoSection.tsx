import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, Send, Play } from "lucide-react";
import { useGameState } from "@/lib/gameState";

// Массив данных для TikTok видео
const tikTokVideos = [
  {
    id: 1,
    author: "cryptoexpert",
    description: "Как заработать на майнинге в 2025! 🚀💰 #crypto #mining #bitcoin",
    likes: "143.5K",
    comments: "2.8K",
    shares: "12.4K",
    thumbnail: "gradient-bg-1",
  },
  {
    id: 2,
    author: "moneyminer",
    description: "Секрет успеха в криптовалюте - начинай майнить прямо сейчас! 💯 #tips #cryptomining",
    likes: "87.3K",
    comments: "1.5K",
    shares: "9.2K",
    thumbnail: "gradient-bg-2",
  },
  {
    id: 3,
    author: "cryptoking",
    description: "10 способов увеличить заработок на майнинге! Проверено! 👑 #earnings #crypto",
    likes: "231.7K",
    comments: "5.4K",
    shares: "34.1K",
    thumbnail: "gradient-bg-3",
  },
  {
    id: 4,
    author: "digitalcrypto",
    description: "Новые технологии в майнинге 2025 года! 🔥 #techmining #future",
    likes: "56.9K",
    comments: "982",
    shares: "7.3K",
    thumbnail: "gradient-bg-4",
  },
  {
    id: 5,
    author: "cryptowhale",
    description: "От нуля до миллиона - мой путь в криптомайнинге! 💼 #success #story",
    likes: "189.2K",
    comments: "3.7K",
    shares: "26.5K",
    thumbnail: "gradient-bg-5",
  },
];

// Массив данных для YouTube видео
const youtubeVideos = [
  {
    id: 1,
    title: "Полное руководство по майнингу в 2025",
    channel: "CryptoGuide",
    views: "1.2M просмотров",
    uploaded: "3 дня назад",
    thumbnail: "gradient-bg-6",
    duration: "15:28",
  },
  {
    id: 2,
    title: "ТОП-10 криптовалют для инвестирования",
    channel: "InvestPro",
    views: "876K просмотров",
    uploaded: "1 неделю назад",
    thumbnail: "gradient-bg-7",
    duration: "12:45",
  },
  {
    id: 3,
    title: "Как настроить майнинг-ферму с нуля",
    channel: "TechMaster",
    views: "1.5M просмотров",
    uploaded: "2 недели назад",
    thumbnail: "gradient-bg-8",
    duration: "28:13",
  },
  {
    id: 4,
    title: "Секреты майнинга, о которых не говорят!",
    channel: "CryptoSecrets",
    views: "2.3M просмотров",
    uploaded: "5 дней назад",
    thumbnail: "gradient-bg-9",
    duration: "19:57",
  }
];

// Компонент отображения видео в стиле TikTok
function TikTokVideoItem({ video, isActive }: { video: typeof tikTokVideos[0], isActive: boolean }) {
  return (
    <div className="relative w-full h-[calc(100vh-240px)] min-h-[500px] bg-black rounded-xl overflow-hidden">
      <div className={`absolute inset-0 ${video.thumbnail === "gradient-bg-1" ? "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500" :
                                          video.thumbnail === "gradient-bg-2" ? "bg-gradient-to-br from-green-500 via-teal-500 to-blue-500" :
                                          video.thumbnail === "gradient-bg-3" ? "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500" :
                                          video.thumbnail === "gradient-bg-4" ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" :
                                          "bg-gradient-to-br from-red-500 via-pink-500 to-purple-500"}`}>
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* TikTok UI элементы */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="font-bold">@{video.author}</p>
            <p className="text-sm mt-2">{video.description}</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 ml-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <img 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${video.author}`} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8" />
              <span className="text-xs mt-1">{video.likes}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8" />
              <span className="text-xs mt-1">{video.comments}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Share2 className="w-8 h-8" />
              <span className="text-xs mt-1">{video.shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент отображения видео в стиле YouTube
function YouTubeVideoItem({ video }: { video: typeof youtubeVideos[0] }) {
  return (
    <div className="flex flex-col mb-4">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <div className={`absolute inset-0 ${video.thumbnail === "gradient-bg-6" ? "bg-gradient-to-br from-blue-400 via-cyan-500 to-emerald-500" :
                                          video.thumbnail === "gradient-bg-7" ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" :
                                          video.thumbnail === "gradient-bg-8" ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" :
                                          "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500"}`}>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
            {video.duration}
          </div>
        </div>
      </div>
      
      <div className="flex mt-3">
        <div className="flex-shrink-0 mr-3">
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${video.channel}`} 
              alt="Channel Icon" 
              className="w-full h-full"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 dark:text-white">{video.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channel}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {video.views} • {video.uploaded}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const [activeTab, setActiveTab] = useState("tiktok");
  const [activeTikTokIndex, setActiveTikTokIndex] = useState(0);
  const { user } = useGameState();
  
  // Генерировать новые видео каждый час
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTikTokIndex((prev) => (prev + 1) % tikTokVideos.length);
    }, 3600000); // 1 час = 3600000 мс
    
    return () => clearInterval(interval);
  }, []);
  
  // Функция локализации в зависимости от выбранного языка
  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "en": {
        "social_media": "Social Media",
        "tiktok": "TikTok",
        "youtube": "YouTube",
        "tikTok_section_title": "Trending Crypto Videos",
        "youtube_section_title": "Recommended Crypto Channels",
        "comment_placeholder": "Add a comment...",
      },
      "ru": {
        "social_media": "Социальные сети",
        "tiktok": "ТикТок",
        "youtube": "Ютуб",
        "tikTok_section_title": "Популярные видео о криптовалюте",
        "youtube_section_title": "Рекомендуемые каналы о криптовалюте",
        "comment_placeholder": "Оставить комментарий...",
      },
      "es": {
        "social_media": "Redes Sociales",
        "tiktok": "TikTok",
        "youtube": "YouTube",
        "tikTok_section_title": "Videos de criptomonedas en tendencia",
        "youtube_section_title": "Canales de criptomonedas recomendados",
        "comment_placeholder": "Añadir un comentario...",
      },
      "zh": {
        "social_media": "社交媒体",
        "tiktok": "抖音",
        "youtube": "油管",
        "tikTok_section_title": "热门加密货币视频",
        "youtube_section_title": "推荐加密货币频道",
        "comment_placeholder": "添加评论...",
      }
    };
    
    // Язык по умолчанию - русский, если выбранный язык не поддерживается
    const lang = user.language && translations[user.language] ? user.language : "ru";
    return translations[lang][key] || translations["ru"][key];
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <Tabs defaultValue="tiktok" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-['Orbitron'] font-bold text-gray-800 dark:text-white">
              {activeTab === "tiktok" 
                ? getLocalizedText("tikTok_section_title")
                : getLocalizedText("youtube_section_title")}
            </h2>
            <TabsList className="grid grid-cols-2 w-[180px]">
              <TabsTrigger value="tiktok" className="text-xs">
                {getLocalizedText("tiktok")}
              </TabsTrigger>
              <TabsTrigger value="youtube" className="text-xs">
                {getLocalizedText("youtube")}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="tiktok" className="mt-0">
            <div className="flex flex-col items-center">
              <TikTokVideoItem 
                video={tikTokVideos[activeTikTokIndex]} 
                isActive={true} 
              />
              
              <div className="w-full mt-4 relative">
                <input
                  type="text"
                  placeholder={getLocalizedText("comment_placeholder")}
                  className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="youtube" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {youtubeVideos.map(video => (
                <YouTubeVideoItem key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
