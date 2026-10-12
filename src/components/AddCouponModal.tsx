import { useState } from 'react';
import { Coupon, CasinoPlatform, BonusType } from '../types';
import { platformNames, bonusTypeNames } from '../data/sampleData';

interface AddCouponModalProps {
  onClose: () => void;
  onAdd: (coupon: Omit<Coupon, 'id' | 'detectedAt'>) => void;
}

export default function AddCouponModal({ onClose, onAdd }: AddCouponModalProps) {
  const [code, setCode] = useState('');
  const [platform, setPlatform] = useState<CasinoPlatform>('betmgm');
  const [bonusType, setBonusType] = useState<BonusType>('free_spins');
  const [value, setValue] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onAdd({
      code: code.toUpperCase().trim(),
      platform,
      status: 'new',
      bonusType,
      value,
      expiresAt: new Date(Date.now() + 72 * 3600000),
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎫</span>
            Manuel Kod Ekle
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Kupon Kodu</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: BONUS123ABC"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 font-mono text-lg tracking-wider focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              required
            />
          </div>

          {/* Platform Select */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as CasinoPlatform)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            >
              {Object.entries(platformNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* Bonus Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bonus Türü</label>
            <select
              value={bonusType}
              onChange={(e) => setBonusType(e.target.value as BonusType)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            >
              {Object.entries(bonusTypeNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Değer ($)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              min={1}
              max={1000}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            🎰 Kodu Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
