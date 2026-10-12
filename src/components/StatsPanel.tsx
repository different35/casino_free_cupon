import { Stats } from '../types';

interface StatsPanelProps {
  stats: Stats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon="📊"
        label="Toplam Kod"
        value={stats.total}
        color="from-blue-500/20 to-blue-600/20"
        borderColor="border-blue-500/30"
      />
      <StatCard
        icon="🆕"
        label="Yeni Kodlar"
        value={stats.new}
        color="from-green-500/20 to-green-600/20"
        borderColor="border-green-500/30"
      />
      <StatCard
        icon="✅"
        label="Aktif"
        value={stats.active}
        color="from-purple-500/20 to-purple-600/20"
        borderColor="border-purple-500/30"
      />
      <StatCard
        icon="📅"
        label="Bugün"
        value={stats.today}
        color="from-yellow-500/20 to-yellow-600/20"
        borderColor="border-yellow-500/30"
      />
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  borderColor: string;
}

function StatCard({ icon, label, value, color, borderColor }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} border ${borderColor} rounded-xl p-4 backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
