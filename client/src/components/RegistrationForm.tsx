import { useState, useEffect } from "react";
import { useGameState } from "@/lib/gameState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Список языков для выбора (более 100)
const languages = [
  // Основные языки (с поддержкой переводов в приложении)
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  
  // Популярные языки
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "uk", name: "Українська" },
  { code: "tr", name: "Türkçe" },
  { code: "ar", name: "العربية" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "th", name: "ไทย" },
  { code: "hi", name: "हिन्दी" },

  // Европейские языки
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
  { code: "fi", name: "Suomi" },
  { code: "no", name: "Norsk" },
  { code: "cs", name: "Čeština" },
  { code: "hu", name: "Magyar" },
  { code: "el", name: "Ελληνικά" },
  { code: "ro", name: "Română" },
  { code: "sk", name: "Slovenčina" },
  { code: "bg", name: "Български" },
  { code: "sr", name: "Српски" },
  { code: "hr", name: "Hrvatski" },
  { code: "lt", name: "Lietuvių" },
  { code: "lv", name: "Latviešu" },
  { code: "et", name: "Eesti" },
  { code: "sl", name: "Slovenščina" },
  { code: "is", name: "Íslenska" },
  { code: "ga", name: "Gaeilge" },
  { code: "cy", name: "Cymraeg" },
  { code: "eu", name: "Euskara" },
  { code: "ca", name: "Català" },
  { code: "gl", name: "Galego" },
  { code: "be", name: "Беларуская" },
  { code: "mk", name: "Македонски" },
  { code: "sq", name: "Shqip" },
  
  // Языки Азии
  { code: "bn", name: "বাংলা" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "fa", name: "فارسی" },
  { code: "he", name: "עברית" },
  { code: "ur", name: "اردو" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "mr", name: "मराठी" },
  { code: "km", name: "ខ្មែរ" },
  { code: "lo", name: "ລາວ" },
  { code: "my", name: "ဗမာစာ" },
  { code: "ka", name: "ქართული" },
  { code: "hy", name: "Հայերեն" },
  { code: "mn", name: "Монгол" },
  { code: "ne", name: "नेपाली" },
  { code: "si", name: "සිංහල" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "gu", name: "ગુજરાતી" },
  
  // Центральная Азия
  { code: "kk", name: "Қазақша" },
  { code: "ky", name: "Кыргызча" },
  { code: "uz", name: "O'zbek" },
  { code: "tg", name: "Тоҷикӣ" },
  { code: "tk", name: "Türkmençe" },
  { code: "az", name: "Azərbaycan" },
  { code: "tt", name: "Татарча" },
  
  // Африка
  { code: "sw", name: "Kiswahili" },
  { code: "af", name: "Afrikaans" },
  { code: "am", name: "አማርኛ" },
  { code: "ha", name: "Hausa" },
  { code: "ig", name: "Igbo" },
  { code: "yo", name: "Yorùbá" },
  { code: "zu", name: "isiZulu" },
  { code: "xh", name: "isiXhosa" },
  { code: "so", name: "Soomaali" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "mg", name: "Malagasy" },
  { code: "wo", name: "Wolof" },

  // Другие
  { code: "ht", name: "Kreyòl Ayisyen" },
  { code: "mi", name: "Māori" },
  { code: "haw", name: "ʻŌlelo Hawaiʻi" },
  { code: "sa", name: "संस्कृतम्" },
  { code: "la", name: "Latina" },
  { code: "gd", name: "Gàidhlig" },
  { code: "yi", name: "ייִדיש" },
  { code: "eo", name: "Esperanto" },
  { code: "fo", name: "Føroyskt" },
  { code: "to", name: "Lea Fakatonga" },
  { code: "kl", name: "Kalaallisut" },
  { code: "iu", name: "ᐃᓄᒃᑎᑐᑦ" },
  { code: "qu", name: "Runasimi" },
  { code: "dv", name: "ދިވެހި" },
  { code: "ti", name: "ትግርኛ" },
  { code: "ln", name: "Lingála" },
  { code: "om", name: "Afaan Oromoo" },
  { code: "ee", name: "Eʋegbe" },
  { code: "as", name: "অসমীয়া" },
  { code: "sc", name: "Sardu" },
  { code: "jv", name: "Basa Jawa" }
];

export default function RegistrationForm() {
  const { register } = useGameState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("ru");
  const [error, setError] = useState<string | null>(null);
  const [animateSlogan, setAnimateSlogan] = useState(false);

  // Локализованные строки для разных языков
  const translations: Record<string, Record<string, string>> = {
    "en": {
      "title": "CriptoMain",
      "slogan": "Play, watch, enjoy and get lots of money",
      "name_label": "Your Name",
      "name_placeholder": "Enter your name",
      "phone_label": "Phone Number",
      "phone_placeholder": "+1 (123) 456-7890",
      "language_label": "Select Language",
      "start_button": "Start Mining",
      "error_message": "Please fill in all fields",
      "terms": "By registering, you agree to our Terms of Use and Privacy Policy"
    },
    "ru": {
      "title": "CriptoMain",
      "slogan": "Играй, смотри, кайфуй и получай кучу бабла",
      "name_label": "Ваше имя",
      "name_placeholder": "Введите ваше имя",
      "phone_label": "Номер телефона",
      "phone_placeholder": "+7 (999) 123-4567",
      "language_label": "Выберите язык",
      "start_button": "Начать майнинг",
      "error_message": "Пожалуйста, заполните все поля",
      "terms": "Регистрируясь, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности"
    },
    "es": {
      "title": "CriptoMain",
      "slogan": "Juega, mira, disfruta y obtén mucho dinero",
      "name_label": "Su Nombre",
      "name_placeholder": "Introduce tu nombre",
      "phone_label": "Número de Teléfono",
      "phone_placeholder": "+34 (123) 456-789",
      "language_label": "Seleccionar Idioma",
      "start_button": "Comenzar Minería",
      "error_message": "Por favor, completa todos los campos",
      "terms": "Al registrarte, aceptas nuestros Términos de uso y Política de privacidad"
    },
    "zh": {
      "title": "CriptoMain",
      "slogan": "玩，看，享受，赚很多钱",
      "name_label": "您的姓名",
      "name_placeholder": "输入您的姓名",
      "phone_label": "电话号码",
      "phone_placeholder": "+86 (123) 4567-8901",
      "language_label": "选择语言",
      "start_button": "开始挖矿",
      "error_message": "请填写所有字段",
      "terms": "注册即表示您同意我们的使用条款和隐私政策"
    }
  };

  // Функция для получения локализованного текста
  const getText = (key: string): string => {
    // Если язык есть в переводах, используем его, иначе возвращаемся к русскому
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    } else if (translations["ru"][key]) {
      return translations["ru"][key];
    }
    return "";
  };

  // Эффект анимации для слогана
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateSlogan(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !language) {
      setError(getText("error_message"));
      return;
    }
    
    // Передаем имя, телефон и выбранный язык в функцию регистрации
    register(name, phone, language);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl md:text-3xl font-['Orbitron'] font-bold text-indigo-600 dark:text-indigo-400 text-center mb-3">
            {getText("title")}
          </h1>
          <p className={`text-sm text-center text-gray-700 dark:text-gray-300 mb-4 transition-all duration-700 ${animateSlogan ? 'scale-105 text-pink-500' : ''}`}>
            {getText("slogan")}
          </p>
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-full mb-6 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shine_3s_infinite]"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium mb-1">
                {getText("name_label")}
              </Label>
              <Input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={getText("name_placeholder")}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium mb-1">
                {getText("phone_label")}
              </Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder={getText("phone_placeholder")}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <Label htmlFor="language" className="block text-sm font-medium mb-1">
                {getText("language_label")}
              </Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getText("language_label")} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {languages.map((lang) => (
                    <SelectItem key={`${lang.code}-${lang.name}`} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              {getText("start_button")}
            </Button>
          </form>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            {getText("terms")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
