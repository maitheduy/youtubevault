import React, { useState } from 'react';
import { X, Shield, KeyRound, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { Subject, AppSettings } from '../types';
import { loadSettings, saveSettings, hashPassword, encryptDataFile, decryptDataFile, DEFAULT_SUBJECTS } from '../utils/storage';

interface SettingsModalProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  subjects,
  onUpdateSubjects,
  onClose
}) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [importStatus, setImportStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleTogglePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!settings.isPasswordEnabled) {
      // Enabling password
      if (!newPassword || newPassword !== confirmPassword) {
        setPasswordMessage({ text: 'Mật khẩu mới không khớp hoặc để trống.', isError: true });
        return;
      }
      try {
        const hashed = await hashPassword(newPassword);
        const updated: AppSettings = {
          ...settings,
          isPasswordEnabled: true,
          passwordHash: hashed
        };
        saveSettings(updated);
        setSettings(updated);
        setPasswordMessage({ text: 'Đã bật bảo mật mật khẩu thành công!', isError: false });
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setPasswordMessage({ text: 'Lỗi mã hóa mật khẩu.', isError: true });
      }
    } else {
      // Disabling password (verify current password)
      try {
        const hashedCurrent = await hashPassword(currentPassword);
        if (hashedCurrent !== settings.passwordHash) {
          setPasswordMessage({ text: 'Mật khẩu hiện tại không chính xác.', isError: true });
          return;
        }
        const updated: AppSettings = {
          ...settings,
          isPasswordEnabled: false,
          passwordHash: undefined
        };
        saveSettings(updated);
        setSettings(updated);
        setPasswordMessage({ text: 'Đã tắt bảo mật mật khẩu.', isError: false });
        setCurrentPassword('');
      } catch (err) {
        setPasswordMessage({ text: 'Lỗi xác thực.', isError: true });
      }
    }
  };

  // Export JSON file
  const handleExportJSON = async () => {
    try {
      const dataToExport = { subjects, settings };
      const jsonStr = await encryptDataFile(dataToExport, settings.isPasswordEnabled ? settings.passwordHash : undefined);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studyvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Lỗi xuất file sao lưu.');
    }
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        let dataToLoad;
        try {
          dataToLoad = JSON.parse(content);
        } catch (err) {
          throw new Error('File JSON không hợp lệ.');
        }

        let importedSubjects = DEFAULT_SUBJECTS;
        if (dataToLoad.subjects) {
          importedSubjects = dataToLoad.subjects;
        } else if (dataToLoad.data?.subjects) {
          importedSubjects = dataToLoad.data.subjects;
        }

        onUpdateSubjects(importedSubjects);
        setImportStatus({ text: 'Nhập dữ liệu thành công!', isError: false });
      } catch (err: any) {
        setImportStatus({ text: err.message || 'Lỗi đọc file dữ liệu.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục dữ liệu mẫu ban đầu? Mọi dữ liệu hiện tại sẽ được thay thế.')) {
      onUpdateSubjects(DEFAULT_SUBJECTS);
      alert('Đã khôi phục dữ liệu mẫu thành công!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-slate-100 space-y-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold">Cài đặt, Bảo mật & Sao lưu</h3>
              <p className="text-xs text-slate-400">Quản lý mật khẩu cục bộ và file sao lưu JSON an toàn.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Security Password */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm font-bold">Bảo mật Mật khẩu Cục bộ</h4>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
              settings.isPasswordEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {settings.isPasswordEnabled ? 'Đang bật' : 'Đang tắt'}
            </span>
          </div>

          <form onSubmit={handleTogglePassword} className="space-y-4 pt-2">
            {!settings.isPasswordEnabled ? (
              <>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thiết lập Mật khẩu Mới</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Xác nhận Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu..."
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  <Lock className="h-4 w-4" />
                  <span>Bật Bảo Mật Mật Khẩu</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nhập Mật khẩu Hiện tại để Tắt</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mật khẩu hiện tại..."
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Tắt Bảo Mật</span>
                </button>
              </>
            )}

            {passwordMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMessage.isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                {passwordMessage.isError ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}
          </form>
        </div>

        {/* Section 2: Export & Import JSON Backup */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-100">Sao lưu & Đồng bộ File Cục bộ (JSON)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Xuất dữ liệu thành file JSON nhẹ nhàng để chuyển đổi nhanh chóng và tiện lợi giữa các thiết bị (Laptop, PC, Tablet) mà không cần internet.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Xuất File Sao Lưu (.JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-all">
              <Upload className="h-4 w-4 text-indigo-400" />
              <span>Nhập File Sao Lưu</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              {importStatus.isError ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <span>{importStatus.text}</span>
            </div>
          )}
        </div>

        {/* Section 3: Reset Data */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-100">Khôi phục Dữ liệu Mẫu Ban Đầu</h4>
            <p className="text-xs text-slate-400 mt-0.5">Tải lại các môn học mẫu (MAE101, MAS, AI101) có sẵn.</p>
          </div>
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Khôi phục Mẫu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
