import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, Send, Play, Music, Volume2, VolumeX, Clock, Bell, Upload, Bookmark, Flag, Share, DollarSign, Award, Eye, CheckCircle, Plus } from "lucide-react";
import { useGameState } from "@/lib/gameState";

// Массив данных для TikTok видео - реальные типы контента
const tikTokVideos = [
  {
    id: 1,
    author: "cryptoexpert",
    username: "@crypto.trends",
    verified: true,
    description: "Как заработать на майнинге в 2025! 🚀💰 #crypto #mining #bitcoin #eth #blockchain #earnmoney",
    likes: "1.4M",
    comments: "32.8K",
    shares: "192.4K",
    thumbnail: "gradient-bg-1",
    hashtags: ["crypto", "mining", "bitcoin", "ethereum", "blockchain", "tech"],
    song: "Money by Cardi B",
    songOwner: "Cardi B",
    followers: "2.8M",
    views: "12.4M",
    category: "technology",
  },
  {
    id: 2,
    author: "CoinMaster",
    username: "@coinmaster.official",
    verified: true,
    description: "Секрет успеха в криптовалюте - начинай майнить прямо сейчас! 💯 #tips #cryptomining #money #finance #mining #ETH",
    likes: "987.3K",
    comments: "18.5K",
    shares: "159.2K",
    thumbnail: "gradient-bg-2",
    hashtags: ["tips", "cryptomining", "money", "success", "crypto", "altcoins"],
    song: "Rich by Migos",
    songOwner: "Migos",
    followers: "1.9M",
    views: "7.6M",
    category: "finance",
  },
  {
    id: 3,
    author: "CryptoKing",
    username: "@crypto.king",
    verified: true,
    description: "10 способов увеличить заработок на майнинге! Проверено на личном опыте! 👑 #earnings #crypto #success #millionaire #wealth #invest",
    likes: "2.3M",
    comments: "45.4K",
    shares: "384.1K",
    thumbnail: "gradient-bg-3",
    hashtags: ["earnings", "crypto", "success", "millionaire", "mining", "wealth"],
    song: "Money Trees by Kendrick Lamar",
    songOwner: "Kendrick Lamar",
    followers: "3.7M",
    views: "19.2M",
    category: "business",
  },
  {
    id: 4,
    author: "Tech_Crypto",
    username: "@tech_crypto",
    verified: true,
    description: "Новые технологии в майнинге 2025 года! Революция в мире криптовалют 🔥 #techmining #future #innovation #gpu #asic #bitcoin",
    likes: "756.9K",
    comments: "19.8K",
    shares: "97.3K",
    thumbnail: "gradient-bg-4",
    hashtags: ["techmining", "future", "innovation", "technology", "bitcoin", "cryptocurrency"],
    song: "The Blaze - Territory",
    songOwner: "The Blaze",
    followers: "1.2M",
    views: "5.9M",
    category: "technology",
  },
  {
    id: 5,
    author: "BitcoinWhale",
    username: "@bitcoin.whale",
    verified: true,
    description: "От нуля до миллиона - мой путь в криптомайнинге! Мотивация, секреты и стратегии. 💼 #success #story #bitcoin #millionaire #mining #invest",
    likes: "1.89M",
    comments: "63.7K",
    shares: "326.5K",
    thumbnail: "gradient-bg-5",
    hashtags: ["success", "story", "bitcoin", "millionaire", "investing", "cryptocurrency"],
    song: "Drake - Started From The Bottom",
    songOwner: "Drake",
    followers: "4.5M",
    views: "22.3M",
    category: "lifestyle",
  },
  {
    id: 6,
    author: "ElonMuskFan",
    username: "@elon.updates",
    verified: false,
    description: "Что думает Илон Маск о майнинге в 2025? Шокирующие прогнозы! 😲 #elonmusk #tesla #bitcoin #dogecoin #spacex #future",
    likes: "3.2M",
    comments: "94.1K",
    shares: "582.7K",
    thumbnail: "gradient-bg-1",
    hashtags: ["elonmusk", "tesla", "bitcoin", "dogecoin", "spacex", "predictions"],
    song: "Elon Musk - Don't Doubt ur Vibe",
    songOwner: "Elon Musk",
    followers: "6.7M",
    views: "28.9M",
    category: "news",
  },
  {
    id: 7,
    author: "BlockchainGirl",
    username: "@blockchain.girl",
    verified: true,
    description: "День из жизни криптотрейдера: майнинг, трейдинг, анализ рынка 💪 #dailyroutine #trading #mining #crypto #wealth #hustle",
    likes: "954.2K",
    comments: "26.8K",
    shares: "113.5K",
    thumbnail: "gradient-bg-2",
    hashtags: ["dailyroutine", "trading", "mining", "crypto", "daytrading", "analysis"],
    song: "Boss B*tch by Doja Cat",
    songOwner: "Doja Cat",
    followers: "2.1M",
    views: "9.8M",
    category: "lifestyle",
  },
  {
    id: 8,
    author: "CryptoTeacher",
    username: "@crypto.academy",
    verified: true,
    description: "Урок 1: Основы майнинга для новичков. Сохрани, чтобы не потерять! 📝 #tutorial #beginners #mining #crypto #education #invest",
    likes: "1.7M",
    comments: "59.3K",
    shares: "472.8K",
    thumbnail: "gradient-bg-3",
    hashtags: ["tutorial", "beginners", "mining", "education", "cryptocurrency", "blockchain"],
    song: "Do It by Tory Lanez",
    songOwner: "Tory Lanez",
    followers: "3.4M",
    views: "16.2M",
    category: "education",
  },
  {
    id: 9,
    author: "CryptoMillennial",
    username: "@crypto.millennial",
    verified: false,
    description: "СРОЧНО! Майнинг Ethereum 2.0 взлетел на 1000%! Как успеть забрать свою прибыль? ⏰ #ethereum #eth2 #urgent #profit #mining #crypto",
    likes: "2.1M",
    comments: "78.6K",
    shares: "529.3K",
    thumbnail: "gradient-bg-4",
    hashtags: ["ethereum", "eth2", "urgent", "profit", "mining", "crypto"],
    song: "In Da Club by 50 Cent",
    songOwner: "50 Cent",
    followers: "2.9M",
    views: "14.5M",
    category: "finance",
  },
  {
    id: 10,
    author: "MiningGod",
    username: "@mining.god",
    verified: true,
    description: "Мой секретный алгоритм майнинга, который приносит $1000 в день 🤫 #algorithm #secret #mining #passive #income #bitcoin",
    likes: "3.5M",
    comments: "102.4K",
    shares: "691.7K",
    thumbnail: "gradient-bg-5",
    hashtags: ["algorithm", "secret", "mining", "passive", "income", "bitcoin"],
    song: "Sicko Mode by Travis Scott",
    songOwner: "Travis Scott",
    followers: "5.3M",
    views: "26.8M",
    category: "finance",
  },
];

// Массив данных для YouTube видео - реальные типы контента
const youtubeVideos = [
  {
    id: 1,
    title: "Полное руководство по майнингу криптовалюты в 2025 | Пошаговая инструкция для начинающих",
    channel: "CryptoGuide",
    channelImage: "cryptoguide",
    verified: true,
    views: "1.2M просмотров",
    uploaded: "3 дня назад",
    thumbnail: "gradient-bg-6",
    duration: "15:28",
    description: "В этом видео я расскажу обо всех аспектах майнинга криптовалюты в 2025 году. Вы узнаете какое оборудование выбрать, как настроить и оптимизировать свою майнинг-ферму, и как максимизировать прибыль.",
    subscribers: "2.4M",
    likes: "154K",
    dislikes: "2.1K",
    comments: [
      {
        author: "CryptoFan",
        text: "Спасибо за подробный гайд! Наконец-то разобрался с настройкой!",
        likes: "1.2K",
        time: "2 дня назад"
      },
      {
        author: "MiningPro",
        text: "А что насчет охлаждения? В летний период сложно держать нормальную температуру.",
        likes: "876",
        time: "1 день назад"
      }
    ],
    related: [2, 3, 8],
    category: "Technology"
  },
  {
    id: 2,
    title: "ТОП-10 криптовалют для майнинга и инвестирования в 2025 году | Мой личный рейтинг",
    channel: "InvestPro",
    channelImage: "investpro",
    verified: true,
    views: "876K просмотров",
    uploaded: "1 неделю назад",
    thumbnail: "gradient-bg-7",
    duration: "12:45",
    description: "В этом видео я делюсь своим личным рейтингом топ-10 криптовалют для майнинга и инвестирования в 2025 году. Рассказываю о перспективах развития, особенностях майнинга и потенциальной доходности каждой монеты.",
    subscribers: "1.8M",
    likes: "98K",
    dislikes: "1.5K",
    comments: [
      {
        author: "CryptoTrader",
        text: "Отличный анализ! Добавил бы еще пару альткоинов в список.",
        likes: "723",
        time: "6 дней назад"
      },
      {
        author: "InvestorNovice",
        text: "А что насчет RavenCoin? Она не вошла в топ?",
        likes: "541",
        time: "5 дней назад"
      }
    ],
    related: [1, 4, 7],
    category: "Finance"
  },
  {
    id: 3,
    title: "Как настроить майнинг-ферму с нуля в домашних условиях | Подробный туториал",
    channel: "TechMaster",
    channelImage: "techmaster",
    verified: true,
    views: "1.5M просмотров",
    uploaded: "2 недели назад",
    thumbnail: "gradient-bg-8",
    duration: "28:13",
    description: "В этом подробном руководстве я показываю, как собрать майнинг-ферму с нуля в домашних условиях. Выбор комплектующих, сборка, настройка программного обеспечения и оптимизация - всё в одном видео!",
    subscribers: "3.2M",
    likes: "187K",
    dislikes: "2.8K",
    comments: [
      {
        author: "HardwareFan",
        text: "Наконец-то понятное объяснение по подключению. Спасибо!",
        likes: "1.5K",
        time: "1 неделю назад"
      },
      {
        author: "MiningNewbie",
        text: "А какие видеокарты сейчас самые выгодные для майнинга?",
        likes: "986",
        time: "1 неделю назад"
      }
    ],
    related: [1, 6, 5],
    category: "Technology"
  },
  {
    id: 4,
    title: "Секреты майнинга, о которых не говорят! Как я зарабатываю $5000 в месяц",
    channel: "CryptoSecrets",
    channelImage: "cryptosecrets",
    verified: true,
    views: "2.3M просмотров",
    uploaded: "5 дней назад",
    thumbnail: "gradient-bg-9",
    duration: "19:57",
    description: "В этом видео я раскрываю малоизвестные секреты майнинга, о которых обычно умалчивают. Расскажу о нестандартных подходах, оптимизации оборудования и программных трюках, которые помогают мне зарабатывать до $5000 в месяц.",
    subscribers: "1.9M",
    likes: "213K",
    dislikes: "3.2K",
    comments: [
      {
        author: "ProfitHunter",
        text: "Вот это да! Попробовал твой метод - действительно работает!",
        likes: "2.1K",
        time: "3 дня назад"
      },
      {
        author: "SkepticalMiner",
        text: "Звучит слишком хорошо, чтобы быть правдой. Какие подводные камни?",
        likes: "1.2K",
        time: "2 дня назад"
      }
    ],
    related: [10, 5, 2],
    category: "Finance"
  },
  {
    id: 5,
    title: "Майнинг VS Стейкинг в 2025 - Что выгоднее? Детальное сравнение и анализ доходности",
    channel: "CryptoAnalytics",
    channelImage: "cryptoanalytics",
    verified: true,
    views: "1.8M просмотров",
    uploaded: "1 неделю назад",
    thumbnail: "gradient-bg-6",
    duration: "23:42",
    description: "В этом видео я провожу детальное сравнение майнинга и стейкинга в 2025 году. Анализирую доходность, риски, требуемые инвестиции и перспективы обоих методов заработка на криптовалюте.",
    subscribers: "2.1M",
    likes: "176K",
    dislikes: "2.3K",
    comments: [
      {
        author: "DiversifiedInvestor",
        text: "Отличный анализ! Я лично комбинирую оба подхода.",
        likes: "1.4K",
        time: "6 дней назад"
      },
      {
        author: "PassiveIncome",
        text: "Стейкинг однозначно выигрывает по соотношению усилий к прибыли!",
        likes: "927",
        time: "5 дней назад"
      }
    ],
    related: [2, 4, 9],
    category: "Education"
  },
  {
    id: 6,
    title: "Я построил майнинг-ферму в Арктике! Эксперимент с экстремальным охлаждением",
    channel: "TechExtremes",
    channelImage: "techextremes",
    verified: true,
    views: "3.4M просмотров",
    uploaded: "2 недели назад",
    thumbnail: "gradient-bg-7",
    duration: "34:17",
    description: "В этом экстремальном эксперименте я построил майнинг-ферму за полярным кругом, чтобы использовать естественное охлаждение Арктики. Показываю весь процесс от планирования до запуска и результаты работы.",
    subscribers: "4.7M",
    likes: "387K",
    dislikes: "4.1K",
    comments: [
      {
        author: "ExtremeEnthusiast",
        text: "Безумный проект! Но результаты впечатляют!",
        likes: "3.2K",
        time: "1 неделю назад"
      },
      {
        author: "ClimateConscious",
        text: "А как насчет экологического следа такого проекта?",
        likes: "2.1K",
        time: "1 неделю назад"
      }
    ],
    related: [3, 10, 1],
    category: "Technology"
  },
  {
    id: 7,
    title: "Налоги на майнинг криптовалют: полное руководство для майнеров в 2025 году",
    channel: "CryptoLawyer",
    channelImage: "cryptolawyer",
    verified: true,
    views: "967K просмотров",
    uploaded: "4 дня назад",
    thumbnail: "gradient-bg-8",
    duration: "26:35",
    description: "В этом подробном руководстве я объясняю всё, что нужно знать о налогообложении доходов от майнинга криптовалют в 2025 году. Рассказываю о законодательных нормах, способах легальной оптимизации и типичных ошибках.",
    subscribers: "1.3M",
    likes: "124K",
    dislikes: "1.7K",
    comments: [
      {
        author: "TaxPayer",
        text: "Наконец-то понятное объяснение этой запутанной темы!",
        likes: "932",
        time: "3 дня назад"
      },
      {
        author: "LegalMinded",
        text: "А как насчет международных операций? Если майнинг в одной стране, а вывод в другой?",
        likes: "758",
        time: "2 дня назад"
      }
    ],
    related: [9, 2, 4],
    category: "Education"
  },
  {
    id: 8,
    title: "Новейшие ASIC-майнеры 2025: обзор, тестирование и сравнение топ-5 моделей",
    channel: "HardwareGuru",
    channelImage: "hardwareguru",
    verified: true,
    views: "1.6M просмотров",
    uploaded: "6 дней назад",
    thumbnail: "gradient-bg-9",
    duration: "41:23",
    description: "В этом детальном обзоре я тестирую и сравниваю пять новейших ASIC-майнеров 2025 года. Измеряю энергопотребление, хешрейт, уровень шума и рассчитываю реальную окупаемость каждой модели.",
    subscribers: "2.8M",
    likes: "195K",
    dislikes: "2.4K",
    comments: [
      {
        author: "ASICenthusiast",
        text: "Отличный обзор! Модель X7-Pro действительно впечатляет своей эффективностью.",
        likes: "1.7K",
        time: "5 дней назад"
      },
      {
        author: "ElectricityConsumer",
        text: "А можно подробнее о потреблении модели B9 при разном хешрейте?",
        likes: "832",
        time: "4 дня назад"
      }
    ],
    related: [1, 3, 10],
    category: "Technology"
  },
  {
    id: 9,
    title: "История майнинга: от CPU до квантовых компьютеров | Эволюция технологий добычи криптовалют",
    channel: "CryptoHistorian",
    channelImage: "cryptohistorian",
    verified: true,
    views: "2.1M просмотров",
    uploaded: "2 недели назад",
    thumbnail: "gradient-bg-6",
    duration: "48:29",
    description: "В этом документальном видео я рассказываю об эволюции технологий майнинга криптовалют - от первых CPU-майнеров Bitcoin до современных ASIC и будущих квантовых систем. История, технологии и люди, изменившие индустрию.",
    subscribers: "3.5M",
    likes: "247K",
    dislikes: "3.1K",
    comments: [
      {
        author: "TechHistoryBuff",
        text: "Фантастический материал! Особенно интересен раздел о переходе от GPU к ASIC.",
        likes: "2.3K",
        time: "1 неделю назад"
      },
      {
        author: "OldSchoolMiner",
        text: "Я начинал майнить еще на CPU в 2011. Ностальгия...",
        likes: "1.9K",
        time: "1 неделю назад"
      }
    ],
    related: [5, 7, 2],
    category: "Education"
  },
  {
    id: 10,
    title: "Будущее майнинга: прогнозы на 2026-2030 годы | Технологии, тренды и возможности",
    channel: "FutureCrypto",
    channelImage: "futurecrypto",
    verified: true,
    views: "2.8M просмотров",
    uploaded: "3 дня назад",
    thumbnail: "gradient-bg-7",
    duration: "37:12",
    description: "В этом аналитическом видео я делюсь прогнозами о будущем майнинга на ближайшие 5 лет. Обсуждаю новые технологии, потенциальные изменения в экосистеме криптовалют и возможности для майнеров в меняющемся мире.",
    subscribers: "4.1M",
    likes: "312K",
    dislikes: "4.5K",
    comments: [
      {
        author: "FuturistMinded",
        text: "Невероятные прогнозы! Особенно интересно про квантовый майнинг!",
        likes: "2.6K",
        time: "2 дня назад"
      },
      {
        author: "SkepticalInvestor",
        text: "Интересно, но слишком оптимистично. Регуляторы могут сильно изменить картину.",
        likes: "1.8K",
        time: "1 день назад"
      }
    ],
    related: [9, 6, 4],
    category: "Technology"
  }
];

// Компонент отображения видео в стиле TikTok
function TikTokVideoItem({ video, isActive }: { video: typeof tikTokVideos[0], isActive: boolean }) {
  return (
    <div className="relative w-full h-[calc(100vh-240px)] min-h-[500px] bg-black rounded-xl overflow-hidden">
      {/* Фон видео с градиентом */}
      <div className={`absolute inset-0 ${video.thumbnail === "gradient-bg-1" ? "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500" :
                                          video.thumbnail === "gradient-bg-2" ? "bg-gradient-to-br from-green-500 via-teal-500 to-blue-500" :
                                          video.thumbnail === "gradient-bg-3" ? "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500" :
                                          video.thumbnail === "gradient-bg-4" ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" :
                                          "bg-gradient-to-br from-red-500 via-pink-500 to-purple-500"}`}>
        {/* Информация о просмотрах и живом эфире */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {video.views}
          </div>
          {Math.random() > 0.7 && (
            <div className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1"></span>
              LIVE
            </div>
          )}
        </div>
        
        {/* Кнопка воспроизведения */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Верхние элементы управления */}
      <div className="absolute top-4 right-4 flex space-x-3">
        <button className="bg-black/50 rounded-full p-2 text-white">
          <MoreHorizontal className="h-5 w-5" />
        </button>
        <button className="bg-black/50 rounded-full p-2 text-white">
          {Math.random() > 0.5 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Информация о музыке */}
      <div className="absolute bottom-32 left-4 right-20 bg-black/50 rounded-full px-3 py-1.5 flex items-center max-w-xs">
        <Music className="h-4 w-4 text-white mr-2 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="text-white text-xs whitespace-nowrap animate-marquee">
            {video.song} • {video.songOwner}
          </div>
        </div>
      </div>
      
      {/* TikTok UI элементы */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-start">
          <div className="flex-1">
            {/* Информация об авторе */}
            <div className="flex items-center">
              <p className="font-bold">{video.username}</p>
              {video.verified && (
                <span className="ml-1 text-blue-500">
                  <CheckCircle className="h-4 w-4" />
                </span>
              )}
            </div>
            
            {/* Описание видео */}
            <p className="text-sm mt-2">{video.description}</p>
            
            {/* Хэштеги */}
            <div className="flex flex-wrap mt-2">
              {video.hashtags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs text-blue-400 mr-2">#{tag}</span>
              ))}
              {video.hashtags.length > 3 && (
                <span className="text-xs text-blue-400">+{video.hashtags.length - 3}</span>
              )}
            </div>
          </div>
          
          {/* Боковые кнопки взаимодействия */}
          <div className="flex flex-col items-center space-y-4 ml-4">
            {/* Аватар автора */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-white">
                <img 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${video.author}`} 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <button className="bg-red-500 rounded-full h-5 w-5 -mt-2 flex items-center justify-center">
                <Plus className="h-3 w-3 text-white" />
              </button>
            </div>
            
            {/* Лайки */}
            <div className="flex flex-col items-center">
              <button className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" fill={Math.random() > 0.5 ? "red" : "none"} stroke="currentColor" />
              </button>
              <span className="text-xs mt-1">{video.likes}</span>
            </div>
            
            {/* Комментарии */}
            <div className="flex flex-col items-center">
              <button className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </button>
              <span className="text-xs mt-1">{video.comments}</span>
            </div>
            
            {/* Закладки */}
            <div className="flex flex-col items-center">
              <button className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">
                <Bookmark className="w-6 h-6" fill={Math.random() > 0.7 ? "white" : "none"} stroke="currentColor" />
              </button>
              <span className="text-xs mt-1">Save</span>
            </div>
            
            {/* Поделиться */}
            <div className="flex flex-col items-center">
              <button className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </button>
              <span className="text-xs mt-1">{video.shares}</span>
            </div>
            
            {/* Кнопка вращения */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white animate-spin-slow">
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${video.songOwner}`}
                  alt="Song"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент отображения видео в стиле YouTube
function YouTubeVideoItem({ video }: { video: typeof youtubeVideos[0] }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="flex flex-col mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md cursor-pointer" 
           onClick={() => setExpanded(!expanded)}>
        {/* Thumbnail Background */}
        <div className={`absolute inset-0 ${video.thumbnail === "gradient-bg-6" ? "bg-gradient-to-br from-blue-400 via-cyan-500 to-emerald-500" :
                                          video.thumbnail === "gradient-bg-7" ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" :
                                          video.thumbnail === "gradient-bg-8" ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" :
                                          "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500"}`}>
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>
          
          {/* Bottom overlay with video info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16"></div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
            {video.duration}
          </div>
        </div>
      </div>
      
      <div className="flex mt-3">
        {/* Channel avatar */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${video.channelImage}`} 
              alt="Channel Icon" 
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* Video information */}
        <div className="flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{video.title}</h3>
          <div className="flex items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">{video.channel}</p>
            {video.verified && (
              <span className="ml-1 text-gray-500">
                <CheckCircle className="h-3 w-3 inline fill-gray-500" />
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {video.views} • {video.uploaded}
          </div>
          
          {/* Stats row */}
          <div className="flex mt-2 space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{video.comments?.length || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Menu button */}
        <div className="flex-shrink-0 ml-2">
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Expanded view with description and comments */}
      {expanded && (
        <div className="mt-3 pl-12 animate-in fade-in duration-200">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
            {video.description}
          </div>
          
          {/* Comments section */}
          <div className="mt-3">
            <div className="flex items-center text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Комментарии</span>
            </div>
            
            {video.comments && video.comments.map((comment, idx) => (
              <div key={idx} className="flex mt-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${comment.author}`} 
                    alt="User Avatar" 
                    className="w-full h-full"
                  />
                </div>
                <div className="ml-2 flex-1">
                  <div className="flex items-center">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{comment.author}</p>
                    <span className="text-xs text-gray-500 ml-2">{comment.time}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                  <div className="flex items-center mt-1 space-x-3">
                    <button className="flex items-center text-xs text-gray-500">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center text-xs text-gray-500">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>Ответить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Comment input */}
            <div className="flex mt-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                <img 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=currentUser`} 
                  alt="User Avatar" 
                  className="w-full h-full"
                />
              </div>
              <div className="ml-2 flex-1">
                <input
                  type="text"
                  placeholder="Добавить комментарий..."
                  className="w-full px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-xs border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations for related videos */}
      {expanded && video.related && (
        <div className="mt-4 pl-12">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Похожие видео</h4>
          <div className="grid grid-cols-1 gap-2">
            {video.related.slice(0, 2).map((relatedId) => {
              const relatedVideo = youtubeVideos.find(v => v.id === relatedId);
              if (!relatedVideo) return null;
              
              return (
                <div key={relatedId} className="flex items-start cursor-pointer">
                  <div className="w-24 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
                    <div className={`absolute inset-0 ${relatedVideo.thumbnail === "gradient-bg-6" ? "bg-gradient-to-br from-blue-400 via-cyan-500 to-emerald-500" :
                                        relatedVideo.thumbnail === "gradient-bg-7" ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" :
                                        relatedVideo.thumbnail === "gradient-bg-8" ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" :
                                        "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500"}`}>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] px-1 py-0.5 rounded">
                        {relatedVideo.duration}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex-1">
                    <p className="text-xs font-medium line-clamp-2 text-gray-800 dark:text-gray-200">{relatedVideo.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{relatedVideo.channel}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{relatedVideo.views}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
