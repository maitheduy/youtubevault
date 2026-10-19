import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, CheckCircle, Flame, Coffee, Sparkles } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const times = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work') {
        setSessionsCompleted(prev => prev + 1);
        alert('Hoàn thành 1 phiên học tập Pomodoro! Hãy nghỉ ngơi ngắn nhé.');
      } else {
        alert('Đã hết thời gian nghỉ! Sẵn sàng quay lại học tập chưa?');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(times[newMode]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(times[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((times[mode] - timeLeft) / times[mode]) * 100;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hẹn Giờ Tập Trung Sinh Viên AI</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Pomodoro Focus Timer</h2>
        <p className="text-sm text-slate-400">
          Phương pháp quản lý thời gian khoa học giúp bạn ghi nhớ sâu và học tập hiệu quả không mệt mỏi.
        </p>
      </div>

      {/* Timer Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>

        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center justify-center rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
          <button
            onClick={() => switchMode('work')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'work' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>Học Tập (25m)</span>
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="h-4 w-4" />
            <span>Nghỉ Ngắn (5m)</span>
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="h-4 w-4" />
            <span>Nghỉ Dài (15m)</span>
          </button>
        </div>

        {/* Timer Display */}
        <div className="space-y-4">
          <div className="text-7xl font-black tracking-wider text-slate-100 font-mono">
            {formatTime(timeLeft)}
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold shadow-xl transition-all ${
              isRunning 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" />
                <span>Bắt Đầu Tập Trung</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 transition-colors"
            title="Đặt lại thời gian"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Stats footer */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center gap-3 text-xs text-slate-400">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Đã hoàn thành hôm nay: <strong className="text-slate-100">{sessionsCompleted} phiên học tập</strong></span>
        </div>
      </div>

    </div>
  );
};
