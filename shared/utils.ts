/**
 * Генерирует случайный реферальный ID длиной 10 символов
 * из букв и цифр без специальных символов.
 * 
 * @returns {string} Случайный реферальный ID
 */
export function generateRandomReferralId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const idLength = 10;
  let referralId = '';
  
  for (let i = 0; i < idLength; i++) {
    referralId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return referralId;
}

/**
 * Вычисляет размер заработка от майнинга на основе случайности
 * с минимальным и максимальным значением.
 * 
 * @param {number} min - Минимальное значение заработка
 * @param {number} max - Максимальное значение заработка
 * @param {boolean} isPremium - Является ли пользователь премиум
 * @returns {number} Величина заработка
 */
export function calculateMiningEarning(min: number = 0.01, max: number = 0.05, isPremium: boolean = false): number {
  // Премиум пользователи имеют шанс на больший заработок
  const actualMax = isPremium ? max * 1.5 : max;
  
  const earning = min + Math.random() * (actualMax - min);
  return parseFloat(earning.toFixed(2));
}

/**
 * Форматирует денежную сумму с нужным количеством десятичных знаков
 * и символом валюты.
 * 
 * @param {number} amount - Сумма для форматирования
 * @param {number} decimals - Количество десятичных знаков
 * @param {string} currencySymbol - Символ валюты
 * @returns {string} Отформатированная сумма
 */
export function formatCurrency(amount: number, decimals: number = 2, currencySymbol: string = '$'): string {
  return `${currencySymbol}${amount.toFixed(decimals)}`;
}

/**
 * Форматирует дату в удобный для отображения формат.
 * 
 * @param {Date|string|number} date - Дата для форматирования
 * @returns {string} Отформатированная дата
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Вычисляет, сколько времени прошло с указанной даты
 * и возвращает человекочитаемую строку (например, "2 часа назад").
 * 
 * @param {Date|string|number} date - Исходная дата
 * @returns {string} Человекочитаемая строка с прошедшим временем
 */
export function timeAgo(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} лет назад`;
  if (interval === 1) return `1 год назад`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} месяцев назад`;
  if (interval === 1) return `1 месяц назад`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} дней назад`;
  if (interval === 1) return `1 день назад`;
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} часов назад`;
  if (interval === 1) return `1 час назад`;
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} минут назад`;
  if (interval === 1) return `1 минуту назад`;
  
  if (seconds < 10) return `только что`;
  return `${Math.floor(seconds)} секунд назад`;
}

/**
 * Возвращает строку с правильным склонением слова в зависимости от числа.
 * 
 * @param {number} count - Число
 * @param {string[]} words - Массив из трех форм слова (1, 2-4, 5-0)
 * @returns {string} Строка с правильным склонением
 */
export function pluralize(count: number, words: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)];
  return `${count} ${words[index]}`;
}

/**
 * Сокращает большие числа для удобного отображения
 * (например, 1200 -> 1.2K, 1200000 -> 1.2M).
 * 
 * @param {number} num - Число для сокращения
 * @returns {string} Сокращенное представление числа
 */
export function abbreviateNumber(num: number): string {
  const abbreviations = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ];
  
  for (const abbr of abbreviations) {
    if (num >= abbr.value) {
      return (num / abbr.value).toFixed(1) + abbr.symbol;
    }
  }
  
  return num.toString();
}