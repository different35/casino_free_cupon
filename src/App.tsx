import { useState, useEffect, useRef } from 'react';

// Backend API URL - production'da değiştirin
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CollectedCoupon {
  id: string;
  code: string;
  source: string;
  collectedAt: string;
  fullText: string;
  status: 'new' | 'used' | 'saved';
}

interface BotStatus {
  success: boolean;
  bot?: {
    username: string;
    id: number;
    firstName: string;
  };
  codesCollected: number;
  uptime: number;
  error?: string;
}

function App() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [coupons, setCoupons] = useState<CollectedCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Backend durumunu kontrol et
  const checkStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        setError(null);
      } else {
        setError(data.error || 'Backend bağlantı hatası');
      }
    } catch (err: any) {
      setError(`Backend'e bağlanılamıyor: ${err.message}`);
      setStatus(null);
    }
  };

  // Kodları getir
  const fetchCodes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/codes`);
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.codes.reverse()); // En yeni üstte
      }
    } catch (err: any) {
      console.error('Kodlar alınamadı:', err.message);
    }
  };

  // İlk yükleme
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkStatus();
      await fetchCodes();
      setLoading(false);
    };
    init();
  }, []);

  // Polling - her 5 saniyede bir güncelle
  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      await checkStatus();
      await fetchCodes();
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Kod kopyala
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`📋 Kopyalandı: ${code}`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Kopyalama başarısız');
    }
  };

  // Kod sil
  const deleteCode = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/codes/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        setMessage('🗑️ Kod silindi');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setMessage('❌ Silme başarısız');
    }
  };

  // Tüm kodları temizle
  const clearAll = async () => {
    if (!window.confirm('Tüm kodlar silinecek. Emin misiniz?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/codes`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setCoupons([]);
        setMessage('🗑️ Tüm kodlar silindi');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setMessage('❌ Temizleme başarısız');
    }
  };

  // Tüm kodları kopyala
  const copyAll = async () => {
    const allCodes = coupons.map(c => c.code).join('\n');
    try {
      await navigator.clipboard.writeText(allCodes);
      setMessage(`📋 ${coupons.length} kod kopyalandı`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Kopyalama başarısız');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎰</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎰</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>
            Casino Kod Avcısı
          </h1>
          <p style={{ color: '#a78bfa', fontSize: '14px' }}>
            Telegram'dan Otomatik Kupon Toplayıcı
          </p>
        </div>

        {/* Backend Status */}
        {status && status.success ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>
                  ✅ Backend Bağlı
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                  Bot: @{status.bot?.username} • {status.codesCollected} kod toplandı
                </div>
              </div>
              <div style={{
                padding: '6px 12px',
                background: 'rgba(34,197,94,0.2)',
                border: '1px solid rgba(34,197,94,0.4)',
                borderRadius: '6px',
                color: '#22c55e',
                fontSize: '12px'
              }}>
                🟢 Aktif
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>
              ❌ Backend Bağlantı Hatası
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
              {error || 'Backend sunucusu çalışmıyor'}
            </div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>
              Backend'i başlatın: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>cd backend && npm start</code>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(168,85,247,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
              {status?.codesCollected || 0}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Toplam Kod</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
              {coupons.filter(c => c.status === 'new').length}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Yeni Kod</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
              {status?.uptime ? Math.floor(status.uptime / 60) : 0}dk
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Çalışma Süresi</div>
          </div>
        </div>

        {/* Codes Section */}
        <div style={{
          background: 'rgba(30,41,59,0.5)',
          border: '1px solid rgba(100,116,139,0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
              🎫 Toplanan Kodlar ({coupons.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {coupons.length > 0 && (
                <>
                  <button
                    onClick={copyAll}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(147,51,234,0.2)',
                      border: '1px solid rgba(147,51,234,0.4)',
                      borderRadius: '6px',
                      color: '#a855f7',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Tümünü Kopyala
                  </button>
                  <button
                    onClick={clearAll}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Temizle
                  </button>
                </>
              )}
            </div>
          </div>

          {coupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <p style={{ color: '#94a3b8' }}>Henüz kod toplanmadı</p>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                Backend çalışıyor ve kanalları tarıyor...
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  style={{
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(100,116,139,0.3)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <code style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>
                        {coupon.code}
                      </code>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        📡 {coupon.source} • 🕐 {new Date(coupon.collectedAt).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(168,85,247,0.2)',
                          border: '1px solid rgba(168,85,247,0.4)',
                          borderRadius: '6px',
                          color: '#a855f7',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Kopyala
                      </button>
                      <button
                        onClick={() => deleteCode(coupon.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(239,68,68,0.2)',
                          border: '1px solid rgba(239,68,68,0.4)',
                          borderRadius: '6px',
                          color: '#ef4444',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {coupon.fullText && (
                    <details style={{ marginTop: '8px' }}>
                      <summary style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>
                        Orijinal mesaj
                      </summary>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {coupon.fullText}
                      </p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
