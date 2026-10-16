import { describe, it, expect } from 'vitest';

// KOD TESPİT REGEX'LERİ - App.tsx ile aynı
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

const BLACKLIST = [
  'HTTP', 'HTTPS', 'WWW', 'COM', 'ORG', 'NET', 'TELEGRAM', 'BOT',
  'CHAT', 'JOIN', 'CHANNEL', 'GROUP', 'MESSAGE', 'STICKER', 'PHOTO',
  'VIDEO', 'DOCUMENT', 'ANSWER', 'CALLBACK', 'UPDATE', 'RESULT',
];

function extractCodes(text) {
  if (!text || typeof text !== 'string') return [];
  const codes = new Set();
  for (const pattern of CODE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const code = match[1] || match[0];
      if (code.length >= 6 && code.length <= 20 &&
          !BLACKLIST.includes(code.toUpperCase()) &&
          /[A-Z]/.test(code) && /[0-9]/.test(code)) {
        codes.add(code.toUpperCase());
      }
    }
  }
  return Array.from(codes);
}

describe('extractCodes - Kod Tespit Fonksiyonu', () => {
  it('boş string için boş dizi dönmeli', () => {
    expect(extractCodes('')).toEqual([]);
    expect(extractCodes(null)).toEqual([]);
    expect(extractCodes(undefined)).toEqual([]);
  });

  it('Stake.com formatındaki kodları tespit etmeli', () => {
    const text = 'Yeni bonus kodunuz: NEXT4P7QX2MLRV8K hemen kullanın!';
    const codes = extractCodes(text);
    expect(codes).toContain('NEXT4P7QX2MLRV8K');
  });

  it('FREE ile başlayan kodları tespit etmeli', () => {
    const text = 'Free spin kodunuz: FREESPIN50 kullanın';
    const codes = extractCodes(text);
    expect(codes).toContain('FREESPIN50');
  });

  it('BONUS ile başlayan kodları tespit etmeli', () => {
    const text = 'Bonus kodu: BONUS123ABC';
    const codes = extractCodes(text);
    expect(codes).toContain('BONUS123ABC');
  });

  it('SPIN ile başlayan kodları tespit etmeli', () => {
    const text = 'Spin kodu: SPIN789XYZ';
    const codes = extractCodes(text);
    expect(codes).toContain('SPIN789XYZ');
  });

  it('DEPOSIT ile başlayan kodları tespit etmeli', () => {
    const text = 'Deposit kodu: DEPOSIT100ABC';
    const codes = extractCodes(text);
    expect(codes).toContain('DEPOSIT100ABC');
  });

  it('CASH ile başlayan kodları tespit etmeli', () => {
    const text = 'Cash kodu: CASHBACK2024';
    const codes = extractCodes(text);
    expect(codes).toContain('CASHBACK2024');
  });

  it('blacklist kelimeleri tespit etmemeli', () => {
    const text = 'HTTP HTTPS TELEGRAM BOT CHANNEL';
    const codes = extractCodes(text);
    expect(codes).not.toContain('HTTP');
    expect(codes).not.toContain('HTTPS');
    expect(codes).not.toContain('TELEGRAM');
    expect(codes).not.toContain('BOT');
    expect(codes).not.toContain('CHANNEL');
  });

  it('6 karakterden kısa kodları tespit etmemeli', () => {
    const text = 'AB12';
    const codes = extractCodes(text);
    expect(codes).toHaveLength(0);
  });

  it('sadece harf içeren kodları tespit etmemeli', () => {
    const text = 'ABCDEF';
    const codes = extractCodes(text);
    expect(codes).toHaveLength(0);
  });

  it('sadece rakam içeren kodları tespit etmemeli', () => {
    const text = '123456';
    const codes = extractCodes(text);
    expect(codes).toHaveLength(0);
  });

  it('duplicate kodları elemeli', () => {
    const text = 'BONUS123ABC ve tekrar BONUS123ABC';
    const codes = extractCodes(text);
    const bonusCount = codes.filter(c => c === 'BONUS123ABC').length;
    expect(bonusCount).toBe(1);
  });

  it('tüm kodları büyük harfe çevirmeli', () => {
    const text = 'bonus: freespin50';
    const codes = extractCodes(text);
    codes.forEach(code => {
      expect(code).toBe(code.toUpperCase());
    });
  });

  it('gerçekçi bir Telegram mesajından kodları çıkarabilmeli', () => {
    const message = `🎰 YENİ BONUS DROP! 🎰
    
Stake.com günlük kodunuz: NEXT4P7QX2MLRV8K
Bu kodu ilk 500 kişi kullanabilir!
    
⏰ Süre: 15 dakika
💰 Değer: $5

Hemen kullanın: stake.com/bonus`;
    
    const codes = extractCodes(message);
    expect(codes).toContain('NEXT4P7QX2MLRV8K');
  });

  it('birden fazla kod içeren mesajdan hepsini çıkarmalı', () => {
    const text = 'Kod1: FREESPIN50, Kod2: BONUS100XYZ, Kod3: SPIN200ABC';
    const codes = extractCodes(text);
    expect(codes).toContain('FREESPIN50');
    expect(codes).toContain('BONUS100XYZ');
    expect(codes).toContain('SPIN200ABC');
  });
});
