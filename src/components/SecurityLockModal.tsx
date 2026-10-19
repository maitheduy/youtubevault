import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { hashPassword, loadSettings, saveSettings } from '../utils/storage';

interface SecurityLockModalProps {
  onUnlock: () => void;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({ onUnlock }) => {
  const settings = loadSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const hashed = await hashPassword(password);
      if (hashed === settings.passwordHash) {
        onUnlock();
      } else {
        setError('Mật khẩu không chính xác. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi xác thực.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-slate-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-6">
          <Lock className="h-8 w-8 animate-pulse" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">StudyVault Pro Locked</h2>
          <p className="text-sm text-slate-400 mt-2">
            Ứng dụng ghi chú ngoại tuyến của bạn được bảo vệ bằng mã hóa mật khẩu an toàn. Nhập mật khẩu để truy cập.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <KeyRound className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Mở khóa Không gian Học tập</span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-500">
            100% Ngoại tuyến & Bảo mật dữ liệu cục bộ • Không cần kết nối internet
          </p>
        </div>
      </div>
    </div>
  );
};
