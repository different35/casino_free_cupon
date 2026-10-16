import { CollectedCoupon } from '../types';

interface CollectedCodesProps {
  coupons: CollectedCoupon[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: CollectedCoupon['status']) => void;
  onClearAll: () => void;
}

export default function CollectedCodes({ coupons, onDelete, onUpdateStatus, onClearAll }: CollectedCodesProps) {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const copyAll = () => {
    const allCodes = coupons.map(c => c.code).join('\n');
    navigator.clipboard.writeText(allCodes);
  };

  const getStatusBadge = (status: CollectedCoupon['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">🆕 YENİ</span>;
      case 'used':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">✓ KULLANILDI</span>;
      case 'expired':
        return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">⏰ SÜRESİ DOLDU</span>;
      case 'saved':
        return <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">💾 KAYDEDİLDİ</span>;
    }
  };

  if (coupons.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-6">🎫</div>
        <h2 className="text-2xl font-bold text-white mb-3">Henüz kod toplanmadı</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Bot bağlayın ve toplamaya başlayın. Tespit edilen kupon kodları burada listelenecek.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Toplanan Kodlar</h2>
          <p className="text-gray-400 text-sm">{coupons.length} kod bulundu</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyAll}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            📋 Tümünü Kopyala
          </button>
          <button
            onClick={onClearAll}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🗑️ Temizle
          </button>
        </div>
      </div>

      {/* Code List */}
      <div className="space-y-3">
        {coupons.map((coupon, index) => (
          <div
            key={coupon.id}
            className={`bg-gray-800/40 border rounded-xl p-4 transition-all ${
              index === 0 ? 'border-green-500/30' : 'border-gray-700/50 hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Code */}
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-xl font-mono font-bold text-yellow-300 tracking-wider">
                    {coupon.code}
                  </code>
                  {getStatusBadge(coupon.status)}
                </div>

                {/* Source Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-broadcast-tower"></i>
                    {coupon.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-clock"></i>
                    {coupon.collectedAt.toLocaleString('tr-TR')}
                  </span>
                </div>

                {/* Full Text Preview */}
                {coupon.fullText && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
                      Orijinal mesajı göster
                    </summary>
                    <p className="text-xs text-gray-500 mt-1 bg-gray-900/50 rounded p-2 font-mono break-all">
                      {coupon.fullText}
                    </p>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => copyCode(coupon.code)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  📋 Kopyala
                </button>
                <div className="flex gap-1">
                  {coupon.status === 'new' && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(coupon.id, 'used')}
                        className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2 py-1 rounded text-[10px] transition-colors"
                        title="Kullanıldı olarak işaretle"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onUpdateStatus(coupon.id, 'saved')}
                        className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-2 py-1 rounded text-[10px] transition-colors"
                        title="Kaydet"
                      >
                        💾
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(coupon.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-2 py-1 rounded text-[10px] transition-colors"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
