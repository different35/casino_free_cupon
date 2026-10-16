import { CasinoPlatform, BonusType } from '../types';

export const platformNames: Record<CasinoPlatform, string> = {
  betmgm: 'BetMGM',
  draftkings: 'DraftKings',
  caesars: 'Caesars',
  fanuel: 'FanDuel',
  golden_nugget: 'Golden Nugget',
  borgata: 'Borgata',
  hard_rock: 'Hard Rock',
  unibet: 'Unibet',
  other: 'Diğer',
};

export const bonusTypeNames: Record<BonusType, string> = {
  free_spins: 'Free Spins',
  deposit_match: 'Deposit Match',
  no_deposit: 'No Deposit',
  cashback: 'Cashback',
};

export const platforms: CasinoPlatform[] = [
  'betmgm', 'draftkings', 'caesars', 'fanuel', 
  'golden_nugget', 'borgata', 'hard_rock', 'unibet', 'other'
];

export const bonusTypes: BonusType[] = [
  'free_spins', 'deposit_match', 'no_deposit', 'cashback'
];

// Telegram Kaynak Veritabanı
export interface TelegramSource {
  id: string;
  name: string;
  username: string;
  type: 'channel' | 'group' | 'bot';
  platform: string;
  language: 'tr' | 'en' | 'both';
  dropFrequency: string;
  peakHours: string[];
  rewardRange: string;
  subscriberCount?: string;
  notes?: string;
}

export const telegramSources: TelegramSource[] = [
  // Stake.com Ekosistemi
  {
    id: 'stake-daily',
    name: 'Stake Daily Drops',
    username: '@StakecomDailyDrops',
    type: 'channel',
    platform: 'Stake.com',
    language: 'en',
    dropFrequency: 'Günde birkaç kez (rastgele)',
    peakHours: ['19:30', '14:00-16:00'],
    rewardRange: '$1-$5',
    subscriberCount: '172.000+',
    notes: 'Flash drop, sabit saat yok. İlk 500-1500 oyuncu ile sınırlı.'
  },
  {
    id: 'stake-high',
    name: 'Stake High Rollers',
    username: '@StakecomHighRollers',
    type: 'channel',
    platform: 'Stake.com',
    language: 'en',
    dropFrequency: 'Günlük',
    peakHours: ['19:30'],
    rewardRange: '$12.50-$25',
    notes: 'VIP kanal. Yüksek bahis hacmi gerekli ($3K-$10K+/7 gün).'
  },
  {
    id: 'stake-us-daily',
    name: 'Stake.US Daily Drops',
    username: '@StakeUSDailyDrops',
    type: 'channel',
    platform: 'Stake.US',
    language: 'en',
    dropFrequency: 'Günde 3-4 kod',
    peakHours: ['19:30', '10:00-14:00'],
    rewardRange: '1-3 SC',
    notes: 'Qualification: Son 7 günde 4K, 8K veya 12K SC oynanmış olmalı.'
  },
  {
    id: 'stake-us-high',
    name: 'Stake.US High Rollers',
    username: '@stakeushighrollers',
    type: 'channel',
    platform: 'Stake.US',
    language: 'en',
    dropFrequency: 'Günde 3 drop',
    peakHours: ['19:30'],
    rewardRange: '12.50-25 SC (bazen 50 SC)',
    notes: 'Toplam havuz: 50.000 SC. Kodlar 10 dk içinde tükenir.'
  },
  {
    id: 'stake-live',
    name: 'Stake Live Challenges',
    username: '@stakelivechallenges',
    type: 'channel',
    platform: 'Stake.com',
    language: 'en',
    dropFrequency: 'Günde birden fazla',
    peakHours: ['19:00-22:00'],
    rewardRange: '$300-$1,400',
    notes: '30 dakikalık slot yarışları. Ödüller: 1.$1400, 2.$1000, 3.$800, 4.$500, 5.$300'
  },
  {
    id: 'stake-vip',
    name: 'VIP Notices',
    username: '@+bzGuVC4YkKFlYmFl',
    type: 'channel',
    platform: 'Stake',
    language: 'en',
    dropFrequency: 'Haftalık (Cumartesi)',
    peakHours: ['12:30 GMT Cumartesi'],
    rewardRange: 'VIP seviyeye göre',
    notes: 'Sabit takvim: Her Cumartesi 12:30 GMT. Gold Coins + Stake Cash.'
  },
  
  // BC.Game
  {
    id: 'bcgame',
    name: 'BC.Game Official',
    username: 'BCGameBot',
    type: 'bot',
    platform: 'BC.Game',
    language: 'en',
    dropFrequency: 'Düzensiz',
    peakHours: ['19:00-22:00'],
    rewardRange: 'BCD (değişken)',
    notes: 'Shitcodes: Rastgele BCD değerleri. Süreli teklifler.'
  },
  
  // Diğer Platformlar
  {
    id: 'richsweeps',
    name: 'RichSweeps',
    username: 'RichSweeps',
    type: 'channel',
    platform: 'RichSweeps',
    language: 'en',
    dropFrequency: 'Düzenli',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    subscriberCount: '7.000+',
    notes: 'Özel sohbet ve vault drop.'
  },
  
  // Türkçe Kanallar
  {
    id: 'kodbonus',
    name: 'Kod Bonus',
    username: '@kodbonus',
    type: 'channel',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    notes: 'Türkçe odaklı casino bonus kodları.'
  },
  {
    id: 'bonuskaplani',
    name: 'Bonus Kaplanı',
    username: '@bonuskaplani',
    type: 'channel',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    notes: 'Türkçe bonus kodları.'
  },
  {
    id: 'bonus-veren',
    name: 'Bonus Veren Bahis Siteleri',
    username: '@bonus_veren_bahis_siteleri',
    type: 'channel',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    notes: 'Türkçe bahis ve casino bonusları.'
  },
  {
    id: 'casinotutkunu',
    name: 'Casino Tutkunu',
    username: '@casinotutkunu',
    type: 'channel',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    notes: 'Türkçe casino topluluğu.'
  },
  {
    id: 'highstakebets',
    name: 'HighStakeBets',
    username: 'HighStakeBets',
    type: 'channel',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: '100₺-6000₺',
    notes: 'DELLABET (100₺/100 FS), XSLOT (300 TL/300 FS), Megapari, Betroad (6000₺ %100 çevrim).'
  },
  {
    id: 'pablo-dostlar',
    name: 'Pablo Dostlar',
    username: 'Pablo Dostlar',
    type: 'group',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Sürekli',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Değişken',
    notes: 'NoraBahis, Almabet, Fixbet, Showbet, Kordonbet promosyonları.'
  },
  {
    id: 'bonus-semti',
    name: 'BONUS SEMTİ',
    username: 'BONUS SEMTİ',
    type: 'channel',
    platform: 'Orisbet',
    language: 'tr',
    dropFrequency: 'Günlük',
    peakHours: ['19:00-22:00'],
    rewardRange: 'Maks. 300₺',
    notes: 'Orisbet deneme bonusu. Yatırım ve çevrim şartı yok.'
  },
  {
    id: 'yatirimci-nakit',
    name: 'Yatırımcı Nakit İade Grubu',
    username: 'Yatırımcı Nakit İade',
    type: 'group',
    platform: 'Çeşitli',
    language: 'tr',
    dropFrequency: 'Kademeli',
    peakHours: ['19:00-22:00'],
    rewardRange: '50₺-1.500₺',
    notes: '50₺ deposit → 50₺ iade, 10.000₺ deposit → 1.500₺ iade.'
  },
];

// Resmi Botlar
export const officialBots = [
  { name: 'TGCasinoOfficialBot', platform: 'TGCasino' },
  { name: 'LuckyBlockBot', platform: 'Lucky Block' },
  { name: 'BetPandaBot', platform: 'BetPanda' },
  { name: 'BCGameBot', platform: 'BC.Game' },
];

// Yoğun Saat Haritası
export const peakHoursData = {
  flashDrops: {
    time: '19:30',
    description: 'Stake.com flash drop zamanı. Kodlar saniyeler içinde tükenir.',
    platforms: ['Stake.com', 'Stake.US'],
  },
  scheduledAnnouncements: {
    time: '10:00-14:00',
    description: 'Planlanmış duyurular. Salı-Perşembe en yoğun.',
    platforms: ['Genel'],
  },
  entertainment: {
    time: '19:00-22:00',
    description: 'Eğlence odaklı kanallar zirve etkileşim.',
    platforms: ['Tüm Türkçe kanallar', 'RichSweeps'],
  },
  weeklyVIP: {
    time: 'Cumartesi 12:30 GMT',
    description: 'VIP Notices haftalık boost dağıtımı.',
    platforms: ['Stake VIP'],
  },
};

// Kod Formatları
export const codeFormats = {
  stake: {
    pattern: 'NEXT[A-Z0-9]{14}',
    example: 'NEXT4P7QX2MLRV8K',
    lifespan: '15 dakika (kodların %80\'i)',
    limit: 'İlk 500-1.500 oyuncu',
  },
  bcgame: {
    pattern: 'Shitcodes (rastgele)',
    example: 'BCLCFC',
    lifespan: 'Süreli',
    limit: 'Değişken',
  },
  general: {
    pattern: 'Harf-rakam kombinasyonu',
    example: 'FREESPIN50, BONUS123',
    lifespan: '24 saat - 100 gün',
    limit: 'Platforma göre değişir',
  },
};
