import { peakHoursData } from '../data/telegramSources';
import { useState, useEffect } from 'react';

export default function PeakHoursWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const isFlashDropTime = currentHour === 19 && currentMinute >= 25 && currentMinute <= 35;
  const isTurkishPeak = currentHour >= 19 && currentHour < 22;
  const isScheduledTime = currentHour >= 10 && currentHour < 14;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getHourActivity = (hour: number): { level: number; label: string } => {
    if (hour === 19) return { level: 3, label: '🔥 FLASH DROP' };
    if (hour >= 19 && hour < 22) return { level: 2, label: 'TR Kanallar Yoğun' };
    if (hour >= 10 && hour < 14) return { level: 2, label: 'Planlanmış Duyurular' };
    if (hour >= 14 && hour < 16) return { level: 1, label: 'Orta Aktivite' };
    return { level: 0, label: 'Düşük' };
  };

  return (
    <div className="space-y-6">
      {/* Current Time & Status */}
      <div className="bg-gradient-to-r from-gray-800/50 to-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-mono">
              {currentTime.toLocaleTimeString('tr-TR')}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {isFlashDropTime && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 animate-pulse">
                <span className="text-red-300 font-bold text-sm">⚡ FLASH DROP ZAMANI!</span>
              </div>
            )}
            {isTurkishPeak && !isFlashDropTime && (
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg px-4 py-2">
                <span className="text-orange-300 font-bold text-sm">🇹🇷 TR Kanallar Aktif</span>
              </div>
            )}
            {isScheduledTime && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-4 py-2">
                <span className="text-blue-300 font-bold text-sm">📋 Planlanmış Duyurular</span>
              </div>
            )}
            {!isFlashDropTime && !isTurkishPeak && !isScheduledTime && (
              <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-2">
                <span className="text-gray-400 text-sm">💤 Düşük aktivite dönemi</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 24-Hour Timeline */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">📊 24 Saat Aktivite Haritası</h3>
        <div className="grid grid-cols-12 gap-1">
          {hours.map(hour => {
            const activity = getHourActivity(hour);
            const isCurrentHour = hour === currentHour;
            return (
              <div
                key={hour}
                className={`relative rounded-lg p-2 text-center transition-all ${
                  activity.level === 3 ? 'bg-red-500/30 border border-red-500/50' :
                  activity.level === 2 ? 'bg-orange-500/20 border border-orange-500/30' :
                  activity.level === 1 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                  'bg-gray-700/20 border border-gray-700/30'
                } ${isCurrentHour ? 'ring-2 ring-purple-500 scale-110 z-10' : ''}`}
              >
                <div className="text-xs font-bold text-white">{hour}:00</div>
                <div className="mt-1">
                  {activity.level === 3 && <span className="text-red-400">⚡</span>}
                  {activity.level === 2 && <span className="text-orange-400">🔥</span>}
                  {activity.level === 1 && <span className="text-yellow-400">📊</span>}
                  {activity.level === 0 && <span className="text-gray-600">—</span>}
                </div>
                {isCurrentHour && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/30 rounded border border-red-500/50"></span> Flash Drop</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500/20 rounded border border-orange-500/30"></span> Yüksek</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500/10 rounded border border-yellow-500/20"></span> Orta</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-700/20 rounded border border-gray-700/30"></span> Düşük</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Şu an</span>
        </div>
      </div>

      {/* Peak Time Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(peakHoursData).map(([key, data]) => (
          <div key={key} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">
                {key === 'flashDrops' && '⚡'}
                {key === 'scheduledAnnouncements' && '📋'}
                {key === 'entertainment' && '🎭'}
                {key === 'weeklyVIP' && '👑'}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">
                  {key === 'flashDrops' && 'Flash Drop'}
                  {key === 'scheduledAnnouncements' && 'Planlanmış Duyurular'}
                  {key === 'entertainment' && 'Eğlence Kanalları'}
                  {key === 'weeklyVIP' && 'Haftalık VIP'}
                </h4>
                <p className="text-purple-300 font-mono text-xs">{data.time}</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{data.description}</p>
            <div className="flex flex-wrap gap-1">
              {data.platforms.map(p => (
                <span key={p} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Next Drops Countdown */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">🎯 Sonraki Drop Zamanları</h3>
        <div className="space-y-3">
          <NextDrop
            label="Flash Drop (Stake.com)"
            targetHour={19}
            targetMinute={30}
            icon="⚡"
          />
          <NextDrop
            label="TR Kanallar Yoğun Saat"
            targetHour={19}
            targetMinute={0}
            icon="🇹🇷"
          />
          <NextDrop
            label="Planlanmış Duyurular"
            targetHour={10}
            targetMinute={0}
            icon="📋"
          />
          <NextDrop
            label="VIP Haftalık (Cumartesi)"
            targetHour={15}
            targetMinute={30}
            icon="👑"
            isWeekly
            targetDay={6}
          />
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3">💡 Yakalama Stratejisi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400">1.</span>
              <p className="text-gray-300">19:25'te Telegram'ı açın. Flash drop 19:30'da gelir, kodlar saniyeler içinde tükenir.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">2.</span>
              <p className="text-gray-300">Bildirimleri açık tutun. @StakecomDailyDrops, @StakeUSDailyDrops kanallarında sessize almayın.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">3.</span>
              <p className="text-gray-300">Stake.com için son 7 günde min. $3,000 bahis yapın, yoksa kodlar çalışmaz.</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400">4.</span>
              <p className="text-gray-300">Türkçe kanallar için 19:00-22:00 arası aktif olun. @kodbonus, @bonuskaplani takip edin.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">5.</span>
              <p className="text-gray-300">Cumartesi 12:30 GMT (15:30 TR) VIP boost için hazır olun.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">6.</span>
              <p className="text-gray-300">Reddit'ten gelen kodları kullanmayın, zamanlama gecikmesi nedeniyle genelde geçersizdir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextDrop({ label, targetHour, targetMinute, icon, isWeekly, targetDay }: {
  label: string;
  targetHour: number;
  targetMinute: number;
  icon: string;
  isWeekly?: boolean;
  targetDay?: number;
}) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();

  let minutesUntil: number;
  
  if (isWeekly && targetDay !== undefined) {
    const daysUntil = (targetDay - currentDay + 7) % 7;
    const hoursUntil = (daysUntil * 24) + (targetHour - currentHour);
    minutesUntil = (hoursUntil * 60) + (targetMinute - currentMinute);
    if (minutesUntil < 0) minutesUntil += 7 * 24 * 60;
  } else {
    minutesUntil = ((targetHour - currentHour) * 60) + (targetMinute - currentMinute);
    if (minutesUntil < 0) minutesUntil += 24 * 60;
  }

  const hours = Math.floor(minutesUntil / 60);
  const mins = minutesUntil % 60;
  const isSoon = minutesUntil < 30;

  return (
    <div className={`flex items-center justify-between rounded-lg p-3 ${
      isSoon ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-900/30 border border-gray-700/30'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <div className={`font-mono text-sm font-bold ${isSoon ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
        {hours > 0 ? `${hours}sa ` : ''}{mins}dk
      </div>
    </div>
  );
}
