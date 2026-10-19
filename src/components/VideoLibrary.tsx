import React, { useState } from 'react';
import { Video, Play, Search, CheckCircle2, Circle, Sparkles, Tag } from 'lucide-react';
import { Subject, VideoLink } from '../types';
import { getYouTubeThumbnail } from '../utils/storage';

interface VideoLibraryProps {
  subjects: Subject[];
  onOpenVideoPlayer: (video: VideoLink, subjectName: string, topicName: string) => void;
  searchQuery: string;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  subjects,
  onOpenVideoPlayer,
  searchQuery
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Flatten all videos with their subject & topic info
  interface VideoItem extends VideoLink {
    subjectName: string;
    subjectCode: string;
    topicName: string;
  }

  const allVideos: VideoItem[] = [];
  subjects.forEach(sub => {
    if (selectedSubjectFilter !== 'all' && sub.id !== selectedSubjectFilter) return;
    sub.chapters?.forEach(chap => {
      chap.topics?.forEach(top => {
        top.videoLinks?.forEach(vid => {
          allVideos.push({
            ...vid,
            subjectName: sub.name,
            subjectCode: sub.code,
            topicName: top.title
          });
        });
      });
    });
  });

  // Filter by searchQuery and status
  const filteredVideos = allVideos.filter(vid => {
    const matchesSearch = 
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'completed' && !vid.isCompleted) return false;
    if (filterStatus === 'pending' && vid.isCompleted) return false;

    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Video className="h-6 w-6 text-rose-400" />
            <span>Thư Viện Video YouTube</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tổng hợp tất cả video bài giảng. Đường link được ẩn an toàn, hiển thị trực quan ý nghĩa và mục đích học tập.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả môn học</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Đã học
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chưa học
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((vid) => {
            const thumbnail = getYouTubeThumbnail(vid.url);
            return (
              <div
                key={vid.id}
                className="group relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div
                    onClick={() => onOpenVideoPlayer(vid, vid.subjectName, vid.topicName)}
                    className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={thumbnail}
                      alt={vid.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/50">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-600/90 text-white text-[10px] font-bold shadow-md">
                        {vid.subjectCode}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-medium shadow-md ${
                        vid.isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                      }`}>
                        {vid.isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                        <span>{vid.isCompleted ? 'Đã học' : 'Chưa học'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Meaning */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-slate-400 truncate">
                      {vid.subjectName} • {vid.topicName}
                    </div>
                    <h3
                      onClick={() => onOpenVideoPlayer(vid, vid.subjectName, vid.topicName)}
                      className="text-base font-bold text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors"
                    >
                      {vid.title}
                    </h3>

                    {/* Ý nghĩa */}
                    <div className="rounded-2xl bg-indigo-950/20 border border-indigo-500/25 p-3.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        <span>Ý nghĩa học tập</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {vid.meaning}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap gap-1">
                    {vid.tags?.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onOpenVideoPlayer(vid, vid.subjectName, vid.topicName)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Xem Video</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Video className="h-12 w-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-slate-300">Không tìm thấy video nào</h3>
            <p className="text-xs text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
          </div>
        )}
      </div>

    </div>
  );
};
