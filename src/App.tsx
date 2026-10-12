import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import CouponCard from './components/CouponCard';
import FilterBar from './components/FilterBar';
import NotificationPanel from './components/NotificationPanel';
import AddCouponModal from './components/AddCouponModal';
import { Coupon } from './types';

const STORAGE_KEY = 'slotbonus_coupons';

function loadCoupons(): Coupon[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((c: any) => ({
        ...c,
        detectedAt: new Date(c.detectedAt),
        expiresAt: new Date(c.expiresAt),
      }));
    }
  } catch (e) {
    console.error('Veri yükleme hatası:', e);
  }
  return [];
}

function saveCoupons(coupons: Coupon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Veri kaydetme hatası:', e);
  }
}

function App() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setCoupons(loadCoupons());
    setLoaded(true);
  }, []);

  // Save to localStorage whenever coupons change
  useEffect(() => {
    if (loaded) {
      saveCoupons(coupons);
    }
  }, [coupons, loaded]);

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
    setNotifications(prev => [`📋 Kopyalandı: ${code}`, ...prev].slice(0, 50));
  }, []);

  const addCoupon = useCallback((coupon: Omit<Coupon, 'id' | 'detectedAt'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      detectedAt: new Date(),
    };
    setCoupons(prev => [newCoupon, ...prev]);
    setNotifications(prev => [`✅ Kod eklendi: ${coupon.code}`, ...prev].slice(0, 50));
    setShowAddModal(false);
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateCouponStatus = useCallback((id: string, status: Coupon['status']) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }, []);

  const stats = {
    total: coupons.length,
    new: coupons.filter(c => c.status === 'new').length,
    active: coupons.filter(c => c.isActive && c.status !== 'expired').length,
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

        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-3">Henüz kod eklenmedi</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Casino sitelerinden bulduğunuz bonus ve free spin kupon kodlarını buraya ekleyin. 
              Kodlarınız bu tarayıcıda kalıcı olarak saklanır.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
            >
              <span>+</span> İlk Kodu Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredCoupons.map(coupon => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onCopy={copyCode}
                onDelete={deleteCoupon}
                onUpdateStatus={updateCouponStatus}
              />
            ))}
          </div>
        )}

        {coupons.length > 0 && filteredCoupons.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-gray-300">Filtreye uygun kod bulunamadı</h3>
            <p className="text-gray-500 mt-2">Filtreleri değiştirin</p>
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
