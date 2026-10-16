# 🎰 Casino Kod Avcısı - Backend

**Gerçek Telegram Bot entegrasyonu ile kupon kodu toplayıcı**

---

## 🚀 Kurulum

### 1. Bot Oluşturun

1. Telegram'da [@BotFather](https://t.me/BotFather) ile konuşun
2. `/newbot` komutunu yazın
3. Bota isim verin (örn: "CasinoKodAvcisi")
4. Username seçin (sonu "bot" ile bitmeli)
5. Token'ı kopyalayın

### 2. Bot'u Kanallara Ekleyin

**ÖNEMLİ**: Bot'un mesajları okuyabilmesi için kanallara **admin olarak** eklenmesi gerekir.

1. Kanal ayarlarını açın
2. "Administrators" → "Add Administrator"
3. Bot'unuzu seçin
4. En az "Post Messages" yetkisi verin

### 3. Backend Kurulumu

```bash
cd backend
npm install
```

### 4. Token Yapılandırması

```bash
cp .env.example .env
```

`.env` dosyasını açın ve token'ınızı ekleyin:

```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
```

### 5. Sunucuyu Başlatın

```bash
npm start
```

veya geliştirme modunda:

```bash
npm run dev
```

---

## 📡 API Endpoints

### GET /api/status
Bot durumunu kontrol eder

```bash
curl http://localhost:3001/api/status
```

**Yanıt:**
```json
{
  "success": true,
  "bot": {
    "username": "casino_avci_bot",
    "id": 1234567890,
    "firstName": "Casino Kod Avcısı"
  },
  "codesCollected": 15,
  "uptime": 3600
}
```

### GET /api/codes
Tüm toplanan kodları getirir

```bash
curl http://localhost:3001/api/codes
```

**Yanıt:**
```json
{
  "success": true,
  "count": 15,
  "codes": [
    {
      "id": "1234567890-NEXT4P7QX2MLRV8K",
      "code": "NEXT4P7QX2MLRV8K",
      "source": "Stake Daily Drops",
      "chatId": -1001234567890,
      "messageId": 123,
      "fullText": "Yeni bonus kodunuz: NEXT4P7QX2MLRV8K...",
      "collectedAt": "2026-01-15T10:30:00.000Z",
      "status": "new"
    }
  ]
}
```

### GET /api/codes/recent/:limit
Son N kodu getirir

```bash
curl http://localhost:3001/api/codes/recent/10
```

### DELETE /api/codes/:id
Belirli bir kodu siler

```bash
curl -X DELETE http://localhost:3001/api/codes/1234567890-NEXT4P7QX2MLRV8K
```

### DELETE /api/codes
Tüm kodları siler

```bash
curl -X DELETE http://localhost:3001/api/codes
```

---

## 🔧 Kod Tespit Algoritması

### Desteklenen Formatlar

1. **Stake.com**: `NEXT[A-Z0-9]{10,20}`
   - Örnek: `NEXT4P7QX2MLRV8K`

2. **Free Spin**: `FREE[A-Z0-9]{4,12}`
   - Örnek: `FREESPIN50`

3. **Bonus**: `BONUS[A-Z0-9]{4,12}`
   - Örnek: `BONUS123ABC`

4. **Spin**: `SPIN[A-Z0-9]{4,12}`
   - Örnek: `SPIN789XYZ`

5. **Deposit**: `DEPOSIT[A-Z0-9]{4,12}`
   - Örnek: `DEPOSIT100ABC`

6. **Cash**: `CASH[A-Z0-9]{4,12}`
   - Örnek: `CASHBACK2024`

7. **Genel**: `[A-Z]{3,6}[0-9]{3,8}[A-Z0-9]{0,4}`
   - Örnek: `ABC123DEF456`

### Filtreleme

- Minimum 6, maksimum 20 karakter
- En az 1 harf VE en az 1 rakam içermeli
- Blacklist kelimeler elenir (HTTP, TELEGRAM, BOT, vb.)
- Duplicate kontrolü yapılır

---

## 🌐 Deploy

### Vercel (Önerilen)

```bash
npm i -g vercel
vercel
```

### Railway

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Render

1. GitHub'a push edin
2. Render.com'da yeni Web Service oluşturun
3. Repo'yu bağlayın
4. Environment variables ekleyin
5. Deploy edin

### Kendi Sunucunuz

```bash
# PM2 ile
npm i -g pm2
pm2 start server.js --name casino-bot
pm2 save
pm2 startup
```

---

## 🔐 Güvenlik

### Production için Öneriler

1. **HTTPS kullanın** - Let's Encrypt ile ücretsiz SSL
2. **Rate limiting** - API abuse'ı önleyin
3. **Authentication** - API key veya JWT ekleyin
4. **Environment variables** - Token'ı asla kodda tutmayın
5. **Logging** - Hataları ve aktiviteleri loglayın
6. **Firewall** - Sadece gerekli portları açın

---

## 🐛 Sorun Giderme

### Bot mesajları göremiyor

- Bot kanala admin olarak eklenmiş mi?
- "Post Messages" yetkisi var mı?
- Token doğru mu?

### Kodlar tespit edilmiyor

- Mesajda gerçekten kupon kodu var mı?
- Kod formatı destekleniyor mu?
- Log'lara bakın: `console.log` çıktılarını kontrol edin

### Sunucu çalışmıyor

- `.env` dosyası var mı?
- Token doğru mu?
- Port başka bir uygulama tarafından kullanılıyor mu?

---

## 📊 Örnek Kullanım

### Frontend Entegrasyonu

```javascript
// Kodları getir
const response = await fetch('http://localhost:3001/api/codes');
const data = await response.json();
console.log(data.codes);

// Son 10 kodu getir
const recent = await fetch('http://localhost:3001/api/codes/recent/10');
const recentData = await recent.json();
console.log(recentData.codes);
```

### cURL ile Test

```bash
# Durum kontrol
curl http://localhost:3001/api/status

# Tüm kodları getir
curl http://localhost:3001/api/codes

# Kod sil
curl -X DELETE http://localhost:3001/api/codes/1234567890-NEXT4P7QX2MLRV8K
```

---

## 📝 Lisans

MIT License

---

**Gerçek entegrasyon. Sahte veri yok. Çalışan sistem.** 🎰
