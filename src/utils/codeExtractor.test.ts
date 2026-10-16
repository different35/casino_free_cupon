import { describe, it, expect } from 'vitest';
import { extractCodes, isValidTelegramToken, formatTimeSince } from './codeExtractor';

describe('extractCodes', () => {
  it('boş string için boş dizi dönmeli', () => {
    expect(extractCodes('')).toEqual([]);
    expect(extractCodes(null as any)).toEqual([]);
    expect(extractCodes(undefined as any)).toEqual([]);
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
    const text = 'AB12'; // 4 karakter
    const codes = extractCodes(text);
    expect(codes).toHaveLength(0);
  });

  it('sadece harf içeren kodları tespit etmemeli', () => {
    const text = 'ABCDEF'; // rakam yok
    const codes = extractCodes(text);
    expect(codes).toHaveLength(0);
  });

  it('sadece rakam içeren kodları tespit etmemeli', () => {
    const text = '123456'; // harf yok
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

describe('isValidTelegramToken', () => {
  it('geçerli bir token kabul etmeli', () => {
    const validToken = '1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ';
    expect(isValidTelegramToken(validToken)).toBe(true);
  });

  it('boş token reddetmeli', () => {
    expect(isValidTelegramToken('')).toBe(false);
    expect(isValidTelegramToken(null as any)).toBe(false);
    expect(isValidTelegramToken(undefined as any)).toBe(false);
  });

  it('geçersiz formatlı token reddetmeli', () => {
    expect(isValidTelegramToken('invalid')).toBe(false);
    expect(isValidTelegramToken('123:abc')).toBe(false);
    expect(isValidTelegramToken('abc:1234567890')).toBe(false);
  });

  it('boşlukları trim etmeli', () => {
    const token = '  1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ  ';
    expect(isValidTelegramToken(token)).toBe(true);
  });
});

describe('formatTimeSince', () => {
  it('saniyeleri doğru formatlamalı', () => {
    const date = new Date(Date.now() - 30 * 1000); // 30 saniye önce
    expect(formatTimeSince(date)).toBe('30sn önce');
  });

  it('dakikaları doğru formatlamalı', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 dakika önce
    expect(formatTimeSince(date)).toBe('5dk önce');
  });

  it('saatleri doğru formatlamalı', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 saat önce
    expect(formatTimeSince(date)).toBe('3sa önce');
  });

  it('günleri doğru formatlamalı', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 gün önce
    expect(formatTimeSince(date)).toBe('2g önce');
  });
});
