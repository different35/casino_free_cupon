interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  platformFilter: string;
  setPlatformFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function FilterBar({ filter, setFilter, platformFilter, setPlatformFilter, searchQuery, setSearchQuery }: FilterBarProps) {
  const statusFilters = [
    { value: 'all', label: 'Tümü', icon: '📋' },
    { value: 'new', label: 'Yeni', icon: '🆕' },
    { value: 'active', label: 'Aktif', icon: '✅' },
    { value: 'expired', label: 'Süresi Dolmuş', icon: '⏰' },
  ];

  const platformFilters = [
    { value: 'all', label: 'Tüm Platformlar' },
    { value: 'betmgm', label: 'BetMGM' },
    { value: 'draftkings', label: 'DraftKings' },
    { value: 'caesars', label: 'Caesars' },
    { value: 'fanuel', label: 'FanDuel' },
    { value: 'golden_nugget', label: 'Golden Nugget' },
    { value: 'borgata', label: 'Borgata' },
    { value: 'hard_rock', label: 'Hard Rock' },
    { value: 'unibet', label: 'Unibet' },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
      {/* Search */}
      <div className="relative mb-4">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          placeholder="Kod veya platform ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              filter === f.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2">
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="bg-gray-900/50 border border-gray-600/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
        >
          {platformFilters.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
