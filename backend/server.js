import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Token validasyonu
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable gerekli!');
  console.error('.env dosyası oluşturun ve token\'ınızı ekleyin');
  process.exit(1);
}

// Telegram Bot oluştur
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Kod tespit pattern'leri
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

// Blacklist
const BLACKLIST = [
  'HTTP', 'HTTPS', 'WWW', 'COM', 'ORG', 'NET', 'TELEGRAM', 'BOT',
  'CHAT', 'JOIN', 'CHANNEL', 'GROUP', 'MESSAGE', 'STICKER', 'PHOTO',
  'VIDEO', 'DOCUMENT', 'ANSWER', 'CALLBACK', 'UPDATE', 'RESULT',
];

// Kod çıkar
function extractCodes(text) {
  if (!text || typeof text !== 'string') return [];
  
  const codes = new Set();
  
  for (const pattern of CODE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const code = match[1] || match[0];
      if (code.length >= 6 && 
          code.length <= 20 && 
          !BLACKLIST.includes(code.toUpperCase()) &&
          /[A-Z]/.test(code) && 
          /[0-9]/.test(code)) {
        codes.add(code.toUpperCase());
      }
    }
  }
  
  return Array.from(codes);
}

// Bulunan kodlar
const collectedCodes = [];

// Bot bilgisi al
bot.getMe().then((botInfo) => {
  console.log(`✅ Bot bağlandı: @${botInfo.username}`);
  console.log(`Bot ID: ${botInfo.id}`);
  console.log('Kodları toplamaya hazır!');
}).catch((err) => {
  console.error('❌ Bot bağlantı hatası:', err.message);
  process.exit(1);
});

// Mesaj dinle
bot.on('message', (msg) => {
  const text = msg.text || msg.caption || '';
  const chatTitle = msg.chat.title || msg.chat.first_name || 'Bilinmeyen';
  
  if (text) {
    const codes = extractCodes(text);
    
    if (codes.length > 0) {
      console.log(`\n🎉 ${codes.length} kod bulundu!`);
      console.log(`Kaynak: ${chatTitle}`);
      console.log(`Kodlar: ${codes.join(', ')}`);
      
      codes.forEach(code => {
        collectedCodes.push({
          id: `${Date.now()}-${code}`,
          code,
          source: chatTitle,
          chatId: msg.chat.id,
          messageId: msg.message_id,
          fullText: text.substring(0, 300),
          collectedAt: new Date(),
          status: 'new'
        });
      });
    }
  }
});

// Kanal postu dinle
bot.on('channel_post', (msg) => {
  const text = msg.text || msg.caption || '';
  const chatTitle = msg.chat.title || 'Kanal';
  
  if (text) {
    const codes = extractCodes(text);
    
    if (codes.length > 0) {
      console.log(`\n🎉 ${codes.length} kod bulundu!`);
      console.log(`Kaynak: ${chatTitle}`);
      console.log(`Kodlar: ${codes.join(', ')}`);
      
      codes.forEach(code => {
        collectedCodes.push({
          id: `${Date.now()}-${code}`,
          code,
          source: chatTitle,
          chatId: msg.chat.id,
          messageId: msg.message_id,
          fullText: text.substring(0, 300),
          collectedAt: new Date(),
          status: 'new'
        });
      });
    }
  }
});

// API Endpoints

// Tüm kodları getir
app.get('/api/codes', (req, res) => {
  res.json({
    success: true,
    count: collectedCodes.length,
    codes: collectedCodes
  });
});

// Son N kodu getir
app.get('/api/codes/recent/:limit', (req, res) => {
  const limit = parseInt(req.params.limit) || 10;
  const recent = collectedCodes.slice(-limit).reverse();
  
  res.json({
    success: true,
    count: recent.length,
    codes: recent
  });
});

// Kod sil
app.delete('/api/codes/:id', (req, res) => {
  const index = collectedCodes.findIndex(c => c.id === req.params.id);
  
  if (index !== -1) {
    collectedCodes.splice(index, 1);
    res.json({ success: true, message: 'Kod silindi' });
  } else {
    res.status(404).json({ success: false, message: 'Kod bulunamadı' });
  }
});

// Tüm kodları temizle
app.delete('/api/codes', (req, res) => {
  collectedCodes.length = 0;
  res.json({ success: true, message: 'Tüm kodlar silindi' });
});

// Bot durumunu kontrol et
app.get('/api/status', async (req, res) => {
  try {
    const botInfo = await bot.getMe();
    res.json({
      success: true,
      bot: {
        username: botInfo.username,
        id: botInfo.id,
        firstName: botInfo.first_name
      },
      codesCollected: collectedCodes.length,
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`\n🚀 Backend sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/status        - Bot durumu`);
  console.log(`   GET  /api/codes         - Tüm kodlar`);
  console.log(`   GET  /api/codes/recent/10 - Son 10 kod`);
  console.log(`   DELETE /api/codes/:id   - Kod sil`);
  console.log(`   DELETE /api/codes       - Tümünü sil\n`);
});
