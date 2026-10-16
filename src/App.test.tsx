import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('render olmalı', () => {
    render(<App />);
    // Uygulama başlığı görünmeli
    expect(screen.getByText('Casino Kod Avcısı')).toBeInTheDocument();
  });

  it('alt başlık görünmeli', () => {
    render(<App />);
    expect(screen.getByText("Telegram'dan Otomatik Kupon Toplayıcı")).toBeInTheDocument();
  });

  it('bot kurulumu başlığı görünmeli (bağlantı yokken)', () => {
    render(<App />);
    expect(screen.getByText('🤖 Bot Kurulumu')).toBeInTheDocument();
  });

  it('token input alanı görünmeli', () => {
    render(<App />);
    expect(screen.getByLabelText('Telegram Bot Token')).toBeInTheDocument();
  });

  it('bağlan butonu görünmeli', () => {
    render(<App />);
    expect(screen.getByText('🔌 Bağlan ve Test Et')).toBeInTheDocument();
  });

  it('nasıl yapılır rehberi görünmeli', () => {
    render(<App />);
    expect(screen.getByText('📋 Nasıl yapılır?')).toBeInTheDocument();
  });

  it('rehber adımları görünmeli', () => {
    render(<App />);
    expect(screen.getByText('@BotFather ile konuşun')).toBeInTheDocument();
    expect(screen.getByText('/newbot komutunu yazın')).toBeInTheDocument();
    expect(screen.getByText('Bota isim verin')).toBeInTheDocument();
    expect(screen.getByText("Token'ı kopyalayın")).toBeInTheDocument();
    expect(screen.getByText('Botu kanallara admin olarak ekleyin')).toBeInTheDocument();
    expect(screen.getByText("Token'ı buraya yapıştırın")).toBeInTheDocument();
  });
});
