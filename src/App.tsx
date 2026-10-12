import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import CouponCard from './components/CouponCard';
import FilterBar from './components/FilterBar';
import NotificationPanel from './components/NotificationPanel';
import AddCouponModal from './components/AddCouponModal';
import { Coupon, CasinoPlatform, CouponStatus } from './types';
import { generateSampleCoupons } from './data/sampleData';

function App() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    setCoupons(generateSampleCoupons());
  }, []);

  // Simulate live coupon detection
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomChance = Math.random();
      if (randomChance > 0.85) {
        const platforms: CasinoPlatform[] = ['betmgm', 'draftkings', 'caesars', 'fanuel', 'golden_nugget', 'borgata'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        const code = `BONUS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newCoupon: Coupon = {
          id: Date.now().toString(),
          code,
          platform: randomPlatform,
          status: 'new',
          bonusType: Math.random() > 0.5 ? 'free_spins' : 'deposit_match',
          value: Math.floor(Math.random() * 100) + 10,
          detectedAt: new Date(),
          expiresAt: new Date(Date.now() + Math.random() * 86400000 * 3),
          isActive: true,
        };
        setCoupons(prev => [newCoupon, ...prev]);
        setNotifications(prev => [`🎰 Yeni kod tespit edildi: ${code} (${randomPlatform})`, ...prev].slice(0, 20));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesFilter = filter === 'all' || coupon.status === filter;
    const matchesPlatform = platformFilter === 'all' || coupon.platform === platformFilter;
    const matchesSearch = searchQuery === '' || 
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesPlatform && matchesSearch;
  });

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setNotifications(prev => [`📋 Kopyalandı: ${code}`, ...prev].slice(0, 20));
  }, []);

  const addCoupon = useCallback((coupon: Omit<Coupon, 'id' | 'detectedAt'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      detectedAt: new Date(),
    };
    setCoupons(prev => [newCoupon, ...prev]);
    setNotifications(prev => [`✅ Manuel kod eklendi: ${coupon.code}`, ...prev].slice(0, 20));
    setShowAddModal(false);
  }, []);

  const stats = {
    total: coupons.length,
    new: coupons.filter(c => c.status === 'new').length,
    active: coupons.filter(c => c.isActive).length,
    today: coupons.filter(c => {
      const today = new Date();
      return c.detectedAt.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isLive={isLive}
        setIsLive={setIsLive}
        onAddCoupon={() => setShowAddModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <StatsPanel stats={stats} />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          platformFilter={platformFilter}
          setPlatformFilter={setPlatformFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onCopy={copyCode}
            />
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎰</div>
            <h3 className="text-xl text-gray-300">Kupon bulunamadı</h3>
            <p className="text-gray-500 mt-2">Filtreleri değiştirin veya yeni kod ekleyin</p>
          </div>
        )}
      </main>

      {showAddModal && (
        <AddCouponModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCoupon}
        />
      )}

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotifications([])}
        />
      )}
    </div>
  );
}

export default App;
