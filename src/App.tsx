import { useState, useEffect, useCallback, useRef } from 'react';
import BotSetup from './components/BotSetup';
import LiveCollector from './components/LiveCollector';
import CollectedCodes from './components/CollectedCodes';
import { CollectedCoupon, BotConfig } from './types';

const BOT_CONFIG_KEY = 'telegram_bot_config';
const COUPONS_KEY = 'collected_coupons';

function loadConfig(): BotConfig | null {
  try {
    const stored = localStorage.getItem(BOT_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveConfig(config: BotConfig) {
  localStorage.setItem(BOT_CONFIG_KEY, JSON.stringify(config));
}

function loadCoupons(): CollectedCoupon[] {
  try {
    const stored = localStorage.getItem(COUPONS_KEY);
    if (stored) {
      return JSON.parse(stored).map((c: any) => ({
        ...c,
        collectedAt: new Date(c.collectedAt),
      }));
    }
  } catch { /* empty */ }
  return [];
}

function saveCoupons(coupons: CollectedCoupon[]) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}

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
  /\b([A-Z0-9]{8,20})\b/g, // Genel büyük harf+rakam kodları
];

// Spam filtre - bunları kod olarak sayma
const BLACKLIST = [
  'HTTP', 'HTTPS', 'WWW', 'COM', 'ORG', 'NET', 'TELEGRAM', 'BOT',
  'CHAT', 'JOIN', 'CHANNEL', 'GROUP', 'MESSAGE', 'STICKER', 'PHOTO',
  'VIDEO', 'DOCUMENT', 'ANSWER', 'CALLBACK', 'UPDATE', 'RESULT',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Tam alfabe
];

function extractCodes(text: string): string[] {
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

function App() {
  const [config, setConfig] = useState<BotConfig | null>(loadConfig());
  const [coupons, setCoupons] = useState<CollectedCoupon[]>(loadCoupons());
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ messagesScanned: 0, codesFound: 0 });
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<'collector' | 'codes' | 'setup'>('collector');

  // Telegram Bot API - getUpdates
  const fetchUpdates = useCallback(async () => {
    if (!config?.token) return;

    try {
      const url = `https://api.telegram.org/bot${config.token}/getUpdates?offset=${lastUpdateId + 1}&timeout=5&allowed_updates=["channel_posts","message"]`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.description || 'API hatası');
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.description || 'Bilinmeyen hata');
      }

      if (data.result && data.result.length > 0) {
        const newCoupons: CollectedCoupon[] = [];
        let maxUpdateId = lastUpdateId;

        for (const update of data.result) {
          maxUpdateId = Math.max(maxUpdateId, update.update_id);

          // Kanal postu veya mesajdan metni çıkar
          let text = '';
          let chatTitle = '';
          let chatId = 0;
          let messageId = 0;

          if (update.channel_post) {
            text = update.channel_post.text || update.channel_post.caption || '';
            chatTitle = update.channel_post.chat.title || 'Bilinmeyen Kanal';
            chatId = update.channel_post.chat.id;
            messageId = update.channel_post.message_id;
          } else if (update.message) {
            text = update.message.text || update.message.caption || '';
            chatTitle = update.message.chat.title || update.message.chat.first_name || 'Özel Mesaj';
            chatId = update.message.chat.id;
            messageId = update.message.message_id;
          }

          if (text) {
            setStats(prev => ({ ...prev, messagesScanned: prev.messagesScanned + 1 }));
            const codes = extractCodes(text);
            
            for (const code of codes) {
              // Duplicate kontrolü
              const exists = coupons.some(c => c.code === code);
              if (!exists) {
                const newCoupon: CollectedCoupon = {
                  id: `${chatId}-${messageId}-${code}`,
                  code,
                  source: chatTitle,
                  chatId,
                  messageId,
                  fullText: text.substring(0, 500),
                  collectedAt: new Date(),
                  status: 'new',
                  copied: false,
                };
                newCoupons.push(newCoupon);
              }
            }

            if (codes.length > 0) {
              setStats(prev => ({ ...prev, codesFound: prev.codesFound + codes.length }));
            }
          }
        }

        if (newCoupons.length > 0) {
          setCoupons(prev => {
            const updated = [...newCoupons, ...prev];
            saveCoupons(updated);
            return updated;
          });
        }

        setLastUpdateId(maxUpdateId);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası');
    }
  }, [config, lastUpdateId, coupons]);

  // Polling başlat/durdur
  useEffect(() => {
    if (isCollecting && config?.token) {
      // İlk çekim
      fetchUpdates();
      // Her 5 saniyede bir kontrol
      pollingRef.current = setInterval(fetchUpdates, 5000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isCollecting, config, fetchUpdates]);

  const handleSaveConfig = (newConfig: BotConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    setLastUpdateId(0);
    setActiveTab('collector');
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveCoupons(updated);
      return updated;
    });
  };

  const handleUpdateStatus = (id: string, status: CollectedCoupon['status']) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, status } : c);
      saveCoupons(updated);
      return updated;
    });
  };

  const handleClearAll = () => {
    if (confirm('Tüm toplanan kodları silmek istediğinize emin misiniz?')) {
      setCoupons([]);
      saveCoupons([]);
    }
  };

  const handleDisconnect = () => {
    setIsCollecting(false);
    setConfig(null);
    localStorage.removeItem(BOT_CONFIG_KEY);
    setActiveTab('setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎰</div>
            <div>
              <h1 className="text-xl font-bold text-white">Casino Kod Avcısı</h1>
              <p className="text-xs text-purple-300">Telegram'dan Otomatik Kupon Toplayıcı</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {config && (
              <button
                onClick={() => setIsCollecting(!isCollecting)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  isCollecting
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isCollecting ? 'bg-green-400' : 'bg-red-400'}`}></span>
                {isCollecting ? 'TOPLUYOR' : 'DURDUR'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'collector' as const, label: 'Canlı Toplayıcı', icon: '📡' },
            { id: 'codes' as const, label: `Toplanan Kodlar (${coupons.length})`, icon: '🎫' },
            { id: 'setup' as const, label: 'Bot Ayarları', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 border border-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'setup' && (
          <BotSetup
            config={config}
            onSave={handleSaveConfig}
          />
        )}

        {activeTab === 'collector' && (
          <LiveCollector
            isCollecting={isCollecting}
            config={config}
            stats={stats}
            error={error}
            coupons={coupons}
            onStart={() => setIsCollecting(true)}
            onStop={() => setIsCollecting(false)}
            onGoToSetup={() => setActiveTab('setup')}
          />
        )}

        {activeTab === 'codes' && (
          <CollectedCodes
            coupons={coupons}
            onDelete={handleDeleteCoupon}
            onUpdateStatus={handleUpdateStatus}
            onClearAll={handleClearAll}
          />
        )}
      </main>
    </div>
  );
}

export default App;
