import { Coupon } from '../types';
import { platformNames, bonusTypeNames } from '../data/sampleData';

interface CouponCardProps {
  coupon: Coupon;
  onCopy: (code: string) => void;
}

export default function CouponCard({ coupon, onCopy }: CouponCardProps) {
  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}sn önce`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}dk önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}sa önce`;
    const days = Math.floor(hours / 24);
    return `${days}g önce`;
  };

  const timeUntilExpiry = (date: Date): string => {
    const seconds = Math.floor((date.getTime() - new Date().getTime()) / 1000);
    if (seconds < 0) return 'Süresi doldu';
    const hours = Math.floor(seconds / 3600);
    if (hours < 1) return `${Math.floor(seconds / 60)}dk kaldı`;
    if (hours < 24) return `${hours}sa kaldı`;
    return `${Math.floor(hours / 24)}g kaldı`;
  };

  const getStatusBadge = () => {
    switch (coupon.status) {
      case 'new':
        return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">🆕 YENİ</span>;
      case 'active':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">✅ AKTİF</span>;
      case 'expired':
        return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">⏰ SÜRESİ DOLDU</span>;
      case 'used':
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">✓ KULLANILDI</span>;
    }
  };

  const getBonusIcon = () => {
    switch (coupon.bonusType) {
      case 'free_spins': return '🎡';
      case 'deposit_match': return '💰';
      case 'no_deposit': return '🎁';
      case 'cashback': return '🔄';
    }
  };

  const getPlatformColor = () => {
    const colors: Record<string, string> = {
      betmgm: 'from-orange-500/10 to-orange-600/10 border-orange-500/30',
      draftkings: 'from-green-500/10 to-green-600/10 border-green-500/30',
      caesars: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30',
      fanuel: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
      golden_nugget: 'from-amber-500/10 to-amber-600/10 border-amber-500/30',
      borgata: 'from-red-500/10 to-red-600/10 border-red-500/30',
      hard_rock: 'from-gray-500/10 to-gray-600/10 border-gray-500/30',
      unibet: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/30',
    };
    return colors[coupon.platform] || 'from-purple-500/10 to-purple-600/10 border-purple-500/30';
  };

  return (
    <div className={`bg-gradient-to-br ${getPlatformColor()} border rounded-xl p-4 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getBonusIcon()}</span>
            <span className="text-sm font-medium text-gray-300">{platformNames[coupon.platform]}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{timeSince(coupon.detectedAt)}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Code */}
      <div className="bg-black/30 rounded-lg p-3 mb-3 flex items-center justify-between">
        <code className="text-lg font-mono font-bold text-yellow-300 tracking-wider">{coupon.code}</code>
        <button
          onClick={() => onCopy(coupon.code)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
        >
          <i className="fas fa-copy"></i>
          Kopyala
        </button>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{bonusTypeNames[coupon.bonusType]}</span>
          <span className="text-white font-bold">${coupon.value}</span>
        </div>
        <span className={`text-xs ${coupon.expiresAt < new Date() ? 'text-red-400' : 'text-gray-400'}`}>
          ⏱️ {timeUntilExpiry(coupon.expiresAt)}
        </span>
      </div>
    </div>
  );
}
