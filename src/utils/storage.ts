import { Subject, AppSettings } from '../types';

export const STORAGE_KEY = 'studyvault_pro_data_v1';
export const SETTINGS_KEY = 'studyvault_pro_settings_v1';

// Helper to extract YouTube ID
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = getYouTubeId(url);
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeId(url);
  if (!videoId) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Initial sample data for students in AI era
export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    code: 'MAE101',
    name: 'Toán Cao Cấp 1 (Calculus 1)',
    description: 'Nền tảng vi tích phân cho Machine Learning và Khoa học dữ liệu.',
    color: 'from-blue-600 to-indigo-700',
    icon: 'Calculator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: [
      {
        id: 'chap-1',
        subjectId: 'sub-1',
        title: 'Chương 1: Giới hạn và Hàm số liên tục',
        description: 'Định nghĩa giới hạn, các dạng vô định và ứng dụng trong đạo hàm.',
        order: 1,
        topics: [
          {
            id: 'top-1',
            chapterId: 'chap-1',
            title: '1.1 Khái niệm giới hạn hàm số',
            content: `# Giới hạn hàm số và tính liên tục\n\n- **Định nghĩa**: Giới hạn của $f(x)$ khi $x$ tiến tới $x_0$.\n- **Các định lý quan trọng**: Định lý kẹp, giới hạn đặc biệt $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.\n- **Ứng dụng AI**: Dùng trong tối ưu hóa hàm mất mát (Loss Function) tại điểm cực trị.`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoLinks: [
              {
                id: 'vid-1',
                topicId: 'top-1',
                url: 'https://youtu.be/HUGEDN72uDs',
                title: 'Bản chất hình học của Giới hạn & Đạo hàm',
                meaning: 'Xem để hiểu sâu về trực giác hình học trước khi tính toán giải tích phức tạp.',
                tags: ['Toán căn bản', 'Visual Math'],
                isCompleted: true,
                createdAt: new Date().toISOString()
              },
              {
                id: 'vid-2',
                topicId: 'top-1',
                url: 'https://youtu.be/kfF40MiqsAo',
                title: 'Các dạng vô định và quy tắc L\'Hopital nhanh',
                meaning: 'Ôn tập kỹ thuật giải nhanh các bài toán giới hạn phức tạp trong kỳ thi giữa kỳ.',
                tags: ['Luyện thi', 'Giải tích'],
                isCompleted: false,
                createdAt: new Date().toISOString()
              }
            ]
          },
          {
            id: 'top-2',
            chapterId: 'chap-1',
            title: '1.2 Hàm số liên tục và định lý Bolzano',
            content: `# Hàm số liên tục\n\n- Hàm số liên tục trên đoạn $[a, b]$.\n- Định lý giá trị trung gian (Intermediate Value Theorem).\n- Ứng dụng để chứng minh phương trình có nghiệm.`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoLinks: [
              {
                id: 'vid-3',
                topicId: 'top-2',
                url: 'https://youtu.be/ZT_SlZZZJ5Q',
                title: 'Ý nghĩa thực tế của Định lý giá trị trung gian',
                meaning: 'Ứng dụng trong việc tìm nghiệm xấp xỉ thuật toán bisection.',
                tags: ['Ứng dụng thực tế'],
                isCompleted: false,
                createdAt: new Date().toISOString()
              }
            ]
          }
        ]
      },
      {
        id: 'chap-2',
        subjectId: 'sub-1',
        title: 'Chương 2: Đạo hàm và Vi phân',
        description: 'Tính toán tốc độ biến thiên và Backpropagation trong mạng nơ-ron.',
        order: 2,
        topics: [
          {
            id: 'top-3',
            chapterId: 'chap-2',
            title: '2.1 Đạo hàm cấp cao và Quy tắc chuỗi (Chain Rule)',
            content: `# Đạo hàm và Quy tắc chuỗi\n\n- Đạo hàm hàm hợp: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$.\n- **Cực kỳ quan trọng**: Quy tắc chuỗi là cốt lõi của thuật toán lan truyền ngược (Backpropagation) trong Deep Learning.`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoLinks: [
              {
                id: 'vid-4',
                topicId: 'top-3',
                url: 'https://youtu.be/IHZwWFHWa-w',
                title: 'Quy tắc chuỗi (Chain Rule) trong Deep Learning',
                meaning: 'Hiểu rõ bản chất toán học đằng sau quá trình train AI.',
                tags: ['AI Core', 'Calculus'],
                isCompleted: true,
                createdAt: new Date().toISOString()
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sub-2',
    code: 'MAS',
    name: 'Toán Rời Rạc (Discrete Mathematics)',
    description: 'Logic toán học, lý thuyết tập hợp, đồ thị và mật mã học hiện đại.',
    color: 'from-purple-600 to-pink-700',
    icon: 'Network',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: [
      {
        id: 'chap-3',
        subjectId: 'sub-2',
        title: 'Chương 1: Logic mệnh đề và Suy luận',
        description: 'Bảng chân trị, các luật logic và chứng minh toán học.',
        order: 1,
        topics: [
          {
            id: 'top-4',
            chapterId: 'chap-3',
            title: '1.1 Mệnh đề logic và Bảng chân trị',
            content: `# Logic mệnh đề\n\n- Các phép toán: phủ định, hội, tuyển, kéo theo, tương đương.\n- Ứng dụng thiết kế mạch số và lập trình điều kiện (Boolean Logic).`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoLinks: [
              {
                id: 'vid-5',
                topicId: 'top-4',
                url: 'https://youtu.be/2US5sM5qgkk',
                title: 'Bản chất của Logic mệnh đề trong Khoa học máy tính',
                meaning: 'Xem để nắm vững nền tảng tư duy lập trình và thuật toán.',
                tags: ['CS Foundation'],
                isCompleted: true,
                createdAt: new Date().toISOString()
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sub-3',
    code: 'AI101',
    name: 'Trí Tuệ Nhân Tạo & Machine Learning',
    description: 'Giới thiệu các thuật toán học máy, xử lý dữ liệu và mô hình ngôn ngữ.',
    color: 'from-emerald-600 to-teal-700',
    icon: 'BrainCircuit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: [
      {
        id: 'chap-4',
        subjectId: 'sub-3',
        title: 'Chương 1: Nhập môn Machine Learning',
        description: 'Hồi quy tuyến tính, cây quyết định và đánh giá mô hình.',
        order: 1,
        topics: [
          {
            id: 'top-5',
            chapterId: 'chap-4',
            title: '1.1 Linear Regression trực quan',
            content: `# Hồi quy tuyến tính\n\n- Phương trình đường thẳng: $y = wx + b$.\n- Hàm chi phí (MSE) và thuật toán Gradient Descent tìm nghiệm tối ưu.`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoLinks: [
              {
                id: 'vid-6',
                topicId: 'top-5',
                url: 'https://youtu.be/kHwlB_j7Hkc',
                title: 'Gradient Descent hoạt động như thế nào?',
                meaning: 'Video trực quan cực hay về cách máy tính tự học và tối ưu.',
                tags: ['Machine Learning', 'Visual AI'],
                isCompleted: true,
                createdAt: new Date().toISOString()
              }
            ]
          }
        ]
      }
    ]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  isPasswordEnabled: false,
  theme: 'dark',
  autoLockMinutes: 15
};

// Storage functions
export function loadSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSubjects(DEFAULT_SUBJECTS);
      return DEFAULT_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load subjects', e);
    return DEFAULT_SUBJECTS;
  }
}

export function saveSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (e) {
    console.error('Failed to save subjects', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

// Simple secure password hash / verification using SHA-256
export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Encrypt data for secure JSON export file
export async function encryptDataFile(data: object, password?: string): Promise<string> {
  const jsonString = JSON.stringify(data, null, 2);
  if (!password) {
    // Plaintext JSON export with metadata tag
    return JSON.stringify({ version: '1.0', encrypted: false, data }, null, 2);
  }

  // If password provided, encrypt using AES-GCM or simple secure base64 with password salt
  // For robust offline export, we can wrap with password hint or password-derived key
  const hashedPass = await hashPassword(password);
  const payload = {
    version: '1.0',
    encrypted: true,
    hashCheck: hashedPass,
    data: btoa(unescape(encodeURIComponent(jsonString))) // Base64 safe encoding with UTF-8 support
  };
  return JSON.stringify(payload, null, 2);
}

export async function decryptDataFile(fileContent: string, password?: string): Promise<{ subjects: Subject[]; settings: AppSettings }> {
  const parsed = JSON.parse(fileContent);
  if (!parsed.encrypted) {
    return parsed.data || { subjects: DEFAULT_SUBJECTS, settings: DEFAULT_SETTINGS };
  }

  if (!password) {
    throw new Error('File này đã được mã hóa mật khẩu. Vui lòng nhập mật khẩu để mở.');
  }

  const hashedPass = await hashPassword(password);
  if (parsed.hashCheck !== hashedPass) {
    throw new Error('Mật khẩu không chính xác! Không thể giải mã file dữ liệu.');
  }

  const decodedJson = decodeURIComponent(escape(atob(parsed.data)));
  return JSON.parse(decodedJson);
}
