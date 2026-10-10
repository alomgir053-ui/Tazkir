import React from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle,
  Bell,
  ChevronRight,
  TrendingUp,
  FileText,
  Bookmark,
  Share2,
  Calendar,
  Cloud,
  Check
} from 'lucide-react';
import { PrayerTimes, UserProgress, IslamicBook, UserNote } from '../types/index.ts';
import { CURATED_BOOKS } from '../data/libraryBooks.ts';

interface DailyDashboardProps {
  userName: string;
  prayerTimes: PrayerTimes;
  progress: UserProgress;
  onNavigateTab: (tab: any) => void;
  onOpenQuran: () => void;
  notes: UserNote[];
  isGoogleConnected: boolean;
  onGoogleSignIn: () => void;
  onGoogleSyncBackup: () => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  userName,
  prayerTimes,
  progress,
  onNavigateTab,
  onOpenQuran,
  notes,
  isGoogleConnected,
  onGoogleSignIn,
  onGoogleSyncBackup,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Banner Row: Greeting + Prayer Times Schedule (Matching Reference Laptop Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Welcome Greeting & Quote Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#3B1E54] via-[#4A2066] to-[#2B1340] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle background mosque silhouette decoration */}
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-4 translate-y-4">
            <svg className="w-64 h-64 text-[#D4AF37]" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C120 50, 140 70, 140 100 L60 100 C60 70, 80 50, 100 20 Z" />
              <rect x="50" y="100" width="100" height="90" />
              <rect x="20" y="60" width="16" height="130" />
              <polygon points="20,60 28,40 36,60" />
              <rect x="164" y="60" width="16" height="130" />
              <polygon points="164,60 172,40 180,60" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#F4E8C1] text-xs font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{prayerTimes.hijriDate} · আজকের দিনটি বরকতময় হোক</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-bengali tracking-tight">
              আসসালামু আলাইকুম, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DEF8] mt-1 font-medium">
              আজও আল্লাহকে স্মরণ করে দিনটি শুরু করি।
            </p>
          </div>

          {/* Inspirational Scripture Card Quote */}
          <div className="relative z-10 mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg">
            <p className="text-sm sm:text-base font-semibold text-[#FDFBF7] font-bengali leading-relaxed">
              "নিশ্চয় আল্লাহর স্মরণেই অন্তর সমূহের প্রশান্তি।"
            </p>
            <span className="text-[11px] text-[#F4E8C1] font-medium block mt-1">
              — সূরা আর-রাদ (১৩:২৮)
            </span>
          </div>
        </div>

        {/* Prayer Times Schedule Card (Matching Right Widget in Approved UI) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8DEF8] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#E8DEF8] pb-2">
              <div>
                <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">আজকের সময়সূচি</h3>
                <span className="text-[11px] text-[#8A799E]">ঢাকা ও পার্শ্ববর্তী এলাকা</span>
              </div>
              <span className="text-xs font-bold text-[#A88620] bg-[#FAF5EB] px-2.5 py-1 rounded-lg">
                {prayerTimes.timeRemaining}
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'ফজর', time: prayerTimes.fajr, icon: '🌅' },
                { name: 'যোহর', time: prayerTimes.dhuhr, icon: '☀️' },
                { name: 'আসর', time: prayerTimes.asr, icon: '🌤️' },
                { name: 'মাগরিব', time: prayerTimes.maghrib, icon: '🌇' },
                { name: 'এশা', time: prayerTimes.isha, icon: '🌙' },
              ].map((p) => {
                const isUpcoming = prayerTimes.upcomingPrayer === p.name;
                return (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isUpcoming
                        ? 'bg-[#3B1E54] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#3B1E54] hover:bg-[#F3EEF9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </div>
                    <span className={`font-mono ${isUpcoming ? 'text-[#F4E8C1]' : 'text-[#6F5D84]'}`}>
                      {p.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Google Drive Status Bar */}
          <div className="mt-4 pt-3 border-t border-[#E8DEF8] flex items-center justify-between text-xs">
            {isGoogleConnected ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Drive যুক্ত আছে</span>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="text-xs text-[#3B1E54] hover:text-[#5A3578] font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Drive এ সিঙ্ক করুন</span>
              </button>
            )}
            <button
              onClick={onGoogleSyncBackup}
              className="text-[11px] text-[#A88620] hover:underline font-semibold"
            >
              এখনই ব্যাকআপ
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (Matching reference UI: আজকের দোয়া, কুরআন পড়া, নামাজের দোয়া, রিমাইন্ডার সেট) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: 'আজকের দোয়া', sub: 'দিনের গুরুত্বপূর্ণ দোয়া', icon: 'BookOpen', tab: 'categories' },
          { title: 'কুরআন পড়া', sub: 'তিলাওয়াত ও অর্থ', icon: 'Sparkles', tab: 'quran' },
          { title: 'নামাজের দোয়া', sub: 'নামাজ সংক্রান্ত দোয়া', icon: 'Clock', tab: 'categories' },
          { title: 'রিমাইন্ডার সেট', sub: 'আমল মনে করিয়ে দেবে', icon: 'Bell', tab: 'tasbih' },
        ].map((act, i) => (
          <button
            key={i}
            onClick={() => onNavigateTab(act.tab)}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#EFE7F6] hover:border-[#D4AF37] hover:shadow-md transition-all text-left active:scale-98 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] group-hover:bg-[#3B1E54] group-hover:text-[#D4AF37] text-[#3B1E54] flex items-center justify-center shrink-0 transition-colors">
              {act.icon === 'BookOpen' && <BookOpen className="w-5 h-5" />}
              {act.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
              {act.icon === 'Clock' && <Clock className="w-5 h-5" />}
              {act.icon === 'Bell' && <Bell className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#3B1E54] font-bengali">
                {act.title}
              </div>
              <div className="text-[10px] text-[#8A799E] mt-0.5">{act.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Row: Progress Tracker + Curated Popular Books */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Progress Tracker (Matching 68% gauge in Laptop UI) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#E8DEF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">আমার অগ্রগতি</h3>
              <span className="text-xs text-[#A88620] font-semibold cursor-pointer hover:underline">
                বিস্তারিত দেখুন &gt;
              </span>
            </div>

            <div className="flex items-center gap-5 my-2">
              {/* Circular Gauge 68% */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-[#EFE7F6]" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-[#10B981]"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * progress.monthlyPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-[#3B1E54] font-mono">
                    {progress.monthlyPercent}%
                  </span>
                  <span className="text-[9px] text-[#8A799E] block">এই মাসের লক্ষ্য</span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-1.5 text-xs text-[#5A3578] flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কুরআন তিলাওয়াত</span>
                  </span>
                  <span className="font-mono text-[#8A799E]">১২/৩০ পারা</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>দৈনিক দোয়া</span>
                  </span>
                  <span className="font-mono text-[#8A799E]">১৮/৩০</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>নামাজের দোয়া</span>
                  </span>
                  <span className="font-mono text-[#8A799E]">৯/১৫</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>বিভিন্ন বিষয়ের দোয়া</span>
                  </span>
                  <span className="font-mono text-[#8A799E]">২৫/৪০</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DEF8] mt-3 text-center">
            <span className="text-xs font-semibold text-[#A88620]">
              ধারাবাহিক আমল স্ট্রিক: {progress.streakDays} দিন আলহামদুলিল্লাহ!
            </span>
          </div>
        </div>

        {/* Popular Books Row (Matching Books Grid in Reference UI) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E8DEF8] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">জনপ্রিয় বইসমূহ</h3>
            <button
              onClick={() => onNavigateTab('books')}
              className="text-xs font-semibold text-[#A88620] hover:underline cursor-pointer"
            >
              সব দেখুন &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CURATED_BOOKS.slice(0, 4).map((book) => (
              <div
                key={book.id}
                onClick={() => onNavigateTab('books')}
                className="group cursor-pointer flex flex-col"
              >
                <div
                  className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${book.coverGradient} p-3 flex flex-col justify-between text-white relative shadow-xs group-hover:shadow-md transition-shadow`}
                >
                  <span className="text-[9px] font-bold bg-black/40 px-1.5 py-0.5 rounded-md self-start text-[#F4E8C1]">
                    {book.badgeText}
                  </span>
                  <div className="text-center my-auto">
                    <h4 className="font-bold text-xs text-[#FAF7F2] font-bengali leading-snug line-clamp-2">
                      {book.title}
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#3B1E54] mt-1.5 truncate font-bengali">
                  {book.title}
                </span>
                <span className="text-[10px] text-[#8A799E] truncate">
                  {book.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Recently Reading + Personal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recently Reading Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-[#E8DEF8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">সম্প্রতি পড়ছেন</h3>
            <span className="text-xs text-[#8A799E]">চলমান তিলাওয়াত</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DEF8]">
            <div className="w-14 h-16 rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-[9px] mt-1 font-bold">কুরআন</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#3B1E54] font-bengali">সূরা আল-ফাতিহা</h4>
              <p className="text-xs text-[#8A799E]">পৃষ্ঠা ১ · ১ম পারা · ৭ আয়াত</p>
              <div className="w-full bg-[#E8DEF8] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#D4AF37] h-full w-[80%]" />
              </div>
            </div>
            <button
              onClick={onOpenQuran}
              className="px-3 py-1.5 rounded-xl bg-[#3B1E54] text-[#D4AF37] text-xs font-bold hover:bg-[#2B1340] transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              পড়া চালিয়ে যান
            </button>
          </div>
        </div>

        {/* My Notes & Highlights */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-[#E8DEF8] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">আমার নোট ও চিন্তা</h3>
            <button
              onClick={() => onNavigateTab('notes')}
              className="text-xs font-semibold text-[#A88620] hover:underline cursor-pointer"
            >
              সব দেখুন &gt;
            </button>
          </div>

          <div className="space-y-2">
            {notes.slice(0, 2).map((note) => (
              <div
                key={note.id}
                onClick={() => onNavigateTab('notes')}
                className="p-3 bg-[#FAF7F2] hover:bg-[#F3EEF9] rounded-2xl border border-[#E8DEF8] transition-colors cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#3B1E54] truncate font-bengali">
                    {note.title}
                  </div>
                  <div className="text-[11px] text-[#6F5D84] line-clamp-1 mt-0.5">
                    {note.content}
                  </div>
                </div>
                <span className="text-[10px] text-[#8A799E] shrink-0">{note.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
