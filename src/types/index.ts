export type ViewMode = 'mobile' | 'desktop';

export type MainTab = 
  | 'home' 
  | 'books' 
  | 'categories' 
  | 'quran' 
  | 'hadith' 
  | 'tasbih' 
  | 'coach' 
  | 'image_gen' 
  | 'prayer' 
  | 'notes' 
  | 'settings';

export type ReaderZoomStep = 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2 | 2.5 | 3;

export interface Ayah {
  number: number;
  numberInSurah: number;
  arabic: string;
  transliteration: string;
  bengali: string;
  english?: string;
  tafsirSummary?: string;
}

export interface Surah {
  number: number;
  nameArabic: string;
  nameBengali: string;
  nameEnglish: string;
  meaningBengali: string;
  totalAyahs: number;
  revelationType: 'Makkah' | 'Madinah';
  hafiziPageStart: number;
  hafiziPageEnd: number;
  juzNumber: number;
  bismillahPre: boolean;
  ayahs: Ayah[];
}

export interface DuaCategory {
  id: string;
  title: string;
  titleArabic: string;
  iconName: string;
  description: string;
  colorClass: string;
  duasCount: number;
}

export interface DuaItem {
  id: string;
  categoryId: string;
  title: string;
  arabic: string;
  transliteration: string;
  bengali: string;
  english?: string;
  source: string;
  virtue?: string;
  times?: number;
  isFavorite?: boolean;
}

export interface IslamicBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pagesCount: number;
  description: string;
  coverGradient: string;
  accentColor: string;
  badgeText: string;
  isCurated: boolean;
  contentSnippet?: string;
}

export interface UserNote {
  id: string;
  title: string;
  content: string;
  tag: string;
  reference?: string;
  updatedAt: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDate: string;
  upcomingPrayer: string;
  timeRemaining: string;
}

export interface UserProgress {
  quranCompletedAyahs: number;
  totalQuranAyahs: number;
  dailyDuasRead: number;
  dailyDuasTarget: number;
  prayerDuaCount: number;
  specialDuaCount: number;
  monthlyPercent: number;
  streakDays: number;
}
