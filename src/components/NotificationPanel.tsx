interface NotificationPanelProps {
  notifications: string[];
  onClose: () => void;
  onClear: () => void;
}

export default function NotificationPanel({ notifications, onClose, onClear }: NotificationPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative w-full max-w-sm bg-gray-900 border-l border-gray-700 h-full overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fas fa-bell text-yellow-400"></i>
            Bildirimler
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Temizle
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">Henüz bildirim yok</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 animate-fade-in"
              >
                {notification}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
