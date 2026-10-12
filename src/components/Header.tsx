interface HeaderProps {
  notifications: string[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onAddCoupon: () => void;
}

export default function Header({ notifications, showNotifications, setShowNotifications, onAddCoupon }: HeaderProps) {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎰</div>
          <div>
            <h1 className="text-xl font-bold text-white">SlotBonus Tracker</h1>
            <p className="text-xs text-purple-300">Casino Kupon Kodlarınızı Takip Edin</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Coupon */}
          <button
            onClick={onAddCoupon}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span className="hidden sm:inline">Kod Ekle</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-300 hover:text-white transition-colors"
          >
            <i className="fas fa-bell text-lg"></i>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
