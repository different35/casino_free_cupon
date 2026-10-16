import { useState } from 'react';

function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '700px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚠️</div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Bu İş Bu Ortamda Yapılamaz
        </h1>

        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '2px solid rgba(239,68,68,0.4)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '18px', marginBottom: '16px' }}>
            ❌ Neden Yapamıyorum?
          </h2>
          <ul style={{ lineHeight: '2', color: '#e2e8f0' }}>
            <li><strong>CORS Engeli:</strong> Tarayıcıdan Telegram API'ye direkt bağlanamazsınız</li>
            <li><strong>Backend Yok:</strong> Bu ortam sadece statik HTML/CSS/JS üretir</li>
            <li><strong>Sunucu Yok:</strong> Polling yapacak, mesajları dinleyecek bir sunucu yok</li>
            <li><strong>Güvenlik:</strong> Token'ı güvenli saklayacak bir yer yok</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(34,197,94,0.1)',
          border: '2px solid rgba(34,197,94,0.4)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <h2 style={{ color: '#22c55e', fontSize: '18px', marginBottom: '16px' }}>
            ✅ Ne Yapmanız Gerekiyor?
          </h2>
          <ol style={{ lineHeight: '2', color: '#e2e8f0' }}>
            <li><strong>Kendi bilgisayarınızda</strong> Node.js kurun</li>
            <li><strong>Telegram Bot API</strong> ile bir bot oluşturun (@BotFather)</li>
            <li><strong>Backend sunucusu</strong> yazın (Express + node-telegram-bot-api)</li>
            <li><strong>Sunucuyu deploy</strong> edin (Vercel, Railway, Render, kendi sunucunuz)</li>
            <li><strong>Bot'u kanallara</strong> admin olarak ekleyin</li>
            <li><strong>Frontend</strong> backend API'ye bağlanır</li>
          </ol>
        </div>

        <div style={{
          background: 'rgba(168,85,247,0.1)',
          border: '2px solid rgba(168,85,247,0.4)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <h2 style={{ color: '#a855f7', fontSize: '18px', marginBottom: '16px' }}>
            💡 Alternatif Çözümler
          </h2>
          <ul style={{ lineHeight: '2', color: '#e2e8f0' }}>
            <li><strong>Telegram Desktop:</strong> Kanal bildirimlerini açık tutun, manuel kopyalayın</li>
            <li><strong>Telegram Bot:</strong> Hazır bot servisleri kullanın (@MissRose_bot gibi)</li>
            <li><strong>Python Script:</strong> Kendi bilgisayarınızda Python ile Telethon/Pyrogram kullanın</li>
            <li><strong>Chrome Extension:</strong> Telegram Web'den kod toplayan eklenti yazın</li>
          </ul>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          {showInfo ? '🔼 Detayları Gizle' : '🔽 Teknik Detayları Göster'}
        </button>

        {showInfo && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(100,116,139,0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'left',
            fontSize: '13px',
            color: '#94a3b8'
          }}>
            <h3 style={{ color: 'white', marginBottom: '12px' }}>Teknik Açıklama</h3>
            <p style={{ marginBottom: '12px' }}>
              <strong>CORS (Cross-Origin Resource Sharing):</strong> Tarayıcılar güvenlik nedeniyle farklı domain'lere istek atmayı engeller. 
              Telegram API (api.telegram.org) tarayıcıdan direkt erişime izin vermez.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Çözüm:</strong> Backend sunucusu gerekir. Sunucu Telegram API'ye bağlanır, frontend sunucuya bağlanır.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Bu Ortam:</strong> Sadece statik dosyalar üretir (HTML, CSS, JS). Sunucu çalıştıramaz, veritabanı tutamaz, API çağrısı yapamaz.
            </p>
            <p>
              <strong>Sonuç:</strong> Telegram entegrasyonu bu ortamda <span style={{ color: '#ef4444', fontWeight: 'bold' }}>İMKANSIZ</span>.
            </p>
          </div>
        )}

        <div style={{ marginTop: '32px', color: '#64748b', fontSize: '12px' }}>
          <p>Dürüstlük &gt; Sahte Entegrasyon</p>
        </div>
      </div>
    </div>
  );
}

export default App;
