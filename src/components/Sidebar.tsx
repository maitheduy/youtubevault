import React from 'react';
import { LayoutDashboard, BookOpen, Video, Timer, Settings, ShieldCheck, HardDrive } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  subjectsCount: number;
  videosCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  subjectsCount,
  videosCount
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Môn học & Ghi chú', icon: BookOpen, badge: subjectsCount },
    { id: 'videos', label: 'Thư viện Video YouTube', icon: Video, badge: videosCount },
    { id: 'pomodoro', label: 'Hẹn giờ Pomodoro', icon: Timer },
    { id: 'settings', label: 'Sao lưu & Bảo mật', icon: Settings }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Navigation items */}
        <nav className="space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Menu Chính
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Offline Storage Status Footer */}
      <div className="mt-8 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Lưu trữ Cục bộ An toàn</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Mọi ghi chú và video được mã hóa và lưu trực tiếp trên thiết bị của bạn. Không cần internet.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
          <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
          <span>Hỗ trợ Xuất/Nhập file JSON</span>
        </div>
      </div>
    </aside>
  );
};
