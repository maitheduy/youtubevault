import React from 'react';
import { Shield, Lock, Settings, Search, Download, Upload, BookOpen } from 'lucide-react';
import { loadSettings } from '../utils/storage';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLock: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onLock,
  onOpenSettings
}) => {
  const settings = loadSettings();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 md:px-8 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
            StudyVault Pro
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Offline AI Student Edition
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">Quản lý ghi chú & video học tập an toàn</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm môn học, chương, ghi chú, ý nghĩa video..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {settings.isPasswordEnabled && (
          <button
            onClick={onLock}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all"
            title="Khóa ngay không gian học tập"
          >
            <Lock className="h-4 w-4 text-indigo-400" />
            <span className="hidden lg:inline">Khóa Ứng Dụng</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all"
          title="Cài đặt & Sao lưu dữ liệu"
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span className="hidden lg:inline">Cài đặt & Sao lưu</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="hidden sm:inline">Ngoại tuyến 100%</span>
        </div>
      </div>
    </header>
  );
};
