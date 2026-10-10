/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Bookmark,
  User as UserIcon,
  Search,
  Bell,
  Sparkles,
  Bot,
  Clock,
  Settings,
  Layers,
  Smartphone,
  Monitor,
  Cloud,
  CheckCircle,
  FileText,
  Volume2
} from 'lucide-react';
import { MainTab, ViewMode, UserProgress, UserNote } from './types/index.ts';
import { QuranReader } from './components/QuranReader.tsx';
import { SubjectCategoryGrid } from './components/SubjectCategoryGrid.tsx';
import { BookLibrary } from './components/BookLibrary.tsx';
import { TasbihCounter } from './components/TasbihCounter.tsx';
import { AiCoach } from './components/AiCoach.tsx';
import { AiImageGenerator } from './components/AiImageGenerator.tsx';
import { DailyDashboard } from './components/DailyDashboard.tsx';
import { NotesView } from './components/NotesView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { BD_CITIES, getCalculatedPrayerTimes } from './services/prayerService.ts';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  saveBackupToDrive,
  downloadFileFromDrive,
  listDriveBackups,
  getAccessToken
} from './services/googleDriveService.ts';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [userName, setUserName] = useState<string>('নাহিদ');
  const [selectedCity, setSelectedCity] = useState(BD_CITIES[0]);
  const [bookmarks, setBookmarks] = useState<number[]>([1001, 2255]); // Quran ayah bookmarks
  const [favoriteDuas, setFavoriteDuas] = useState<string[]>(['morning-1', 'salat-1']);
  const [savedBooks, setSavedBooks] = useState<string[]>(['book-quran-duas']);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // User Notes
  const [notes, setNotes] = useState<UserNote[]>([
    {
      id: 'note-1',
      title: 'আল্লাহর ওপর ভরসা (তাওয়াক্কুল)',
      content: 'আজকের জীবনে যাবতীয় সিদ্ধান্তের ক্ষেত্রে যথাসাধ্য প্রচেষ্টা করার পর ফলাফল আল্লাহর ওপর সোপর্দ করাই প্রকৃত ঈমান।',
      tag: 'কুরআনিক ভাবনা',
      updatedAt: '৮ অক্টোবর ২০২৬',
    },
    {
      id: 'note-2',
      title: 'তাহাজ্জুদ ও দোয়া কবুল',
      content: 'রাতের শেষ তৃতীয়াংশে আল্লাহ তায়ালা প্রথম আসমানে অবতীর্ণ হয়ে বান্দার ফরিয়াদ শোনেন।',
      tag: 'হাদিসের শিক্ষা',
      updatedAt: '৬ অক্টোবর ২০২৬',
    },
  ]);

  // Google Drive & Auth State
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isSyncingDrive, setIsSyncingDrive] = useState<boolean>(false);

  // Progress metrics
  const progress: UserProgress = {
    quranCompletedAyahs: 12,
    totalQuranAyahs: 30,
    dailyDuasRead: 18,
    dailyDuasTarget: 30,
    prayerDuaCount: 9,
    specialDuaCount: 25,
    monthlyPercent: 68,
    streakDays: 14,
  };

  const prayerTimes = getCalculatedPrayerTimes(selectedCity);

  useEffect(() => {
    // Detect viewport size on load: default to mobile mode on small screens
    if (window.innerWidth < 768) {
      setViewMode('mobile');
    }

    // Initialize Firebase Auth listener
    const unsubscribe = initAuth(
      (user, token) => {
        setIsGoogleConnected(true);
        setUserEmail(user.email || '');
      },
      () => {
        setIsGoogleConnected(false);
        setUserEmail('');
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleToggleBookmark = (ayahId: number) => {
    setBookmarks((prev) =>
      prev.includes(ayahId) ? prev.filter((id) => id !== ayahId) : [...prev, ayahId]
    );
    showNotification('বুকমার্ক তালিকা আপডেট করা হয়েছে');
  };

  const handleToggleFavoriteDua = (id: string) => {
    setFavoriteDuas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    showNotification('পছন্দের দোয়া আপডেট করা হয়েছে');
  };

  const handleToggleSaveBook = (id: string) => {
    setSavedBooks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    showNotification('বই তালিকায় সংরক্ষণ করা হয়েছে');
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setIsGoogleConnected(true);
        setUserEmail(res.user.email || '');
        showNotification('Google Drive সফলভাবে সংযুক্ত হয়েছে!');
      }
    } catch (e: any) {
      showNotification('গুগল লগইন ব্যর্থ হয়েছে: ' + (e.message || ''));
    }
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setIsGoogleConnected(false);
    setUserEmail('');
    showNotification('Google অ্যাকাউন্ট লগআউট করা হয়েছে');
  };

  const handleSyncBackupToDrive = async () => {
    if (!isGoogleConnected) {
      await handleGoogleSignIn();
      return;
    }
    setIsSyncingDrive(true);
    try {
      const backupData = {
        userName,
        bookmarks,
        favoriteDuas,
        savedBooks,
        notes,
        backupDate: new Date().toISOString(),
        version: '0.5.7-rc3',
      };
      await saveBackupToDrive(backupData);
      showNotification('গুগল ড্রাইভে ব্যাকআপ সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (e: any) {
      showNotification('ড্রাইভে ব্যাকআপ ব্যর্থ হয়েছে: ' + (e.message || ''));
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleRestoreBackupFromDrive = async () => {
    setIsSyncingDrive(true);
    try {
      const files = await listDriveBackups();
      if (!files || files.length === 0) {
        showNotification('গুগল ড্রাইভে কোনো পূর্ববর্তী ব্যাকআপ পাওয়া যায়নি');
        return;
      }
      const latest = files[0];
      const data = await downloadFileFromDrive(latest.id);
      if (data) {
        if (data.bookmarks) setBookmarks(data.bookmarks);
        if (data.favoriteDuas) setFavoriteDuas(data.favoriteDuas);
        if (data.savedBooks) setSavedBooks(data.savedBooks);
        if (data.notes) setNotes(data.notes);
        if (data.userName) setUserName(data.userName);
        showNotification('গুগল ড্রাইভ থেকে ডেটা সফলভাবে রিস্টোর হয়েছে!');
      }
    } catch (e: any) {
      showNotification('ড্রাইভ থেকে রিস্টোর ব্যর্থ হয়েছে: ' + (e.message || ''));
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleSaveNote = (note: UserNote) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
    showNotification('নোট সফলভাবে সংরক্ষিত হয়েছে');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showNotification('নোট মুছে ফেলা হয়েছে');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231F20] flex flex-col selection:bg-[#E8DEF8] selection:text-[#3B1E54]">
      {/* Universal Top Bar with Viewport Mode Switcher & Tazkir Title Banner (Matching Reference Image Header) */}
      <div className="bg-[#3B1E54] text-white py-2.5 px-4 shadow-md sticky top-0 z-40 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Tagline from Reference Image */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#A88620] flex items-center justify-center text-[#3B1E54] font-bold text-base shadow-sm shrink-0">
              <svg className="w-5 h-5 text-[#3B1E54]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wide text-white">Tazkir</span>
                <span className="hidden sm:inline-block text-[11px] text-[#F4E8C1] font-medium border-l border-white/20 pl-2">
                  স্মরণে শান্তি, জীবনে বরকত
                </span>
              </div>
              <span className="hidden md:block text-[10px] text-[#E8DEF8]/80">
                দৈনন্দিন জীবনে কুরআন ও সুন্নাহর আলোকে একটি সহজ সঙ্গী
              </span>
            </div>
          </div>

          {/* Quick Pillars from top banner in reference image */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[#F4E8C1]">
            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <span>📖</span> জ্ঞান অর্জন
            </span>
            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <span>❤️</span> আচরণে আমল
            </span>
            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <span>👨‍👩‍👧‍👦</span> পরিবারে শান্তি
            </span>
            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <span>🌿</span> জীবনে বরকত
            </span>
          </div>

          {/* Viewport Switcher & Drive indicator */}
          <div className="flex items-center gap-2">
            {isGoogleConnected && (
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#F4E8C1] bg-white/10 px-2 py-1 rounded-lg">
                <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Drive সংযুক্ত</span>
              </div>
            )}

            <div className="flex items-center bg-black/30 p-1 rounded-xl text-xs">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-[#D4AF37] text-[#3B1E54] font-bold shadow-xs'
                    : 'text-[#E8DEF8] hover:text-white'
                }`}
                title="স্মার্টফোন ভিউ"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">মোবাইল ভিউ</span>
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-[#D4AF37] text-[#3B1E54] font-bold shadow-xs'
                    : 'text-[#E8DEF8] hover:text-white'
                }`}
                title="ডেস্কটপ / ল্যাপটপ ভিউ"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">ল্যাপটপ ভিউ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#3B1E54] text-[#F4E8C1] border border-[#D4AF37] px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Main Container: Conditional Rendering between Mobile View and Desktop View */}
      {viewMode === 'mobile' ? (
        /* ================= MOBILE VIEW (Matching Phone 1 & Phone 2 in Reference UI) ================= */
        <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-gradient-to-b from-[#2A143D] to-[#1E0F2B]">
          <div className="w-full max-w-[390px] h-[820px] bg-[#FAF7F2] rounded-[48px] shadow-2xl border-[8px] border-[#20102E] flex flex-col overflow-hidden relative ring-4 ring-[#D4AF37]/30">
            {/* Phone Notch & Status Bar (9:41) */}
            <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#3B1E54] bg-[#FAF7F2] select-none shrink-0 z-30">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile Top Header */}
            <div className="px-4 py-2 flex items-center justify-between bg-[#FAF7F2] shrink-0 border-b border-[#E8DEF8]/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#3B1E54] flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z" />
                  </svg>
                </div>
                <span className="font-extrabold text-base text-[#3B1E54]">Tazkir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-1.5 text-[#3B1E54] hover:bg-[#F3EEF9] rounded-full"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showNotification('আপনার জন্য নতুন কোনো অ্যালার্ট নেই')}
                  className="p-1.5 text-[#3B1E54] hover:bg-[#F3EEF9] rounded-full relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full absolute top-1 right-1" />
                </button>
              </div>
            </div>

            {/* Mobile Viewport Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {activeTab === 'home' && (
                <div className="p-3 space-y-4">
                  {/* Search Bar matching Phone 1: "কি খুঁজছেন?" */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8A799E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="কি খুঁজছেন?"
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8DEF8] rounded-2xl text-xs text-[#231F20] outline-hidden placeholder:text-[#8A799E] shadow-2xs"
                    />
                  </div>

                  {/* Banner matching Phone 1 in Reference Image */}
                  <div className="bg-gradient-to-r from-[#3B1E54] via-[#4A2066] to-[#2B1340] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-sm font-bold font-bengali leading-snug">
                        আল্লাহকে স্মরণ করো, তোমাদের অন্তর হবে প্রশান্ত
                      </p>
                      <span className="text-[10px] text-[#F4E8C1] block mt-1">
                        (আর-রাদ ১৩:২৮)
                      </span>
                    </div>
                    {/* Carousel indicator dots */}
                    <div className="flex items-center gap-1 mt-3">
                      <span className="w-3 h-1 bg-[#D4AF37] rounded-full" />
                      <span className="w-1 h-1 bg-white/40 rounded-full" />
                      <span className="w-1 h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>

                  {/* 15 Subject Categories from Phone 1 */}
                  <SubjectCategoryGrid
                    favorites={favoriteDuas}
                    onToggleFavorite={handleToggleFavoriteDua}
                  />
                </div>
              )}

              {activeTab === 'quran' && (
                <QuranReader
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}

              {activeTab === 'categories' && (
                <SubjectCategoryGrid
                  favorites={favoriteDuas}
                  onToggleFavorite={handleToggleFavoriteDua}
                />
              )}

              {activeTab === 'books' && (
                <BookLibrary
                  savedBooks={savedBooks}
                  onToggleSaveBook={handleToggleSaveBook}
                />
              )}

              {activeTab === 'tasbih' && <TasbihCounter />}

              {activeTab === 'coach' && <AiCoach />}

              {activeTab === 'image_gen' && <AiImageGenerator onNotify={showNotification} />}

              {activeTab === 'notes' && (
                <NotesView
                  notes={notes}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  userName={userName}
                  setUserName={setUserName}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  isGoogleConnected={isGoogleConnected}
                  userEmail={userEmail}
                  onGoogleSignIn={handleGoogleSignIn}
                  onGoogleSignOut={handleGoogleSignOut}
                  onSyncBackup={handleSyncBackupToDrive}
                  onRestoreBackup={handleRestoreBackupFromDrive}
                  isSyncing={isSyncingDrive}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation Bar (হোম, বইসমূহ, আমার তালিকা, প্রোফাইল) */}
            <nav className="h-16 bg-white border-t border-[#E8DEF8] flex items-center justify-around px-2 shrink-0 z-30 shadow-lg">
              {[
                { id: 'home', label: 'হোম', icon: Home },
                { id: 'quran', label: 'কুরআন', icon: BookOpen },
                { id: 'tasbih', label: 'তাসবীহ', icon: Clock },
                { id: 'coach', label: 'এআই কোচ', icon: Bot },
                { id: 'image_gen', label: 'আর্ট ৪কে', icon: Sparkles },
                { id: 'settings', label: 'প্রোফাইল', icon: UserIcon },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as MainTab)}
                    className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                      isActive ? 'text-[#3B1E54] font-bold' : 'text-[#8A799E] hover:text-[#5A3578]'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'scale-110 text-[#3B1E54] stroke-[2.5]' : ''
                      }`}
                    />
                    <span className="text-[10px] mt-0.5">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      ) : (
        /* ================= DESKTOP / TABLET VIEW (Matching Laptop View in Reference UI) ================= */
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* Left Sidebar (Matching Dashboard Sidebar in Reference Image) */}
          <aside className="w-60 bg-white border-r border-[#E8DEF8] p-4 flex flex-col justify-between shrink-0 shadow-xs hidden md:flex">
            <div className="space-y-6">
              {/* Brand Logo inside Sidebar */}
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-xl bg-[#3B1E54] flex items-center justify-center text-[#D4AF37] shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg text-[#3B1E54]">Tazkir</span>
              </div>

              {/* Sidebar Menu Items (Exact List from Reference Image) */}
              <nav className="space-y-1">
                {[
                  { id: 'home', label: 'ড্যাশবোর্ড', icon: Home },
                  { id: 'books', label: 'বই ও দোয়া', icon: BookOpen },
                  { id: 'categories', label: 'বিষয় ভিত্তিক', icon: Layers },
                  { id: 'quran', label: 'কুরআন মাজীদ', icon: BookOpen },
                  { id: 'tasbih', label: 'ডিজিটাল তাসবীহ', icon: Clock },
                  { id: 'coach', label: 'স্মার্ট এআই কোচ', icon: Bot },
                  { id: 'image_gen', label: 'এআই ইসলামিক আর্ট', icon: Sparkles },
                  { id: 'notes', label: 'নোট ও উপলব্ধি', icon: FileText },
                  { id: 'settings', label: 'সেটিংস ও ড্রাইভ', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as MainTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#3B1E54] text-white shadow-xs'
                          : 'text-[#5A3578] hover:bg-[#FAF7F2] hover:text-[#3B1E54]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8A799E]'}`} />
                      <span className="font-bengali">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Drive Sync Status */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DEF8] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3B1E54]">
                <Cloud className="w-4 h-4 text-[#D4AF37]" />
                <span>Google Drive</span>
              </div>
              <span className="text-[10px] text-[#8A799E] block">
                {isGoogleConnected ? userEmail : 'সিঙ্ক করা হয়নি'}
              </span>
              <button
                onClick={handleSyncBackupToDrive}
                disabled={isSyncingDrive}
                className="w-full py-1.5 bg-[#3B1E54] text-[#D4AF37] hover:bg-[#2B1340] rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
              >
                {isSyncingDrive ? 'সিঙ্ক হচ্ছে...' : 'এখনই ব্যাকআপ নিন'}
              </button>
            </div>
          </aside>

          {/* Main Desktop Dashboard Area */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Top Desktop Search & Profile Header */}
            <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md px-6 py-3.5 border-b border-[#E8DEF8] flex items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-[#8A799E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="বই, দোয়া, বিষয় বা আয়াত খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8DEF8] rounded-2xl text-xs text-[#231F20] outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => showNotification('নতুন কোনো বিজ্ঞপ্তি নেই')}
                  className="p-2 rounded-xl bg-white border border-[#E8DEF8] text-[#3B1E54] hover:bg-[#F3EEF9] relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full absolute top-1.5 right-1.5" />
                </button>

                <div
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 bg-white border border-[#E8DEF8] rounded-2xl hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3B1E54] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    {userName.slice(0, 1) || 'ন'}
                  </div>
                  <span className="text-xs font-bold text-[#3B1E54] font-bengali">{userName}</span>
                </div>
              </div>
            </div>

            {/* Desktop View Switch Content */}
            <div className="flex-1 pb-12">
              {activeTab === 'home' && (
                <DailyDashboard
                  userName={userName}
                  prayerTimes={prayerTimes}
                  progress={progress}
                  onNavigateTab={(t) => setActiveTab(t)}
                  onOpenQuran={() => setActiveTab('quran')}
                  notes={notes}
                  isGoogleConnected={isGoogleConnected}
                  onGoogleSignIn={handleGoogleSignIn}
                  onGoogleSyncBackup={handleSyncBackupToDrive}
                />
              )}

              {activeTab === 'quran' && (
                <div className="p-4 sm:p-6 max-w-4xl mx-auto h-[800px]">
                  <QuranReader
                    bookmarks={bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                  <SubjectCategoryGrid
                    favorites={favoriteDuas}
                    onToggleFavorite={handleToggleFavoriteDua}
                  />
                </div>
              )}

              {activeTab === 'books' && (
                <BookLibrary
                  savedBooks={savedBooks}
                  onToggleSaveBook={handleToggleSaveBook}
                />
              )}

              {activeTab === 'tasbih' && <TasbihCounter />}

              {activeTab === 'coach' && <AiCoach />}

              {activeTab === 'image_gen' && <AiImageGenerator onNotify={showNotification} />}

              {activeTab === 'notes' && (
                <NotesView
                  notes={notes}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  userName={userName}
                  setUserName={setUserName}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  isGoogleConnected={isGoogleConnected}
                  userEmail={userEmail}
                  onGoogleSignIn={handleGoogleSignIn}
                  onGoogleSignOut={handleGoogleSignOut}
                  onSyncBackup={handleSyncBackupToDrive}
                  onRestoreBackup={handleRestoreBackupFromDrive}
                  isSyncing={isSyncingDrive}
                />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
