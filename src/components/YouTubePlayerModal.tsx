import React, { useState } from 'react';
import { X, Play, Tag, Edit3, CheckCircle2, Circle, ExternalLink, Save } from 'lucide-react';
import { VideoLink } from '../types';
import { getYouTubeEmbedUrl } from '../utils/storage';

interface YouTubePlayerModalProps {
  video: VideoLink;
  subjectName?: string;
  topicName?: string;
  onClose: () => void;
  onUpdateVideo: (updated: VideoLink) => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  video,
  subjectName,
  topicName,
  onClose,
  onUpdateVideo
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [meaning, setMeaning] = useState(video.meaning);
  const [url, setUrl] = useState(video.url);
  const [isCompleted, setIsCompleted] = useState(video.isCompleted);

  const embedUrl = getYouTubeEmbedUrl(url);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVideo({
      ...video,
      title,
      meaning,
      url,
      isCompleted
    });
    setIsEditing(false);
  };

  const toggleComplete = () => {
    const nextStatus = !isCompleted;
    setIsCompleted(nextStatus);
    onUpdateVideo({
      ...video,
      isCompleted: nextStatus
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Play className="h-5 w-5 fill-rose-500/20" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                {subjectName && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                    {subjectName}
                  </span>
                )}
                {topicName && (
                  <span className="text-xs text-slate-400">• {topicName}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{video.title}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isCompleted 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{isCompleted ? 'Đã hoàn thành' : 'Chưa học'}</span>
            </button>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Chỉnh sửa video & ý nghĩa"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* YouTube Embed Player */}
          <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-lg">
            {embedUrl ? (
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title={video.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Không thể tải video YouTube từ liên kết này.
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 space-y-4">
              <h4 className="text-sm font-semibold text-slate-200">Chỉnh sửa thông tin Video</h4>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề Video</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Liên kết YouTube (URL)</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Ý nghĩa / Mục đích học tập</label>
                <textarea
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Ghi chú ý nghĩa, kiến thức trọng tâm cần nhớ từ video này..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Ý nghĩa / Mục đích học tập */}
              <div className="rounded-2xl bg-indigo-950/20 border border-indigo-500/30 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Ý nghĩa & Mục đích học tập
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {video.meaning || 'Chưa có ghi chú ý nghĩa cho video này.'}
                </p>
              </div>

              {/* Tags & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  {video.tags && video.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Mở trên YouTube gốc</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
