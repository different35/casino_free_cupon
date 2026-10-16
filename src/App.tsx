import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    if (!token.trim()) {
      setMessage('❌ Token girin');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`);
      const data = await response.json();

      if (data.ok) {
        setBotUsername(data.result.username);
        setIsConnected(true);
        setMessage(`✅ Bağlandı: @${data.result.username}`);
      } else {
        setMessage(`❌ Hata: ${data.description}`);
      }
    } catch (err: any) {
      setMessage(`❌ Bağlantı hatası: ${err.message}`);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setMessage(`📋 Kopyalandı: ${code}`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎰</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Casino Kod Avcısı
          </h1>
          <p style={{ color: '#a78bfa', fontSize: '16px' }}>
            Telegram'dan Otomatik Kupon Toplayıcı
          </p>
        </div>

        {/* Status */}
        {isConnected && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
              ✅ Bağlı: @{botUsername}
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Setup */}
        {!isConnected ? (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              🤖 Bot Kurulumu
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <button
              onClick={testConnection}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔌 Bağlan ve Test Et
            </button>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <strong style={{ color: 'white' }}>📋 Nasıl yapılır?</strong>
              <ol style={{ marginTop: '12px', paddingLeft: '20px' }}>
                <li>@BotFather ile konuşun</li>
                <li>/newbot komutunu yazın</li>
                <li>Bota isim verin</li>
                <li>Token'ı kopyalayın</li>
                <li>Botu kanallara admin olarak ekleyin</li>
                <li>Token'ı buraya yapıştırın</li>
              </ol>
            </div>
          </div>
        ) : (
          <div>
            {/* Collector */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  📡 Canlı Toplayıcı
                </h2>
                <button
                  onClick={() => setIsCollecting(!isCollecting)}
                  style={{
                    padding: '10px 24px',
                    background: isCollecting ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    border: `1px solid ${isCollecting ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                    borderRadius: '8px',
                    color: isCollecting ? '#ef4444' : '#22c55e',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {isCollecting ? '⏹️ DURDUR' : '▶️ BAŞLAT'}
                </button>
              </div>

              <div style={{
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {isCollecting ? '🟢' : '🔴'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {isCollecting ? 'Kodlar Toplanıyor...' : 'Duruyor'}
                </div>
                <div style={{ color: '#94a3b8', marginTop: '8px' }}>
                  {codes.length} kod bulundu
                </div>
              </div>
            </div>

            {/* Codes */}
            {codes.length > 0 && (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px',
                padding: '32px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                  🎫 Toplanan Kodlar
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {codes.map((code, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '8px',
                        border: '1px solid rgba(100, 116, 139, 0.3)'
                      }}
                    >
                      <code style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>
                        {code}
                      </code>
                      <button
                        onClick={() => copyCode(code)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(168, 85, 247, 0.2)',
                          border: '1px solid rgba(168, 85, 247, 0.5)',
                          borderRadius: '6px',
                          color: '#a855f7',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Kopyala
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
