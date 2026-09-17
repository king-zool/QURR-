export type RiwayahType = 
  | "Hafs 'an Asim"
  | "Warsh 'an Nafi'"
  | "Qalun 'an Nafi'"
  | "Ad-Duri 'an Abi 'Amr"
  | "Khalaf 'an Hamzah"
  | "Shu'bah 'an Asim"
  | "Other documented riwāyāt";

export type QiraahTradition = 
  | "'Asim"
  | "Nafi'"
  | "Abu 'Amr"
  | "Hamzah"
  | "Ibn Kathir"
  | "Ibn 'Amir"
  | "Al-Kisa'i"
  | "Abu Ja'far"
  | "Ya'qub"
  | "Khalaf al-'Ashir";

export type PermissionStatus = 
  | "Streaming permitted"
  | "Download permitted"
  | "Educational use permitted"
  | "Attribution required"
  | "Restricted"
  | "Pending verification";

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  biography: string;
  photograph: string;
  state: string;
  city: string;
  institution?: string;
  qiraah: QiraahTradition | string;
  riwayah: RiwayahType | string;
  teachers?: string[];
  ijazah?: string;
  specialisation?: string;
  verified: boolean;
  featured?: boolean;
  completeQuranAvailable?: boolean;
  yearBornOrEra?: string;
  audioBaseUrl?: string; // Base URL or custom audio mapping
  totalListens?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Surah {
  id: number;
  number: number;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  standardDuration: string; // e.g. "02:45"
}

export interface Recording {
  id: string;
  reciterId: string;
  reciterName: string;
  reciterSlug: string;
  surahId: number;
  surahName: string;
  surahArabicName: string;
  audioUrl: string;
  duration: string;
  durationSeconds?: number;
  riwayah: RiwayahType | string;
  qiraah: string;
  fileSize?: string;
  downloadAllowed: boolean;
  streamingAllowed: boolean;
  permissionStatus: PermissionStatus;
  published: boolean;
  playsCount?: number;
  createdAt: string;
}

export interface HeritageTopic {
  id: string;
  title: string;
  arabicTitle?: string;
  category: 
    | "Historical Reciters"
    | "Nigerian Qur’anic Scholars"
    | "Qur’anic Schools"
    | "Qirā’āt & Riwāyāt"
    | "Historic Recordings"
    | "Qur’anic Manuscripts"
    | "Qur’anic Competitions"
    | "Regional Traditions"
    | "Oral Histories";
  region: string;
  summary: string;
  fullDescription: string;
  historicalPeriod: string;
  keyFigures: string[];
  keyHighlights: string[];
  image: string;
}

export interface ReciterSubmission {
  id: string;
  reciterName: string;
  arabicName?: string;
  state: string;
  city: string;
  biography: string;
  photographUrl?: string;
  riwayah: string;
  qiraah: string;
  teachers?: string;
  ijazah?: string;
  institution?: string;
  audioRecordingsLink?: string;
  submittedBy: string;
  submitterEmail: string;
  submitterPhone?: string;
  relationshipToReciter: string;
  sourceReference: string;
  permissionConfirmed: boolean;
  status: "Pending" | "Approved" | "Rejected" | "Needs Information";
  reviewNotes?: string;
  createdAt: string;
}

export interface ListeningHistoryItem {
  recordingId: string;
  reciterId: string;
  reciterName: string;
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  audioUrl: string;
  playbackPositionSeconds: number;
  durationSeconds: number;
  lastPlayed: string;
}

export type AudioPermissionType = 
  | 'streaming_only' 
  | 'download_permitted' 
  | 'educational_use' 
  | 'restricted';

export type ActiveView = 
  | "home"
  | "reciters"
  | "reciter-profile"
  | "quran"
  | "submit-reciter"
  | "admin"
  | "curator-portal"
  | "about";
