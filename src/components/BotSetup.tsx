import { useState } from 'react';
import { BotConfig } from '../types';

interface BotSetupProps {
  config: BotConfig | null;
  onSave: (config: BotConfig) => void;
}

export default function BotSetup({ config, onSave }: BotSetupProps) {
  const [token, setToken] = useState(config?.token || '');
  const [botUsername, setBotUsername] = useState(config?.botUsername || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const testConnection = async () => {
    if (!token.trim()) {
      setTestResult({ ok: false, message: 'Token girin' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`);
      const data = await response.json();

      if (data.ok) {
        setBotUsername(data.result.username);
        setTestResult({ ok: true, message: `✅ Bağlandı: @${data.result.username} (${data.result.first_name})` });
      } else {
        setTestResult({ ok: false, message: `❌ Hata: ${data.description}` });
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: `❌ Bağlantı hatası: ${err.message}` });
    }

    setTesting(false);
  };

  const handleSave = () => {
    if (!token.trim() || !botUsername.trim()) return;
    onSave({
      token: token.trim(),
      botUsername: botUsername.trim(),
      monitoredChannels: [],
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span>🤖</span> Telegram Bot Kurulumu
        </h2>
        <p className="text-gray-300 text-sm mb-4">
          Casino kupon kodlarını otomatik toplamak için bir Telegram bot'a ihtiyacınız var. 
          Bot, üye olduğu kanallardaki mesajları okuyarak kupon kodlarını tespit eder.
        </p>

        <div className="bg-gray-900/50 rounded-lg p-4 space-y-3 text-sm">
          <h3 className="text-white font-bold">📋 Adımlar:</h3>
          <ol className="space-y-2 text-gray-300">
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Telegram'da <code className="bg-gray-800 px-1 rounded text-yellow-300">@BotFather</code> ile konuşun</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span><code className="bg-gray-800 px-1 rounded text-yellow-300">/newbot</code> komutunu yazın</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Bota bir isim verin (örn: "CasinoKodAvcisi")</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Bir username seçin (sonu "bot" ile bitmeli,örn: "casino_avci_bot")</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">5.</span>
              <span>BotFather size bir <strong className="text-yellow-300">API Token</strong> verecek</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">6.</span>
              <span>Botu kupon takip etmek istediğiniz kanallara <strong className="text-yellow-300">admin olarak ekleyin</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold">7.</span>
              <span>Token'ı aşağıya yapıştırın ve bağlanın</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Token Input */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Bot API Token</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
                className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              />
              <button
                onClick={testConnection}
                disabled={testing || !token.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {testing ? '⏳ Test...' : '🔌 Test Et'}
              </button>
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg text-sm ${
              testResult.ok ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {testResult.message}
            </div>
          )}

          {botUsername && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bot Kullanıcı Adı</label>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!token.trim() || !botUsername.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-lg transition-all"
          >
            💾 Kaydet ve Başla
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
        <h3 className="text-yellow-300 font-bold text-sm mb-2 flex items-center gap-2">
          ⚠️ Önemli: Bot Admin Olmalı
        </h3>
        <p className="text-gray-400 text-xs">
          Bot'un kanallardaki mesajları okuyabilmesi için kanala <strong className="text-yellow-300">admin olarak</strong> eklenmesi gerekir.
          Kanal ayarlarından "Manage Channel" → "Administrators" → "Add Administrator" yolunu izleyin.
          Bot'a en az "Post Messages" yetkisi verin.
        </p>
      </div>
    </div>
  );
}
