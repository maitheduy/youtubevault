export interface VideoLink {
  id: string;
  topicId: string;
  url: string; // e.g. "https://youtu.be/HUGEDN72uDs" or "https://www.youtube.com/watch?v=..."
  title: string;
  meaning: string; // Ý nghĩa / mục đích học tập
  duration?: string;
  tags: string[];
  isCompleted: boolean;
  createdAt: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  content: string; // Markdown or rich text notes
  videoLinks: VideoLink[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string; // e.g. "MAE101"
  name: string; // e.g. "Toán cao cấp 1"
  description: string;
  color: string; // Tailwind color class or hex
  icon: string; // Lucide icon name
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  isPasswordEnabled: boolean;
  passwordHash?: string; // SHA-256 or derived key verification
  theme: 'dark' | 'light';
  autoLockMinutes: number;
}
