import { BotConfig, CollectedCoupon, CollectorStats } from '../types';

interface LiveCollectorProps {
  isCollecting: boolean;
  config: BotConfig | null;
  stats: CollectorStats;
  error: string | null;
  coupons: CollectedCoupon[];
  onStart: () => void;
  onStop: () => void;
  onGoToSetup: () => void;
}

export default function LiveCollector({ isCollecting, config, stats, error, coupons, onStart, onStop, onGoToSetup }: LiveCollectorProps) {
  if (!config) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-6">🤖</div>
        <h2 className="text-2xl font-bold text-white mb-3">Bot Bağlantısı Yok</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Telegram'dan otomatik kod toplamak için önce bir bot bağlamanız gerekiyor.
        </p>
        <button
          onClick={onGoToSetup}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          ⚙️ Bot Kurulumuna Git
        </button>
      </div>
    );
  }

  const recentCoupons = coupons.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Status Panel */}
      <div className={`rounded-xl p-6 border ${
        isCollecting 
          ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-500/30' 
          : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${isCollecting ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isCollecting ? '🟢 Kodlar Toplanıyor...' : '🔴 Duruyor'}
              </h2>
              <p className="text-sm text-gray-400">
                Bot: @{config.botUsername}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isCollecting ? (
              <button
                onClick={onStart}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                ▶️ TOPLAMAYA BAŞLA
              </button>
            ) : (
              <button
                onClick={onStop}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                ⏹️ DURDUR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-xs">Taranan Mesaj</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.messagesScanned}</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-xs">Bulunan Kod</p>
          <p className="text-3xl font-bold text-yellow-300 mt-1">{stats.codesFound}</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-xs">Toplam Kaydedilen</p>
          <p className="text-3xl font-bold text-purple-300 mt-1">{coupons.length}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Live Feed */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📡</span> Canlı Akış
          {isCollecting && <span className="text-xs text-green-400 animate-pulse">● aktif</span>}
        </h3>

        {!isCollecting && coupons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Toplamayı başlatın, kodlar burada görünecek</p>
          </div>
        ) : recentCoupons.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500 text-sm">Henüz kod tespit edilmedi</p>
            <p className="text-gray-600 text-xs mt-1">
              {isCollecting ? 'Kanal mesajları taranıyor...' : 'Toplamayı başlatın'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentCoupons.map((coupon, index) => (
              <div
                key={coupon.id}
                className={`bg-gray-900/50 border rounded-lg p-3 flex items-center justify-between ${
                  index === 0 ? 'border-green-500/30 animate-fade-in' : 'border-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎫</span>
                  <div>
                    <code className="text-yellow-300 font-mono font-bold text-sm">{coupon.code}</code>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {coupon.source} • {coupon.collectedAt.toLocaleTimeString('tr-TR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(coupon.code)}
                  className="bg-purple-600/50 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  📋 Kopyala
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3">🔧 Nasıl Çalışıyor?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="text-white font-medium">Bot Kanalları Tarar</p>
              <p className="text-gray-400 text-xs mt-1">Her 5 saniyede bir yeni mesajları kontrol eder</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="text-white font-medium">Kodları Tespit Eder</p>
              <p className="text-gray-400 text-xs mt-1">Regex pattern'leri ile kupon kodlarını otomatik bulur</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <p className="text-white font-medium">Anında Kaydeder</p>
              <p className="text-gray-400 text-xs mt-1">Bulunan kodları anında kaydeder, kopyalayabilirsiniz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
