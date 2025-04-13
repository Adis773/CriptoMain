import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, skins } from "@shared/schema";
import { generateRandomReferralId } from "../shared/utils";
import { z } from "zod";

// Типы для аутентификации
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}

// Промежуточное ПО для проверки аутентификации
const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization;
  
  if (!userId) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }
  
  try {
    const user = await storage.getUser(parseInt(userId));
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Ошибка аутентификации" });
  }
};

// Промежуточное ПО для проверки премиум-статуса
const checkPremium = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }
  
  try {
    const isPremium = await storage.isPremiumActive(req.user.id);
    if (!isPremium) {
      return res.status(403).json({ message: "Для доступа требуется премиум-подписка" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Ошибка проверки премиум-статуса" });
  }
};

// Вспомогательная функция для обработки ошибок
const handleError = (res: Response, error: any, message: string) => {
  console.error(error);
  
  if (error instanceof z.ZodError) {
    // Возвращаем подробную информацию о валидации
    return res.status(400).json({ 
      message: "Ошибка валидации", 
      errors: error.errors 
    });
  }
  
  res.status(500).json({ message });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ====== БАЗОВЫЕ API МАРШРУТЫ ======
  
  // Получение всех пользователей (для таблицы лидеров)
  app.get("/api/users/leaderboard", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Сортировка пользователей по балансу в порядке убывания
      const sortedUsers = users
        .sort((a, b) => Number(b.balance) - Number(a.balance))
        .slice(0, 10) // Получаем топ-10
        .map((user, index) => ({
          rank: index + 1,
          name: user.username,
          isPremium: user.isPremium || false, // Добавляем статус премиум
          earnings: Number(user.balance).toFixed(2)
        }));
      
      res.json(sortedUsers);
    } catch (error) {
      handleError(res, error, "Не удалось получить таблицу лидеров");
    }
  });
  
  // ====== АУТЕНТИФИКАЦИЯ И РЕГИСТРАЦИЯ ======
  
  // Регистрация нового пользователя
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, phone, password, email, language } = req.body;
      
      // Проверка существующего пользователя
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Имя пользователя уже занято" });
      }
      
      const existingPhone = await storage.getUserByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ message: "Номер телефона уже зарегистрирован" });
      }
      
      // Генерация уникального referralId
      const referralId = generateRandomReferralId();
      
      // Создание нового пользователя
      const newUser = await storage.createUser({
        username,
        phone,
        password,
        email,
        referralId,
        language: language || "ru"
      });
      
      // Обработка реферальной ссылки, если она была указана
      const { referrerCode } = req.body;
      if (referrerCode) {
        const referrer = await storage.getUserByReferralId(referrerCode);
        if (referrer) {
          await storage.incrementReferrals(referrer.id);
        }
      }
      
      // Удаляем пароль из ответа
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      handleError(res, error, "Не удалось зарегистрировать пользователя");
    }
  });
  
  // Авторизация пользователя
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      // Проверяем формат данных с помощью Zod
      const validationResult = loginSchema.safeParse({ phone, password });
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: validationResult.error.errors 
        });
      }
      
      // Проверяем учетные данные
      const user = await storage.validateUserCredentials(phone, password);
      if (!user) {
        return res.status(401).json({ message: "Неверный телефон или пароль" });
      }
      
      // Проверяем и деактивируем истекшие премиум-подписки
      await storage.deactivateExpiredPremiums();
      
      // Удаляем пароль из ответа
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      handleError(res, error, "Не удалось авторизоваться");
    }
  });
  
  // Получение информации о текущем пользователе
  app.get("/api/auth/me", authenticate, (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      // Удаляем пароль из ответа
      const { password, ...userWithoutPassword } = req.user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      handleError(res, error, "Не удалось получить информацию о пользователе");
    }
  });
  
  // ====== МАЙНИНГ И ОБНОВЛЕНИЕ БАЛАНСА ======
  
  // Обновление баланса пользователя (после майнинга)
  app.patch("/api/users/:id/mine", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { clicks, earning } = req.body;
      
      // Проверяем, что пользователь может обновлять только свои данные
      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Нет прав для выполнения этой операции" });
      }
      
      // Получаем пользователя
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      // Проверяем, есть ли у пользователя доступные клики
      if (user.dailyClicks <= 0) {
        return res.status(400).json({ message: "Лимит кликов на сегодня исчерпан" });
      }
      
      // Обновляем пользователя
      const updatedUser = await storage.updateUserMining(userId, clicks, earning);
      
      // Обновляем прибыль администратора (40% от заработка)
      await storage.updateAdminProfit(earning * 0.4);
      
      res.json(updatedUser);
    } catch (error) {
      handleError(res, error, "Не удалось обновить баланс пользователя");
    }
  });
  
  // ====== РЕФЕРАЛЫ ======
  
  // Обработка реферальной ссылки
  app.post("/api/users/referral", async (req, res) => {
    try {
      const { referrerId, newUserId } = req.body;
      
      // Обновляем счетчик рефералов реферера
      const updatedReferrer = await storage.incrementReferrals(referrerId);
      
      res.json(updatedReferrer);
    } catch (error) {
      handleError(res, error, "Не удалось обработать реферальную ссылку");
    }
  });
  
  // ====== ПРЕМИУМ-ПОДПИСКА ======
  
  // Проверка статуса премиум-подписки
  app.get("/api/premium/status", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const isPremium = await storage.isPremiumActive(req.user.id);
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      res.json({
        isPremium,
        expiryDate: user.premiumExpiry,
        benefits: {
          miningMultiplier: user.miningMultiplier,
          dailyClicks: user.dailyClicks,
          referralBonus: "10%",
          exclusiveSkins: true
        }
      });
    } catch (error) {
      handleError(res, error, "Не удалось проверить статус премиум-подписки");
    }
  });
  
  // Активация премиум-подписки
  app.post("/api/premium/activate", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const { months, paymentMethod } = req.body;
      
      // Проверка данных
      if (!months || !paymentMethod) {
        return res.status(400).json({ message: "Не указаны обязательные параметры" });
      }
      
      // Расчет стоимости подписки (2500 тг * количество месяцев)
      const amount = 2500 * months;
      
      // Активация премиум-подписки
      const updatedUser = await storage.activatePremium(req.user.id, months, paymentMethod, amount);
      
      // Удаляем пароль из ответа
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({
        ...userWithoutPassword,
        premiumActivated: true,
        amount,
        months
      });
    } catch (error) {
      handleError(res, error, "Не удалось активировать премиум-подписку");
    }
  });
  
  // Получение информации об оплате (для Kaspi и других методов)
  app.get("/api/premium/payment-info", (req, res) => {
    try {
      // Информация о способах оплаты
      res.json({
        methods: [
          {
            id: "kaspi",
            name: "Kaspi Bank",
            phone: "+77754529029",
            instructions: "Переведите деньги на указанный номер телефона через приложение Kaspi"
          },
          {
            id: "halyk",
            name: "Halyk Bank",
            phone: "+77754529029",
            instructions: "Переведите деньги на указанный номер телефона через Halyk Bank"
          }
        ],
        price: {
          monthly: 2500,
          quarterly: 7000,
          yearly: 25000
        }
      });
    } catch (error) {
      handleError(res, error, "Не удалось получить информацию об оплате");
    }
  });
  
  // Проверка статуса платежа
  app.post("/api/premium/check-payment", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const { paymentId, transactionId } = req.body;
      
      // Здесь должна быть логика проверки платежа с помощью API Kaspi или другой системы
      // В нашем примере мы просто обновляем статус платежа на "completed"
      
      const updatedPayment = await storage.updatePaymentStatus(
        parseInt(paymentId), 
        "completed", 
        transactionId
      );
      
      res.json({
        status: "success",
        paymentVerified: true,
        payment: updatedPayment
      });
    } catch (error) {
      handleError(res, error, "Не удалось проверить статус платежа");
    }
  });
  
  // ====== СКИНЫ ======
  
  // Получение всех доступных скинов
  app.get("/api/skins", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const allSkins = await storage.getAllSkins();
      const userSkins = await storage.getUserSkins(req.user.id);
      const userSkinIds = userSkins.map(skin => skin.skinId);
      
      // Проверка премиум-статуса
      const isPremium = await storage.isPremiumActive(req.user.id);
      
      // Фильтруем скины в зависимости от статуса премиум
      const availableSkins = allSkins.filter(skin => {
        // Если скин требует премиум, проверяем статус
        if (skin.isPremium && !isPremium) {
          return false;
        }
        return true;
      });
      
      // Добавляем информацию о том, владеет ли пользователь каждым скином
      const skinsWithOwnership = availableSkins.map(skin => ({
        ...skin,
        owned: userSkinIds.includes(skin.skinId)
      }));
      
      res.json(skinsWithOwnership);
    } catch (error) {
      handleError(res, error, "Не удалось получить список скинов");
    }
  });
  
  // Получение скинов пользователя
  app.get("/api/users/:id/skins", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Проверяем, что пользователь запрашивает только свои данные
      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Нет прав для выполнения этой операции" });
      }
      
      const userSkins = await storage.getUserSkins(userId);
      
      res.json(userSkins);
    } catch (error) {
      handleError(res, error, "Не удалось получить скины пользователя");
    }
  });
  
  // Добавление скина пользователю
  app.post("/api/users/:id/skins", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { skinId } = req.body;
      
      // Проверяем, что пользователь обновляет только свои данные
      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Нет прав для выполнения этой операции" });
      }
      
      // Получаем информацию о скине
      const allSkins = await storage.getAllSkins();
      const skin = allSkins.find(s => s.skinId === skinId);
      
      if (!skin) {
        return res.status(404).json({ message: "Скин не найден" });
      }
      
      // Если скин требует премиум, проверяем статус
      if (skin.isPremium) {
        const isPremium = await storage.isPremiumActive(userId);
        if (!isPremium) {
          return res.status(403).json({ message: "Этот скин доступен только для премиум-пользователей" });
        }
      }
      
      // Если у скина есть цена, проверяем баланс пользователя
      if (skin.price) {
        const user = await storage.getUser(userId);
        if (!user || Number(user.balance) < Number(skin.price)) {
          return res.status(400).json({ message: "Недостаточно средств для приобретения скина" });
        }
        
        // Здесь должно быть обновление баланса пользователя
        // после покупки скина (не реализовано в текущем хранилище)
      }
      
      // Добавляем скин пользователю
      await storage.addSkinToUser(userId, skinId);
      
      // Получаем обновленный список скинов пользователя
      const userSkins = await storage.getUserSkins(userId);
      
      res.json({
        message: "Скин успешно добавлен",
        skins: userSkins
      });
    } catch (error) {
      handleError(res, error, "Не удалось добавить скин пользователю");
    }
  });
  
  // Выбор скина
  app.post("/api/users/:id/select-skin", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { skinId } = req.body;
      
      // Проверяем, что пользователь обновляет только свои данные
      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Нет прав для выполнения этой операции" });
      }
      
      // Обновляем выбранный скин пользователя
      const updatedUser = await storage.setSelectedSkin(userId, skinId);
      
      // Удаляем пароль из ответа
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({
        message: "Скин успешно выбран",
        user: userWithoutPassword
      });
    } catch (error) {
      handleError(res, error, "Не удалось выбрать скин");
    }
  });
  
  // ====== ПЛАТЕЖИ ======
  
  // Получение истории платежей пользователя
  app.get("/api/users/:id/payments", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Проверяем, что пользователь запрашивает только свои данные
      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Нет прав для выполнения этой операции" });
      }
      
      const payments = await storage.getUserPayments(userId);
      
      res.json(payments);
    } catch (error) {
      handleError(res, error, "Не удалось получить историю платежей");
    }
  });
  
  // Создание платежа
  app.post("/api/payments", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const { amount, paymentMethod } = req.body;
      
      // Проверка данных
      if (!amount || !paymentMethod) {
        return res.status(400).json({ message: "Не указаны обязательные параметры" });
      }
      
      // Создание платежа
      const payment = await storage.createPayment(req.user.id, amount, paymentMethod);
      
      res.status(201).json(payment);
    } catch (error) {
      handleError(res, error, "Не удалось создать платеж");
    }
  });
  
  // Обновление статуса платежа
  app.patch("/api/payments/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { status, transactionId } = req.body;
      
      // Обновление статуса платежа
      const updatedPayment = await storage.updatePaymentStatus(paymentId, status, transactionId);
      
      res.json(updatedPayment);
    } catch (error) {
      handleError(res, error, "Не удалось обновить статус платежа");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
