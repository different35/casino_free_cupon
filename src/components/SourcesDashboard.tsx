import { telegramSources, officialBots, codeFormats } from '../data/telegramSources';
import { useState } from 'react';

export default function SourcesDashboard() {
  const [filter, setFilter] = useState<'all' | 'tr' | 'en'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'channel' | 'group' | 'bot'>('all');

  const filteredSources = telegramSources.filter(source => {
    const matchesLang = filter === 'all' || source.language === filter || source.language === 'both';
    const matchesType = typeFilter === 'all' || source.type === typeFilter;
    return matchesLang && matchesType;
  });

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-5">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>📡</span> Telegram Kaynak Envanteri
        </h2>
        <p className="text-gray-300 text-sm">
          Casino bonus kodlarını en hızlı yakalamak için bu kanalları takip edin. 
          Flash drop'lar saniyeler içinde tükendiğinden bildirimleri açık tutun.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">⚡ Flash Drop: 19:30</span>
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">📅 VIP: Cumartesi 12:30 GMT</span>
          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">🇹🇷 TR Kanallar: 19:00-22:00</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'tr', label: '🇹🇷 Türkçe' },
            { value: 'en', label: '🇬🇧 İngilizce' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.value ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          {[
            { value: 'all', label: 'Tüm Türler' },
            { value: 'channel', label: '📢 Kanal' },
            { value: 'group', label: '💬 Grup' },
            { value: 'bot', label: '🤖 Bot' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                typeFilter === f.value ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map(source => (
          <div
            key={source.id}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-sm">{source.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => copyUsername(source.username)}
                    className="text-purple-400 hover:text-purple-300 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    {source.username}
                    <i className="fas fa-copy text-[10px]"></i>
                  </button>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    source.type === 'channel' ? 'bg-blue-500/20 text-blue-300' :
                    source.type === 'group' ? 'bg-green-500/20 text-green-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {source.type === 'channel' ? '📢 Kanal' : source.type === 'group' ? '💬 Grup' : '🤖 Bot'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    source.language === 'tr' ? 'bg-red-500/20 text-red-300' : 'bg-gray-600/30 text-gray-400'
                  }`}>
                    {source.language === 'tr' ? '🇹🇷' : '🇬🇧'}
                  </span>
                </div>
              </div>
              {source.subscriberCount && (
                <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                  👥 {source.subscriberCount}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div>
                <span className="text-gray-500">Platform:</span>
                <span className="text-gray-300 ml-1">{source.platform}</span>
              </div>
              <div>
                <span className="text-gray-500">Ödül:</span>
                <span className="text-yellow-300 ml-1 font-medium">{source.rewardRange}</span>
              </div>
              <div>
                <span className="text-gray-500">Frekans:</span>
                <span className="text-gray-300 ml-1">{source.dropFrequency}</span>
              </div>
              <div>
                <span className="text-gray-500">Yoğun Saat:</span>
                <span className="text-orange-300 ml-1 font-medium">{source.peakHours.join(', ')}</span>
              </div>
            </div>

            {source.notes && (
              <p className="text-xs text-gray-500 mt-3 border-t border-gray-700/30 pt-2">
                💡 {source.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Official Bots */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🤖</span> Resmi Casino Botları
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {officialBots.map(bot => (
            <div key={bot.name} className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🤖</div>
              <p className="text-white text-xs font-mono">{bot.name}</p>
              <p className="text-gray-500 text-[10px] mt-1">{bot.platform}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Code Formats */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🔤</span> Kod Formatları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(codeFormats).map(([key, format]) => (
            <div key={key} className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-3">
              <h4 className="text-purple-300 text-sm font-bold capitalize mb-2">{key}</h4>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-500">Format:</span> <code className="text-yellow-300">{format.pattern}</code></p>
                <p><span className="text-gray-500">Örnek:</span> <code className="text-green-300">{format.example}</code></p>
                <p><span className="text-gray-500">Ömür:</span> <span className="text-red-300">{format.lifespan}</span></p>
                <p><span className="text-gray-500">Limit:</span> <span className="text-gray-300">{format.limit}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Warning */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
        <h3 className="text-red-300 font-bold text-sm mb-2 flex items-center gap-2">
          ⚠️ Önemli Notlar
        </h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Flash drop kodları 10-15 saniye içinde tükenir. Bildirimler açık olmalı.</li>
          <li>• Stake.com kodları için son 7 günde $3,000-$10,000+ bahis hacmi gerekli.</li>
          <li>• Reddit'ten paylaşılan kodlar zamanlama gecikmesi nedeniyle genelde geçersizdir.</li>
          <li>• Kodların %80'i 15 dakika içinde geçersiz hale gelir.</li>
          <li>• Bu uygulama sadece takip aracıdır, kodların geçerliliğini garanti etmez.</li>
        </ul>
      </div>
    </div>
  );
}
