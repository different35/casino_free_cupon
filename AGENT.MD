# Casino Kod Avcısı - Teknik Dokümantasyon

## 🎯 Proje Özeti

**Casino Kod Avcısı**, Telegram kanallarından casino bonus kupon kodlarını otomatik olarak toplayan bir web uygulamasıdır.

---

## 🏗️ Mimari

### Teknoloji Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback, useRef)
- **Data Persistence**: localStorage (client-side)
- **API Integration**: Telegram Bot API

### Proje Yapısı

```
src/
├── App.tsx                      # Ana uygulama bileşeni
├── main.tsx                     # Entry point
├── index.css                    # Global stiller + animasyonlar
├── types.ts                     # TypeScript tip tanımları
└── components/
    ├── BotSetup.tsx             # Bot kurulum ve bağlantı testi
    ├── LiveCollector.tsx        # Canlı toplama dashboard
    └── CollectedCodes.tsx       # Toplanan kodlar listesi
```

---

## 🔧 Teknik Detaylar

### 1. Telegram Bot API Entegrasyonu

**Endpoint**: `https://api.telegram.org/bot{TOKEN}/getUpdates`

**Polling Stratejisi**:
- Her 5 saniyede bir `getUpdates` çağrısı
- `offset` parametresi ile sadece yeni mesajlar çekilir
- `timeout=5` ile long-polling desteklenir
- `allowed_updates=["channel_posts","message"]` ile sadece ilgili mesajlar alınır

**Veri Akışı**:
```
Telegram API → getUpdates → Mesajları Parse Et → Kod Tespit Et → Kaydet
```

### 2. Kod Tespit Algoritması

**Regex Pattern'leri**:

```typescript
const CODE_PATTERNS = [
  /(?:bonus|code|coupon|promo|spin|free)[\s:_-]*([A-Z0-9]{6,20})/gi,
  /\b(NEXT[A-Z0-9]{10,20})\b/g,                    // Stake.com formatı
  /\b([A-Z]{3,6}[0-9]{3,8}[A-Z0-9]{0,4})\b/g,     // Genel format
  /\b(FREE[A-Z0-9]{4,12})\b/gi,
  /\b(SPIN[A-Z0-9]{4,12})\b/gi,
  /\b(BONUS[A-Z0-9]{4,12})\b/gi,
  /\b(DEPOSIT[A-Z0-9]{4,12})\b/gi,
  /\b(CASH[A-Z0-9]{4,12})\b/gi,
  /\b([A-Z0-9]{8,20})\b/g,                         // Genel büyük harf+rakam
];
```

**Filtreleme Kuralları**:
- Minimum 6, maksimum 20 karakter
- En az 1 harf VE en az 1 rakam içermeli
- Blacklist'teki kelimeler elenir (HTTP, TELEGRAM, BOT, vb.)
- Duplicate kontrolü yapılır

**Blacklist**:
```typescript
const BLACKLIST = [
  'HTTP', 'HTTPS', 'WWW', 'COM', 'ORG', 'NET', 'TELEGRAM', 'BOT',
  'CHAT', 'JOIN', 'CHANNEL', 'GROUP', 'MESSAGE', 'STICKER', 'PHOTO',
  'VIDEO', 'DOCUMENT', 'ANSWER', 'CALLBACK', 'UPDATE', 'RESULT',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
];
```

### 3. Veri Yönetimi

**localStorage Keys**:
- `telegram_bot_config`: Bot token ve ayarlar
- `collected_coupons`: Toplanan kupon kodları

**Veri Yapısı**:

```typescript
interface CollectedCoupon {
  id: string;              // {chatId}-{messageId}-{code}
  code: string;            // Tespit edilen kod
  source: string;          // Kanal/grup adı
  chatId: number;          // Telegram chat ID
  messageId: number;       // Mesaj ID
  fullText: string;        // Orijinal mesaj (max 500 karakter)
  collectedAt: Date;       // Tespit zamanı
  status: 'new' | 'used' | 'expired' | 'saved';
  copied: boolean;         // Kopyalandı mı?
}

interface BotConfig {
  token: string;           // Telegram Bot API token
  botUsername: string;     // Bot kullanıcı adı
  monitoredChannels: string[]; // İzlenen kanallar (şu an kullanılmıyor)
}
```

### 4. Bileşen Mimarisi

#### App.tsx (Ana Bileşen)

**State Management**:
- `config`: Bot yapılandırması
- `coupons`: Toplanan kuponlar
- `isCollecting`: Toplama durumu (açık/kapalı)
- `lastUpdateId`: Son işlenen update ID
- `error`: Hata mesajı
- `stats`: İstatistikler (mesaj sayısı, bulunan kod sayısı)
- `activeTab`: Aktif sekme

**Polling Logic**:
```typescript
useEffect(() => {
  if (isCollecting && config?.token) {
    fetchUpdates(); // İlk çekim
    pollingRef.current = setInterval(fetchUpdates, 5000); // 5 sn polling
  } else {
    clearInterval(pollingRef.current);
  }
  return () => clearInterval(pollingRef.current);
}, [isCollecting, config, fetchUpdates]);
```

#### BotSetup.tsx

**Özellikler**:
- Token girişi
- `getMe` API çağrısı ile bağlantı testi
- Bot kullanıcı adı otomatik doldurma
- Kurulum rehberi (adım adım)

#### LiveCollector.tsx

**Özellikler**:
- Gerçek zamanlı durum göstergesi
- İstatistik panelleri (mesaj, kod, toplam)
- Canlı akış (son 5 kod)
- Hata gösterimi
- Başlat/Durdur kontrolü

#### CollectedCodes.tsx

**Özellikler**:
- Tüm kodların listesi
- Tek tek kopyalama
- Tümünü kopyala
- Durum güncelleme (yeni → kullanıldı → kaydedildi)
- Silme
- Orijinal mesajı göster (accordion)

---

## 🔐 Güvenlik

### Token Saklama

- Bot token `localStorage`'da saklanır
- Client-side encryption YOK (geliştirme aşamasında)
- Token tarayıcıda açık metin olarak durur

### Önerilen İyileştirmeler

1. **Token Encryption**: `crypto.subtle` ile AES encryption
2. **Secure Storage**: `sessionStorage` veya backend proxy
3. **CORS Proxy**: Token'ı backend'de tut, frontend sadece proxy üzerinden erişsin

---

## 🐛 Bilinen Sorunlar

### 1. Polling Dependency Loop

**Sorun**: `fetchUpdates` fonksiyonu `coupons` state'ine bağımlı, bu gereksiz re-render'lara neden olabilir.

**Çözüm**: `useRef` ile coupons referansı tutulabilir.

### 2. Duplicate Detection

**Sorun**: Duplicate kontrolü `coupons.some()` ile yapılıyor, büyük listelerde yavaş olabilir.

**Çözüm**: `Set` veya `Map` kullanılabilir.

### 3. Error Handling

**Sorun**: API hataları sadece ekranda gösteriliyor, retry mekanizması yok.

**Çözüm**: Exponential backoff ile retry eklenebilir.

### 4. Regex False Positives

**Sorun**: Genel pattern (`[A-Z0-9]{8,20}`) çok fazla false positive üretebilir.

**Çözüm**: Daha spesifik pattern'ler veya ML-based detection.

---

## 📊 Performans

### Mevcut Durum

- **Polling Interval**: 5 saniye
- **Max Messages per Poll**: Sınırsız (Telegram limiti: 100)
- **localStorage Limit**: ~5MB (tarayıcıya göre değişir)

### Optimizasyon Önerileri

1. **Debouncing**: Hızlı ardışık update'leri birleştir
2. **Pagination**: 1000+ kod için virtual scrolling
3. **IndexedDB**: localStorage yerine daha büyük storage
4. **Web Workers**: Regex parsing'i worker'a taşı

---

## 🧪 Test Stratejisi

### Manuel Test Senaryoları

1. **Bot Kurulumu**:
   - Geçerli token ile bağlantı
   - Geçersiz token ile hata
   - Token kaydetme ve yükleme

2. **Kod Tespiti**:
   - Stake.com formatı (NEXT...)
   - Genel bonus kodları
   - False positive filtreleme
   - Duplicate engelleme

3. **Polling**:
   - Başlat/durdur
   - Sayfa yenilendiğinde devam etme
   - Network hatası sonrası toparlanma

4. **Kod Yönetimi**:
   - Kopyalama
   - Durum güncelleme
   - Silme
   - Tümünü temizleme

### Otomatik Testler

**Yok** - Geliştirme aşamasında.

**Önerilen**:
- Unit tests: `extractCodes()` fonksiyonu
- Integration tests: API mock ile polling
- E2E tests: Gerçek bot ile tam akış

---

## 🚀 Deployment

### Build

```bash
npm run build
```

**Çıktı**: `dist/` klasörü
- `index.html`
- `assets/index-[hash].js`
- `assets/index-[hash].css`

### Hosting

**Statik hosting** yeterli (backend yok):
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Environment Variables

**Yok** - Tüm konfigürasyon kullanıcı tarafından girilir.

---

## 📝 Geliştirme Rehberi

### Yeni Özellik Ekleme

1. **Yeni Bileşen**: `src/components/` altında oluştur
2. **Tip Tanımı**: `src/types.ts`'e ekle
3. **State Management**: `App.tsx`'te state ekle
4. **UI**: Tailwind CSS ile stillendir

### Kod Tespit Pattern'i Ekleme

```typescript
const CODE_PATTERNS = [
  // ... mevcut pattern'ler
  /\b(YENI_PATTERN[A-Z0-9]{4,12})\b/gi, // Yeni pattern
];
```

### Blacklist Güncelleme

```typescript
const BLACKLIST = [
  // ... mevcut kelimeler
  'YENI_KELIME', // Yeni kelime
];
```

---

## 🔗 Bağımlılıklar

### Production

- `react`: ^18.x
- `react-dom`: ^18.x

### Development

- `typescript`: ^5.x
- `vite`: ^5.x
- `tailwindcss`: ^3.x
- `@types/react`: ^18.x
- `@types/react-dom`: ^18.x

---

## 📚 Kaynaklar

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📄 Lisans

Belirtilmemiş - Tüm hakları saklıdır.

---

**Son Güncelleme**: 2026
**Versiyon**: 1.0.0
**Durum**: Aktif Geliştirme
