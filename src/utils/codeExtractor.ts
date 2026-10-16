// Kupon kodu tespit regex'leri
const CODE_PATTERNS = [
  /(?:bonus|code|coupon|promo|spin|free)[\s:_-]*([A-Z0-9]{6,20})/gi,
  /\b(NEXT[A-Z0-9]{10,20})\b/g,
  /\b([A-Z]{3,6}[0-9]{3,8}[A-Z0-9]{0,4})\b/g,
  /\b(FREE[A-Z0-9]{4,12})\b/gi,
  /\b(SPIN[A-Z0-9]{4,12})\b/gi,
  /\b(BONUS[A-Z0-9]{4,12})\b/gi,
  /\b(DEPOSIT[A-Z0-9]{4,12})\b/gi,
  /\b(CASH[A-Z0-9]{4,12})\b/gi,
];

// Spam filtre - bunları kod olarak sayma
const BLACKLIST = [
  'HTTP', 'HTTPS', 'WWW', 'COM', 'ORG', 'NET', 'TELEGRAM', 'BOT',
  'CHAT', 'JOIN', 'CHANNEL', 'GROUP', 'MESSAGE', 'STICKER', 'PHOTO',
  'VIDEO', 'DOCUMENT', 'ANSWER', 'CALLBACK', 'UPDATE', 'RESULT',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
];

export function extractCodes(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  
  const codes: Set<string> = new Set();
  
  for (const pattern of CODE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const code = match[1] || match[0];
      // Filtreleme
      if (code.length >= 6 && 
          code.length <= 20 && 
          !BLACKLIST.includes(code.toUpperCase()) &&
          /[A-Z]/.test(code) && 
          /[0-9]/.test(code) &&
          !/^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$/.test(code)) {
        codes.add(code.toUpperCase());
      }
    }
  }
  
  return Array.from(codes);
}

export function isValidTelegramToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  // Telegram bot token formatı: sayılar:string
  const pattern = /^\d{8,10}:[A-Za-z0-9_-]{35}$/;
  return pattern.test(token.trim());
}

export function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}sn önce`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}sa önce`;
  const days = Math.floor(hours / 24);
  return `${days}g önce`;
}
