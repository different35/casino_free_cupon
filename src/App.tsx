import { useState, useEffect, useRef, useCallback } from 'react';

// KOD TESPİT REGEX'LERİ
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

// LOCALSTORAGE
const CONFIG_KEY = 'casino_bot_config';
const COUPONS_KEY = 'casino_coupons';

function loadConfig() {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function loadCoupons() {
  try {
    const data = localStorage.getItem(COUPONS_KEY);
    if (data) {
      return JSON.parse(data).map(c => ({ ...c, collectedAt: new Date(c.collectedAt) }));
    }
  } catch { return []; }
  return [];
}

function App() {
  const [config, setConfig] = useState(loadConfig());
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isCollecting, setIsCollecting] = useState(false);
  const [coupons, setCoupons] = useState(loadCoupons());
  const [stats, setStats] = useState({ messagesScanned: 0, codesFound: 0 });
  const [activeTab, setActiveTab] = useState('collector');
  const [testing, setTesting] = useState(false);
  const [botInfo, setBotInfo] = useState(null);
  
  const lastUpdateIdRef = useRef(0);
  const pollingRef = useRef(null);
  const couponsRef = useRef(coupons);

  useEffect(() => { couponsRef.current = coupons; }, [coupons]);
  
  useEffect(() => {
    try { localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons)); }
    catch (e) { console.error('Kaydetme hatası:', e); }
  }, [coupons]);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    if (type !== 'error') setTimeout(() => setMessage(''), 3000);
  };

  // TELEGRAM API'YE BAĞLAN
  const testConnection = async () => {
    if (!token.trim()) {
      showMessage('❌ Token girin', 'error');
      return;
    }
    setTesting(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`);
      const data = await response.json();
      if (data.ok) {
        const newConfig = { token: token.trim(), botUsername: data.result.username };
        setConfig(newConfig);
        setBotInfo(data.result);
        localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
        showMessage(`✅ Bağlandı: @${data.result.username}`, 'success');
        setActiveTab('collector');
      } else {
        showMessage(`❌ Hata: ${data.description}`, 'error');
      }
    } catch (err) {
      showMessage(`❌ Bağlantı hatası: ${err.message}`, 'error');
    }
    setTesting(false);
  };

  // TELEGRAM'DAN MESAJ ÇEK
  const fetchUpdates = useCallback(async () => {
    if (!config?.token) return;
    try {
      const url = `https://api.telegram.org/bot${config.token}/getUpdates?offset=${lastUpdateIdRef.current + 1}&timeout=1&allowed_updates=["channel_posts","message"]`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.ok) throw new Error(data.description || 'API hatası');

      if (data.result && data.result.length > 0) {
        const newCoupons = [];
        for (const update of data.result) {
          lastUpdateIdRef.current = Math.max(lastUpdateIdRef.current, update.update_id);
          let text = '', chatTitle = '';
          if (update.channel_post) {
            text = update.channel_post.text || update.channel_post.caption || '';
            chatTitle = update.channel_post.chat.title || 'Kanal';
          } else if (update.message) {
            text = update.message.text || update.message.caption || '';
            chatTitle = update.message.chat.title || update.message.chat.first_name || 'Mesaj';
          }
          if (text) {
            setStats(prev => ({ ...prev, messagesScanned: prev.messagesScanned + 1 }));
            const codes = extractCodes(text);
            for (const code of codes) {
              if (!couponsRef.current.some(c => c.code === code)) {
                newCoupons.push({
                  id: `${Date.now()}-${code}`,
                  code, source: chatTitle,
                  collectedAt: new Date(),
                  fullText: text.substring(0, 300),
                  status: 'new'
                });
              }
            }
            if (codes.length > 0) {
              setStats(prev => ({ ...prev, codesFound: prev.codesFound + codes.length }));
            }
          }
        }
        if (newCoupons.length > 0) {
          setCoupons(prev => [...newCoupons, ...prev]);
          showMessage(`🎉 ${newCoupons.length} yeni kod bulundu!`, 'success');
        }
      }
    } catch (err) {
      console.error('Polling hatası:', err.message);
    }
  }, [config]);

  // POLLING
  useEffect(() => {
    if (isCollecting && config?.token) {
      fetchUpdates();
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
        pollingRef.current = null;
      }
    };
  }, [isCollecting, config, fetchUpdates]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showMessage(`📋 Kopyalandı: ${code}`, 'success');
    }).catch(() => showMessage('❌ Kopyalama başarısız', 'error'));
  };

  const disconnect = () => {
    setIsCollecting(false);
    setConfig(null);
    setBotInfo(null);
    localStorage.removeItem(CONFIG_KEY);
    setActiveTab('setup');
    setToken('');
    showMessage('Bağlantı kesildi', 'info');
  };

  const deleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));
  const updateStatus = (id, status) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  const clearAll = () => {
    if (window.confirm('Tüm kodlar silinecek. Emin misiniz?')) {
      setCoupons([]);
      showMessage('Tüm kodlar silindi', 'info');
    }
  };

  const msgBg = messageType === 'success' ? 'rgba(34,197,94,0.15)' : 
                messageType === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(168,85,247,0.15)';
  const msgBorder = messageType === 'success' ? 'rgba(34,197,94,0.4)' : 
                    messageType === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(168,85,247,0.4)';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎰</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Casino Kod Avcısı</h1>
          <p style={{ color: '#a78bfa', fontSize: '14px' }}>Telegram'dan Otomatik Kupon Toplayıcı</p>
        </div>

        {config && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✅ Bağlı: @{config.botUsername}</span>
            <button onClick={disconnect} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Bağlantıyı Kes</button>
          </div>
        )}

        {message && (
          <div style={{ background: msgBg, border: `1px solid ${msgBorder}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{message}</div>
        )}

        {config && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { id: 'collector', label: '📡 Toplayıcı' },
              { id: 'codes', label: `🎫 Kodlar (${coupons.length})` },
              { id: 'setup', label: '⚙️ Ayarlar' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 18px', background: activeTab === tab.id ? 'rgba(147,51,234,0.8)' : 'rgba(30,41,59,0.5)', border: `1px solid ${activeTab === tab.id ? 'rgba(147,51,234,0.8)' : 'rgba(100,116,139,0.3)'}`, borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: activeTab === tab.id ? 'bold' : 'normal', cursor: 'pointer' }}>{tab.label}</button>
            ))}
          </div>
        )}

        {(!config || activeTab === 'setup') && (
          <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>🤖 Bot Kurulumu</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '14px' }}>Telegram Bot Token</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ" aria-label="Telegram Bot Token" style={{ width: '100%', padding: '12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '8px', color: 'white', fontSize: '14px', fontFamily: 'monospace', outline: 'none' }} />
            </div>
            <button onClick={testConnection} disabled={testing} style={{ width: '100%', padding: '14px', background: testing ? 'rgba(100,116,139,0.5)' : 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: testing ? 'not-allowed' : 'pointer', opacity: testing ? 0.7 : 1 }}>
              {testing ? '⏳ Test ediliyor...' : '🔌 Bağlan ve Test Et'}
            </button>
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', fontSize: '13px', color: '#94a3b8' }}>
              <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>📋 Nasıl yapılır?</strong>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>@BotFather ile konuşun</li>
                <li>/newbot komutunu yazın</li>
                <li>Bota isim verin</li>
                <li>Token'ı kopyalayın</li>
                <li>Botu kanallara admin olarak ekleyin</li>
                <li>Token'ı buraya yapıştırın</li>
              </ol>
            </div>
          </div>
        )}

        {config && activeTab === 'collector' && (
          <div>
            <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>📡 Canlı Toplayıcı</h2>
                <button onClick={() => setIsCollecting(!isCollecting)} style={{ padding: '10px 24px', background: isCollecting ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', border: `1px solid ${isCollecting ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'}`, borderRadius: '8px', color: isCollecting ? '#ef4444' : '#22c55e', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isCollecting ? '⏹️ DURDUR' : '▶️ BAŞLAT'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>{stats.messagesScanned}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Taranan Mesaj</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>{stats.codesFound}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Bulunan Kod</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>{coupons.length}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Toplam Kayıtlı</div>
                </div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>{isCollecting ? '🟢' : '🔴'}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{isCollecting ? 'Kodlar Toplanıyor...' : 'Duruyor'}</div>
                <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '13px' }}>{isCollecting ? 'Her 5 saniyede kanallar taranıyor' : 'Başlat butonuna basın'}</div>
              </div>
            </div>
            {coupons.length > 0 && (
              <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🕐 Son Bulunan Kodlar</h3>
                {coupons.slice(0, 5).map(coupon => (
                  <div key={coupon.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
                    <div>
                      <code style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>{coupon.code}</code>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{coupon.source} • {coupon.collectedAt.toLocaleTimeString('tr-TR')}</div>
                    </div>
                    <button onClick={() => copyCode(coupon.code)} style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '6px', color: '#a855f7', fontSize: '12px', cursor: 'pointer' }}>📋 Kopyala</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {config && activeTab === 'codes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🎫 Toplanan Kodlar ({coupons.length})</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { const allCodes = coupons.map(c => c.code).join('\n'); navigator.clipboard.writeText(allCodes); showMessage('📋 Tüm kodlar kopyalandı', 'success'); }} style={{ padding: '8px 14px', background: 'rgba(147,51,234,0.2)', border: '1px solid rgba(147,51,234,0.4)', borderRadius: '6px', color: '#a855f7', fontSize: '12px', cursor: 'pointer' }}>📋 Tümünü Kopyala</button>
                {coupons.length > 0 && (<button onClick={clearAll} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>🗑️ Temizle</button>)}
              </div>
            </div>
            {coupons.length === 0 ? (
              <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ color: '#94a3b8' }}>Henüz kod toplanmadı</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Toplayıcıyı başlatın, kodlar burada görünecek</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {coupons.map(coupon => (
                  <div key={coupon.id} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <code style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>{coupon.code}</code>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>📡 {coupon.source} • 🕐 {coupon.collectedAt.toLocaleString('tr-TR')}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => copyCode(coupon.code)} style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '6px', color: '#a855f7', fontSize: '12px', cursor: 'pointer' }}>📋</button>
                        {coupon.status === 'new' && (<button onClick={() => updateStatus(coupon.id, 'used')} style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '6px', color: '#22c55e', fontSize: '12px', cursor: 'pointer' }}>✓</button>)}
                        <button onClick={() => deleteCoupon(coupon.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                    {coupon.fullText && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>Orijinal mesaj</summary>
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{coupon.fullText}</p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
