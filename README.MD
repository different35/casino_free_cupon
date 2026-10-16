# 🎰 Casino Kod Avcısı

**Telegram kanallarından casino bonus kupon kodlarını otomatik toplayan web uygulaması**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-red)
![Status](https://img.shields.io/badge/status-active-green)

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Nasıl Çalışır?](#-nasıl-çalışır)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Telegram Bot Oluşturma](#-telegram-bot-oluşturma)
- [Desteklenen Kod Formatları](#-desteklenen-kod-formatları)
- [SSS](#-sss)
- [Sorun Giderme](#-sorun-giderme)
- [Güvenlik](#-güvenlik)
- [Lisans](#-lisans)

---

## ✨ Özellikler

### ✅ Mevcut Özellikler

- 🤖 **Telegram Bot API Entegrasyonu** - Bot'unuz kanallardaki mesajları otomatik tarar
- 🔍 **Akıllı Kod Tespiti** - Regex pattern'leri ile kupon kodlarını otomatik bulur
- ⚡ **Gerçek Zamanlı Toplama** - Her 5 saniyede bir yeni mesajları kontrol eder
- 💾 **Kalıcı Saklama** - Kodlar tarayıcınızda localStorage ile saklanır
- 📋 **Tek Tıkla Kopyalama** - Bulunan kodları anında kopyalayın
- 🎯 **Durum Yönetimi** - Kodları yeni/kullanıldı/kaydedildi olarak işaretleyin
- 📊 **İstatistikler** - Taranan mesaj ve bulunan kod sayılarını görün
- 🌙 **Koyu Tema** - Göz yormayan modern arayüz
- 📱 **Responsive Tasarım** - Mobil ve masaüstü uyumlu

### 🚧 Planlanan Özellikler

- 🔔 **Bildirim Sistemi** - Yeni kod bulunduğunda tarayıcı bildirimi
- 📤 **Dışa Aktarma** - Kodları CSV/JSON olarak indirin
- 📥 **İçe Aktarma** - Yedeklenen kodları geri yükleyin
- 🔐 **Token Şifreleme** - Bot token'ını güvenli saklama
- 🎨 **Özel Pattern'ler** - Kendi kod format tanımlarınızı ekleyin
- 📈 **Gelişmiş Analitik** - Kod kullanım istatistikleri
- 🌐 **Backend Entegrasyonu** - Sunucu tabanlı senkronizasyon
- 🤖 **AI Kod Tespiti** - Makine öğrenmesi ile daha akıllı tespit

---

## 🔧 Nasıl Çalışır?

```
┌─────────────────┐
│  Telegram       │
│  Kanalları      │
└────────┬────────┘
         │
         │ Mesaj gönderir
         ▼
┌─────────────────┐
│  Telegram       │
│  Bot API        │
└────────┬────────┘
         │
         │ getUpdates (5 sn)
         ▼
┌─────────────────┐
│  Casino Kod     │
│  Avcısı         │
│  (Bu Uygulama)  │
└────────┬────────┘
         │
         │ Regex ile kodları tespit eder
         ▼
┌─────────────────┐
│  localStorage   │
│  (Tarayıcı)     │
└─────────────────┘
```

### Akış

1. **Bot Oluşturma**: @BotFather ile Telegram bot'u oluşturursunuz
2. **Token Alma**: BotFather size API token verir
3. **Kanallara Ekleme**: Bot'u kupon kanallarına admin olarak eklersiniz
4. **Uygulamaya Bağlama**: Token'ı uygulamaya girersiniz
5. **Otomatik Toplama**: Uygulama her 5 saniyede mesajları tarar
6. **Kod Tespiti**: Regex pattern'leri ile kupon kodları bulunur
7. **Kaydetme**: Bulunan kodlar tarayıcınızda saklanır
8. **Kullanım**: Kodları kopyalar ve casino sitelerinde kullanırsınız

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Modern web tarayıcı (Chrome, Firefox, Edge, Safari)
- Telegram hesabı

### Adım 1: Projeyi İndirin

```bash
git clone <repo-url>
cd casino-kod-avcisi
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

### Adım 4: Production Build

```bash
npm run build
```

Build çıktısı `dist/` klasöründe oluşur. Bu klasörü herhangi bir statik hosting'e yükleyebilirsiniz.

---

## 📖 Kullanım

### 1. Telegram Bot Oluşturma

1. Telegram'da [@BotFather](https://t.me/BotFather) ile konuşma başlatın
2. `/newbot` komutunu yazın
3. Bota bir isim verin (örn: "CasinoKodAvcisi")
4. Bir kullanıcı adı seçin (sonu "bot" ile bitmeli,örn: "casino_avci_bot")
5. BotFather size bir **API Token** verecek
6. Bu token'ı güvenli bir yere kaydedin

### 2. Bot'u Kanallara Ekleme

**ÖNEMLİ**: Bot'un mesajları okuyabilmesi için kanallara **admin olarak** eklenmesi gerekir.

1. Kupon takip etmek istediğiniz kanala gidin
2. Kanal ayarlarını açın (Manage Channel)
3. "Administrators" → "Add Administrator"
4. Bot'unuzu seçin
5. En az "Post Messages" yetkisi verin
6. Kaydedin

**Örnek Kanallar**:
- @StakecomDailyDrops
- @StakeUSDailyDrops
- @kodbonus
- @bonuskaplani
- @casinotutkunu

### 3. Uygulamayı Bağlama

1. Uygulamayı açın
2. "Bot Ayarları" sekmesine gidin
3. BotFather'dan aldığınız token'ı yapıştırın
4. "Test Et" butonuna tıklayın
5. Bağlantı başarılıysa "Kaydet ve Başla" butonuna tıklayın

### 4. Kod Toplamayı Başlatma

1. "Canlı Toplayıcı" sekmesine gidin
2. "▶️ TOPLAMAYA BAŞLA" butonuna tıklayın
3. Uygulama otomatik olarak kanalları taramaya başlar
4. Bulunan kodlar "Toplanan Kodlar" sekmesinde görünür

### 5. Kodları Kullanma

1. "Toplanan Kodlar" sekmesine gidin
2. İstediğiniz kodun yanındaki "📋 Kopyala" butonuna tıklayın
3. Casino sitesine gidin ve kodu yapıştırın
4. Kodu kullandıktan sonra "✓ Kullanıldı" olarak işaretleyin

---

## 🤖 Telegram Bot Oluşturma (Detaylı)

### Adım 1: BotFather ile Konuşma

```
Siz: /newbot
BotFather: Alright, a new bot. How are we going to call it?
Siz: CasinoKodAvcisi
BotFather: Good. Now let's choose a username for your bot.
Siz: casino_avci_bot
BotFather: Success! Your token: 1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
```

### Adım 2: Token'ı Kopyalama

BotFather'ın verdiği token'ı kopyalayın:
```
1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
```

**⚠️ UYARI**: Bu token'ı kimseyle paylaşmayın! Token'ınız çalınırsa, saldırgan botunuzu kontrol edebilir.

### Adım 3: Bot Ayarlarını Yapılandırma (Opsiyonel)

BotFather ile botunuzun ayarlarını özelleştirebilirsiniz:

```
/setdescription - Bot açıklaması
/setabouttext  - Bot hakkında bilgisi
/setuserpic    - Bot profil resmi
/setcommands   - Bot komutları
```

---

## 🎯 Desteklenen Kod Formatları

### Stake.com

```
NEXT4P7QX2MLRV8K
NEXT3M9QV6PLRX2K
```

**Pattern**: `NEXT` + 14 büyük harf/rakam

### Genel Bonus Kodları

```
FREESPIN50
BONUS123ABC
DEPOSIT100XYZ
CASHBACK2024
```

**Pattern**: Önek + 4-12 büyük harf/rakam

### Genel Format

```
ABC123DEF456
XYZ789ABC012
```

**Pattern**: 8-20 büyük harf ve rakam kombinasyonu

### Filtreleme

Uygulama otomatik olarak şunları **göz ardı eder**:
- HTTP, HTTPS, WWW, COM, ORG, NET
- TELEGRAM, BOT, CHAT, JOIN, CHANNEL
- MESSAGE, STICKER, PHOTO, VIDEO
- Sadece harf veya sadece rakam içeren kodlar
- 6 karakterden kısa veya 20 karakterden uzun kodlar

---

## ❓ SSS

### Bot neden mesajları göremiyor?

**Olası nedenler**:
1. Bot kanala admin olarak eklenmemiş
2. Bot'un "Post Messages" yetkisi yok
3. Kanal sahibi bot'u engellemiş

**Çözüm**: Kanal ayarlarından bot'u admin olarak ekleyin.

### Kodlar neden tespit edilmiyor?

**Olası nedenler**:
1. Mesajlarda kupon kodu yok
2. Kod formatı desteklenmiyor
3. Kod blacklist'te

**Çözüm**: Orijinal mesajı kontrol edin, pattern'leri özelleştirin.

### Token güvenli mi?

**Mevcut durum**: Token `localStorage`'da açık metin olarak saklanır.

**Öneri**: 
- Token'ı sadece güvendiğiniz cihazlarda kullanın
- Düzenli olarak token'ı yenileyin
- Şüpheli aktivite varsa @BotFather'dan token'ı iptal edin

### Uygulama neden yavaşladı?

**Olası nedenler**:
1. Çok fazla kod birikti (1000+)
2. Tarayıcı cache'i doldu
3. Network sorunu

**Çözüm**: Eski kodları silin, tarayıcıyı yenileyin.

### Kodlar silinirse geri gelir mi?

**Hayır**. Kodlar sadece tarayıcınızda saklanır. Silerseniz kalıcı olarak kaybolur.

**Öneri**: Düzenli olarak önemli kodları not alın.

---

## 🐛 Sorun Giderme

### "Bağlantı hatası"

**Neden**: Telegram API'ye erişilemiyor

**Çözüm**:
1. İnternet bağlantınızı kontrol edin
2. Telegram engelli mi kontrol edin (VPN gerekebilir)
3. Token'ın doğru olduğundan emin olun

### "Unauthorized" hatası

**Neden**: Token geçersiz veya iptal edilmiş

**Çözüm**:
1. @BotFather'dan yeni token alın
2. Eski token'ı iptal edin (`/revoke`)
3. Yeni token'ı uygulamaya girin

### Kodlar tespit edilmiyor

**Neden**: Pattern eşleşmiyor

**Çözüm**:
1. Orijinal mesajı kontrol edin
2. Kod formatını not alın
3. Geliştiriciye bildirin (pattern eklenmesi için)

### Sayfa yenilendiğinde toplama duruyor

**Neden**: Polling sadece sayfa açıkken çalışır

**Çözüm**:
1. Sayfayı açık tutun
2. Tarayıcı sekmesini kapatmayın
3. Bilgisayar uyku moduna geçmesin

---

## 🔐 Güvenlik

### Mevcut Durum

✅ **Token Saklama**: localStorage (client-side)
⚠️ **Şifreleme**: YOK (geliştirme aşamasında)
⚠️ **HTTPS**: Hosting'e bağlı
✅ **CORS**: Telegram API izin veriyor

### Öneriler

1. **Token Güvenliği**:
   - Token'ı kimseyle paylaşmayın
   - Düzenli olarak yenileyin
   - Şüpheli aktivite varsa iptal edin

2. **Tarayıcı Güvenliği**:
   - Güncel tarayıcı kullanın
   - Güvenilir cihazlarda çalıştırın
   - Public Wi-Fi'dan kaçının

3. **Veri Güvenliği**:
   - Önemli kodları yedekleyin
   - localStorage'ı düzenli temizleyin
   - Hassas verileri saklamayın

### Gelecek İyileştirmeler

- 🔒 Token encryption (AES-256)
- 🔐 Backend proxy (token sunucuda saklanır)
- 🛡️ Rate limiting
- 🚫 IP whitelisting

---

## 📊 Teknik Detaylar

### Performans

- **Polling Interval**: 5 saniye
- **Max Codes**: Sınırsız (localStorage limiti ~5MB)
- **Response Time**: <100ms (lokal işlemler)
- **Memory Usage**: ~50MB (ortalama)

### Tarayıcı Desteği

✅ Chrome 90+
✅ Firefox 88+
✅ Edge 90+
✅ Safari 14+
❌ Internet Explorer (desteklenmiyor)

### Depolama

- **localStorage**: ~5MB limit
- **Kod Başına**: ~200 bytes
- **Tahmini Kapasite**: ~25,000 kod

---

## 🛠️ Geliştirme

### Yeni Özellik Ekleme

```bash
# Geliştirme sunucusu
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Kod Yapısı

```
src/
├── App.tsx              # Ana bileşen
├── main.tsx             # Entry point
├── index.css            # Global stiller
├── types.ts             # TypeScript tipleri
└── components/
    ├── BotSetup.tsx     # Bot kurulum
    ├── LiveCollector.tsx # Canlı toplama
    └── CollectedCodes.tsx # Kod listesi
```

### Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje özel lisans altında dağıtılmaktadır. İzinsiz kopyalama, dağıtma veya değiştirme yasaktır.

---

## 📞 İletişim

**Sorularınız için**: [İletişim bilgileri eklenecek]

**Hata bildirimleri**: [Issue tracker eklenecek]

---

## 🙏 Teşekkürler

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Son Güncelleme**: 2026
**Versiyon**: 1.0.0
**Durum**: ✅ Aktif

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ for casino bonus hunters

</div>
