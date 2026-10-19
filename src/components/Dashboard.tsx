import React from 'react';
import { BookOpen, Video, CheckCircle2, Award, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Subject } from '../types';

interface DashboardProps {
  subjects: Subject[];
  onSelectTab: (tab: string) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  subjects,
  onSelectTab,
  onSelectSubject
}) => {
  // Calculate totals
  const totalSubjects = subjects.length;
  let totalChapters = 0;
  let totalTopics = 0;
  let totalVideos = 0;
  let completedVideos = 0;

  subjects.forEach(sub => {
    sub.chapters?.forEach(chap => {
      totalChapters++;
      chap.topics?.forEach(top => {
        totalTopics++;
        top.videoLinks?.forEach(vid => {
          totalVideos++;
          if (vid.isCompleted) completedVideos++;
        });
      });
    });
  });

  const completionRate = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Không gian Học tập Kỷ nguyên AI</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            Quản lý tri thức thông minh & ngoại tuyến hoàn toàn
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tổ chức môn học, chương, chủ đề và các liên kết video YouTube ẩn đường link rườm rà. Tập trung tuyệt đối vào ý nghĩa kiến thức và tiến độ học tập cá nhân.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('subjects')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Vào Quản lý Môn học</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectTab('videos')}
              className="flex items-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
            >
              <Video className="h-4 w-4 text-rose-400" />
              <span>Thư viện Video YouTube</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Tổng Môn Học</span>
            <BookOpen className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100">{totalSubjects}</div>
          <p className="text-xs text-slate-500">MAE101, MAS, AI101, v.v.</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Chương & Chủ Đề</span>
            <Award className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100">{totalChapters} / {totalTopics}</div>
          <p className="text-xs text-slate-500">Phân cấp chi tiết từng môn</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Thư Viện Video</span>
            <Video className="h-5 w-5 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100">{totalVideos}</div>
          <p className="text-xs text-slate-500">Ẩn link gốc, tập trung ý nghĩa</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Tiến Độ Học Tập</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100">{completionRate}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Subjects & Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">Môn Học Nổi Bật</h3>
          <button
            onClick={() => onSelectTab('subjects')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Xem tất cả ({subjects.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {subjects.map((sub) => {
            let subVideos = 0;
            let subCompleted = 0;
            sub.chapters?.forEach(c => c.topics?.forEach(t => t.videoLinks?.forEach(v => {
              subVideos++;
              if (v.isCompleted) subCompleted++;
            })));

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className="group relative cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl hover:border-indigo-500/50 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Video className="h-3.5 w-3.5 text-rose-400" />
                    {subVideos} videos
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {sub.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-500">
                  <span>{sub.chapters?.length || 0} chương học</span>
                  <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                    Vào môn học →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
