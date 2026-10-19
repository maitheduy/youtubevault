import React, { useState, useEffect } from 'react';
import { Subject, VideoLink, AppSettings } from './types';
import { loadSubjects, saveSubjects, loadSettings } from './utils/storage';
import { SecurityLockModal } from './components/SecurityLockModal';
import { YouTubePlayerModal } from './components/YouTubePlayerModal';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SubjectManager } from './components/SubjectManager';
import { VideoLibrary } from './components/VideoLibrary';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>(() => loadSubjects());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  
  // Security lock state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = loadSettings();
    return s.isPasswordEnabled;
  });

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeVideoModal, setActiveVideoModal] = useState<{
    video: VideoLink;
    subjectName: string;
    topicName: string;
  } | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync subjects to storage when changed
  const handleUpdateSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    saveSubjects(newSubjects);
  };

  // Count total videos
  let totalVideos = 0;
  subjects.forEach(sub => {
    sub.chapters?.forEach(chap => {
      chap.topics?.forEach(top => {
        totalVideos += top.videoLinks?.length || 0;
      });
    });
  });

  const handleOpenVideoPlayer = (video: VideoLink, subjectName: string, topicName: string) => {
    setActiveVideoModal({ video, subjectName, topicName });
  };

  const handleUpdateSingleVideo = (updatedVideo: VideoLink) => {
    const updatedSubjects = subjects.map(sub => {
      const updatedChapters = sub.chapters.map(chap => {
        const updatedTopics = chap.topics.map(top => {
          if (top.id === updatedVideo.topicId) {
            return {
              ...top,
              videoLinks: top.videoLinks.map(v => v.id === updatedVideo.id ? updatedVideo : v)
            };
          }
          return top;
        });
        return { ...chap, topics: updatedTopics };
      });
      return { ...sub, chapters: updatedChapters };
    });

    handleUpdateSubjects(updatedSubjects);
    if (activeVideoModal) {
      setActiveVideoModal({
        ...activeVideoModal,
        video: updatedVideo
      });
    }
  };

  if (isLocked) {
    return <SecurityLockModal onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLock={() => setIsLocked(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'subjects') {
              // keep selected subject if any, or clear
            }
          }}
          subjectsCount={subjects.length}
          videosCount={totalVideos}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'dashboard' && (
            <Dashboard
              subjects={subjects}
              onSelectTab={setCurrentTab}
              onSelectSubject={(subId) => {
                setSelectedSubjectId(subId);
                setCurrentTab('subjects');
              }}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectManager
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubjectId={setSelectedSubjectId}
              onUpdateSubjects={handleUpdateSubjects}
              onOpenVideoPlayer={handleOpenVideoPlayer}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'videos' && (
            <VideoLibrary
              subjects={subjects}
              onOpenVideoPlayer={handleOpenVideoPlayer}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'pomodoro' && (
            <PomodoroTimer />
          )}

          {currentTab === 'settings' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6">
                <h2 className="text-2xl font-bold">Cài đặt & Bảo mật</h2>
                <p className="text-sm text-slate-400">
                  Mở bảng cài đặt đầy đủ để quản lý mật khẩu cục bộ và xuất/nhập file sao lưu JSON.
                </p>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Mở Cài Đặt & Sao Lưu
                </button>
              </div>
            </div>
          )}
        </main>

      </div>

      {/* YouTube Player Modal */}
      {activeVideoModal && (
        <YouTubePlayerModal
          video={activeVideoModal.video}
          subjectName={activeVideoModal.subjectName}
          topicName={activeVideoModal.topicName}
          onClose={() => setActiveVideoModal(null)}
          onUpdateVideo={handleUpdateSingleVideo}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          subjects={subjects}
          onUpdateSubjects={handleUpdateSubjects}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

    </div>
  );
}
