import React, { useState } from 'react';
import { BookOpen, Plus, FolderPlus, FileText, Video, ChevronRight, ArrowLeft, Trash2, Edit3, CheckCircle2, Circle, Play, Save, Sparkles, Tag } from 'lucide-react';
import { Subject, Chapter, Topic, VideoLink } from '../types';
import { getYouTubeThumbnail } from '../utils/storage';

interface SubjectManagerProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubjectId: (id: string | null) => void;
  onUpdateSubjects: (newSubjects: Subject[]) => void;
  onOpenVideoPlayer: (video: VideoLink, subjectName: string, topicName: string) => void;
  searchQuery: string;
}

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubjectId,
  onUpdateSubjects,
  onOpenVideoPlayer,
  searchQuery
}) => {
  // Modal & form states
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapDesc, setNewChapDesc] = useState('');

  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Add video state
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [vidTitle, setVidTitle] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidMeaning, setVidMeaning] = useState('');
  const [vidTags, setVidTags] = useState('');

  // Edit topic note state
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  // Find active topic across active subject
  let activeTopic: Topic | null = null;
  let activeChapter: Chapter | null = null;
  if (activeSubject) {
    for (const chap of activeSubject.chapters) {
      for (const top of chap.topics) {
        if (top.id === selectedTopicId) {
          activeTopic = top;
          activeChapter = chap;
          break;
        }
      }
    }
  }

  // Handlers for Subject
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      code: newSubCode.toUpperCase(),
      name: newSubName,
      description: newSubDesc,
      color: 'from-indigo-600 to-violet-700',
      icon: 'BookOpen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: []
    };

    onUpdateSubjects([...subjects, newSubject]);
    setNewSubCode('');
    setNewSubName('');
    setNewSubDesc('');
    setIsAddSubjectOpen(false);
  };

  const handleDeleteSubject = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa môn học này cùng toàn bộ chương và video?')) {
      onUpdateSubjects(subjects.filter(s => s.id !== subId));
      if (selectedSubjectId === subId) onSelectSubjectId(null);
    }
  };

  // Handlers for Chapter
  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !newChapTitle) return;

    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      subjectId: activeSubject.id,
      title: newChapTitle,
      description: newChapDesc,
      order: activeSubject.chapters.length + 1,
      topics: []
    };

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        return {
          ...s,
          chapters: [...s.chapters, newChapter],
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    onUpdateSubjects(updated);
    setNewChapTitle('');
    setNewChapDesc('');
    setIsAddChapterOpen(false);
  };

  // Handlers for Topic
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !selectedChapterId || !newTopicTitle) return;

    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      chapterId: selectedChapterId,
      title: newTopicTitle,
      content: newTopicContent || 'Ghi chú học tập mới...',
      videoLinks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        const updatedChapters = s.chapters.map(chap => {
          if (chap.id === selectedChapterId) {
            return {
              ...chap,
              topics: [...chap.topics, newTopic]
            };
          }
          return chap;
        });
        return { ...s, chapters: updatedChapters, updatedAt: new Date().toISOString() };
      }
      return s;
    });

    onUpdateSubjects(updated);
    setNewTopicTitle('');
    setNewTopicContent('');
    setIsAddTopicOpen(false);
    setSelectedTopicId(newTopic.id);
    setNoteContent(newTopic.content);
  };

  // Handlers for Video Link
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !activeTopic || !vidTitle || !vidUrl || !vidMeaning) return;

    const newVideo: VideoLink = {
      id: `vid-${Date.now()}`,
      topicId: activeTopic.id,
      url: vidUrl,
      title: vidTitle,
      meaning: vidMeaning,
      tags: vidTags ? vidTags.split(',').map(t => t.trim()) : ['Học tập'],
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        const updatedChapters = s.chapters.map(chap => {
          const updatedTopics = chap.topics.map(top => {
            if (top.id === activeTopic?.id) {
              return {
                ...top,
                videoLinks: [...top.videoLinks, newVideo],
                updatedAt: new Date().toISOString()
              };
            }
            return top;
          });
          return { ...chap, topics: updatedTopics };
        });
        return { ...s, chapters: updatedChapters, updatedAt: new Date().toISOString() };
      }
      return s;
    });

    onUpdateSubjects(updated);
    setVidTitle('');
    setVidUrl('');
    setVidMeaning('');
    setVidTags('');
    setIsAddVideoOpen(false);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (!activeSubject || !activeTopic) return;
    if (!confirm('Bạn có chắc chắn muốn xóa video này khỏi chủ đề?')) return;

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        const updatedChapters = s.chapters.map(chap => {
          const updatedTopics = chap.topics.map(top => {
            if (top.id === activeTopic?.id) {
              return {
                ...top,
                videoLinks: top.videoLinks.filter(v => v.id !== videoId),
                updatedAt: new Date().toISOString()
              };
            }
            return top;
          });
          return { ...chap, topics: updatedTopics };
        });
        return { ...s, chapters: updatedChapters, updatedAt: new Date().toISOString() };
      }
      return s;
    });

    onUpdateSubjects(updated);
  };

  const handleToggleVideoComplete = (videoId: string) => {
    if (!activeSubject || !activeTopic) return;

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        const updatedChapters = s.chapters.map(chap => {
          const updatedTopics = chap.topics.map(top => {
            if (top.id === activeTopic?.id) {
              return {
                ...top,
                videoLinks: top.videoLinks.map(v => v.id === videoId ? { ...v, isCompleted: !v.isCompleted } : v),
                updatedAt: new Date().toISOString()
              };
            }
            return top;
          });
          return { ...chap, topics: updatedTopics };
        });
        return { ...s, chapters: updatedChapters, updatedAt: new Date().toISOString() };
      }
      return s;
    });

    onUpdateSubjects(updated);
  };

  const handleSaveNote = () => {
    if (!activeSubject || !activeTopic) return;

    const updated = subjects.map(s => {
      if (s.id === activeSubject.id) {
        const updatedChapters = s.chapters.map(chap => {
          const updatedTopics = chap.topics.map(top => {
            if (top.id === activeTopic?.id) {
              return {
                ...top,
                content: noteContent,
                updatedAt: new Date().toISOString()
              };
            }
            return top;
          });
          return { ...chap, topics: updatedTopics };
        });
        return { ...s, chapters: updatedChapters, updatedAt: new Date().toISOString() };
      }
      return s;
    });

    onUpdateSubjects(updated);
    setIsEditingNote(false);
  };

  // Filter subjects by searchQuery
  const filteredSubjects = subjects.filter(s => 
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* View 1: Subject List */}
      {!selectedSubjectId ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-100">Quản lý Môn học & Ghi chú</h2>
              <p className="text-sm text-slate-400 mt-1">
                Tổ chức kiến thức theo từng môn (MAE101, MAS, AI101...), chương và chủ đề chuyên sâu.
              </p>
            </div>
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Môn Học Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((sub) => {
              let totalVids = 0;
              let totalTops = 0;
              sub.chapters?.forEach(c => c.topics?.forEach(t => {
                totalTops++;
                totalVids += t.videoLinks?.length || 0;
              }));

              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubjectId(sub.id)}
                  className="group relative cursor-pointer rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl hover:border-indigo-500/60 transition-all space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        {sub.code}
                      </span>
                      <button
                        onClick={(e) => handleDeleteSubject(sub.id, e)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa môn học"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>{sub.chapters?.length || 0} chương</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <Video className="h-3.5 w-3.5" />
                        {totalVids} video
                      </span>
                    </div>
                    <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Chi tiết <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: Subject Detail & Chapters / Topics / Notes / Hidden Videos */
        <div className="space-y-6">
          
          {/* Top Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  onSelectSubjectId(null);
                  setSelectedTopicId(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại Môn học</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    {activeSubject?.code}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-100">{activeSubject?.name}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeSubject?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddChapterOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <FolderPlus className="h-4 w-4 text-indigo-400" />
                <span>Thêm Chương</span>
              </button>
            </div>
          </div>

          {/* Main Layout: Sidebar Chapters / Topics vs Active Topic Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Chapters & Topics Tree */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cấu trúc Chương & Chủ đề
                  </h3>
                </div>

                {activeSubject?.chapters && activeSubject.chapters.length > 0 ? (
                  <div className="space-y-4">
                    {activeSubject.chapters.map((chap) => (
                      <div key={chap.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 px-2 py-1 bg-indigo-950/20 rounded-xl border border-indigo-500/20">
                          <span>{chap.title}</span>
                          <button
                            onClick={() => {
                              setSelectedChapterId(chap.id);
                              setIsAddTopicOpen(true);
                            }}
                            className="p-1 rounded hover:bg-indigo-900/40 text-indigo-300"
                            title="Thêm chủ đề mới vào chương"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="pl-3 space-y-1">
                          {chap.topics && chap.topics.length > 0 ? (
                            chap.topics.map((top) => {
                              const isSelected = selectedTopicId === top.id;
                              return (
                                <button
                                  key={top.id}
                                  onClick={() => {
                                    setSelectedTopicId(top.id);
                                    setNoteContent(top.content);
                                    setIsEditingNote(false);
                                  }}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                  }`}
                                >
                                  <span className="truncate">{top.title}</span>
                                  <span className="text-[10px] opacity-70">
                                    {top.videoLinks?.length || 0} vids
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="text-[11px] text-slate-500 px-3 py-1 italic">
                              Chưa có chủ đề nào. Bấm nút [+] để thêm.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs space-y-3">
                    <p>Chưa có chương học nào trong môn này.</p>
                    <button
                      onClick={() => setIsAddChapterOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium"
                    >
                      Tạo Chương Đầu Tiên
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Topic Content & YouTube Links (Hidden Raw URL) */}
            <div className="lg:col-span-8 space-y-6">
              {activeTopic ? (
                <div className="space-y-6">
                  
                  {/* Topic Header */}
                  <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        {activeChapter?.title}
                      </span>
                      <span className="text-xs text-indigo-400 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        {activeTopic.videoLinks?.length || 0} Video bài giảng
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">{activeTopic.title}</h3>

                    {/* Notes Section */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-400" />
                          <span>Ghi Chú Học Tập & Tóm Tắt Ý Nghĩa</span>
                        </h4>
                        {!isEditingNote ? (
                          <button
                            onClick={() => setIsEditingNote(true)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Chỉnh sửa ghi chú</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSaveNote}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Lưu ghi chú</span>
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          rows={8}
                          className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                          placeholder="Viết ghi chú markdown tại đây..."
                        />
                      ) : (
                        <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                          {activeTopic.content}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* YouTube Video Links Section (Hidden Raw URL, focus on Meaning & Title) */}
                  <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Video className="h-4 w-4" />
                        </span>
                        <h4 className="text-base font-bold text-slate-100">Video YouTube & Ý Nghĩa Học Tập</h4>
                      </div>
                      <button
                        onClick={() => setIsAddVideoOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Thêm Video YouTube</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {activeTopic.videoLinks && activeTopic.videoLinks.length > 0 ? (
                        activeTopic.videoLinks.map((vid) => {
                          const thumbnail = getYouTubeThumbnail(vid.url);
                          const currentSubjectName = activeSubject?.name || '';
                          return (
                            <div
                              key={vid.id}
                              className="group relative rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-lg hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                            >
                              <div>
                                {/* Thumbnail Header */}
                                <div 
                                  onClick={() => onOpenVideoPlayer(vid, activeSubject!.name, activeTopic!.title)}
                                  className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
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
                                  <div className="absolute top-3 left-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleVideoComplete(vid.id);
                                      }}
                                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium shadow-md transition-all ${
                                        vid.isCompleted 
                                          ? 'bg-emerald-600 text-white' 
                                          : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                                      }`}
                                    >
                                      {vid.isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                      <span>{vid.isCompleted ? 'Đã học' : 'Chưa học'}</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Title & Hidden Raw URL details */}
                                <div className="p-4 space-y-3">
                                  <h5 
                                    onClick={() => onOpenVideoPlayer(vid, activeSubject!.name, activeTopic!.title)}
                                    className="text-sm font-bold text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors"
                                  >
                                    {vid.title}
                                  </h5>

                                  {/* Ý nghĩa / Mục đích học tập (No ugly raw URL displayed directly) */}
                                  <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 p-3">
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

                              <div className="px-4 pb-4 pt-0 flex items-center justify-between border-t border-slate-800/60 pt-3">
                                <div className="flex flex-wrap gap-1">
                                  {vid.tags?.map((tag, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onOpenVideoPlayer(vid, activeSubject!.name, activeTopic!.title)}
                                    className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-medium transition-all"
                                  >
                                    Xem video
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVideo(vid.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Xóa video"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-500 space-y-3">
                          <Video className="h-8 w-8 mx-auto text-slate-600" />
                          <p className="text-xs">Chưa có video YouTube nào trong chủ đề này.</p>
                          <button
                            onClick={() => setIsAddVideoOpen(true)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium"
                          >
                            Thêm Video Đầu Tiên
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Chọn một Chủ đề để xem Ghi chú & Video</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Chọn một chương và chủ đề từ danh sách bên trái hoặc tạo mới để bắt đầu ghi chú và quản lý video bài giảng.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Modal: Add Subject */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-6">
            <h3 className="text-lg font-bold">Thêm Môn Học Mới</h3>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mã môn học (Ví dụ: MAE101)</label>
                <input
                  type="text"
                  required
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="MAE101"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tên môn học</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Toán Cao Cấp 1"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mô tả môn học</label>
                <textarea
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  rows={3}
                  placeholder="Nền tảng vi tích phân..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Tạo Môn Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Chapter */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-6">
            <h3 className="text-lg font-bold">Thêm Chương Mới cho {activeSubject?.code}</h3>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tiêu đề chương (Ví dụ: Chương 1: Giới hạn)</label>
                <input
                  type="text"
                  required
                  value={newChapTitle}
                  onChange={(e) => setNewChapTitle(e.target.value)}
                  placeholder="Chương 1: Giới hạn và Hàm số"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mô tả chương</label>
                <textarea
                  value={newChapDesc}
                  onChange={(e) => setNewChapDesc(e.target.value)}
                  rows={2}
                  placeholder="Nội dung chính..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Tạo Chương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Topic */}
      {isAddTopicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-6">
            <h3 className="text-lg font-bold">Thêm Chủ Đề Mới</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tiêu đề chủ đề (Ví dụ: 1.1 Khái niệm giới hạn)</label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="1.1 Khái niệm giới hạn hàm số"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ghi chú ban đầu (Markdown)</label>
                <textarea
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  rows={4}
                  placeholder="Nội dung ghi chú cốt lõi..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Tạo Chủ Đề
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add YouTube Video */}
      {isAddVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Video className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">Thêm Video YouTube Mới</h3>
                <p className="text-xs text-slate-400">Đường link sẽ được ẩn sạch sẽ, tập trung vào ý nghĩa học tập.</p>
              </div>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tiêu đề Video</label>
                <input
                  type="text"
                  required
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  placeholder="Ví dụ: Bản chất hình học của Giới hạn"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Đường link YouTube (Ví dụ: https://youtu.be/HUGEDN72uDs)</label>
                <input
                  type="text"
                  required
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  placeholder="https://youtu.be/HUGEDN72uDs"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ý nghĩa / Mục đích học tập (Bắt buộc để dễ ôn tập)</label>
                <textarea
                  required
                  rows={3}
                  value={vidMeaning}
                  onChange={(e) => setVidMeaning(e.target.value)}
                  placeholder="Ghi chú ý nghĩa, lý do cần xem video này, kiến thức cốt lõi..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={vidTags}
                  onChange={(e) => setVidTags(e.target.value)}
                  placeholder="Toán căn bản, Luyện thi"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Thêm Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
