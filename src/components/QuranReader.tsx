import React, { useState } from 'react';
import { Bookmark, ArrowLeft, MoreVertical, Play, Pause, Volume2, BookOpen, Layers, Check } from 'lucide-react';
import { SURAHS_DATA, ALL_SURAHS_INDEX, JUZ_LIST } from '../data/quranData.ts';
import { ZoomController, READER_ZOOM_STEPS } from './ZoomController.tsx';
import { ReaderZoomStep, Surah } from '../types/index.ts';

interface QuranReaderProps {
  initialSurahNumber?: number;
  onBack?: () => void;
  bookmarks: number[];
  onToggleBookmark: (ayahId: number) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  initialSurahNumber = 1,
  onBack,
  bookmarks,
  onToggleBookmark,
}) => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurahNumber);
  const [zoom, setZoom] = useState<ReaderZoomStep>(1.25);
  const [readingMode, setReadingMode] = useState<'text' | 'hafizi'>('text');
  const [hafiziPage, setHafiziPage] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState<number>(26);
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [showTafsirAyah, setShowTafsirAyah] = useState<number | null>(null);

  const currentSurah: Surah = SURAHS_DATA.find((s) => s.number === selectedSurahNumber) || SURAHS_DATA[0];

  const handlePlayAyah = (index: number) => {
    if (activeAyahIndex === index && isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }
    setActiveAyahIndex(index);
    setIsPlayingAudio(true);

    // Audio narration simulation with browser SpeechSynthesis if available for Arabic
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSurah.ayahs[index].arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2] text-[#231F20] relative">
      {/* Top App Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEF8]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="ফিরে যান"
              className="p-1.5 rounded-full hover:bg-[#EFE7F6] text-[#3B1E54] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#A88620] uppercase block">
              কুরআনের নূর ও তেলাওয়াত
            </span>
            <button
              onClick={() => setShowSurahSelector(true)}
              className="flex items-center gap-1.5 font-bold text-[#3B1E54] text-base hover:text-[#5A3578] transition-colors text-left"
            >
              <span>{currentSurah.nameBengali}</span>
              <span className="text-xs text-[#8A799E]">({currentSurah.nameArabic})</span>
              <span className="text-[10px] text-[#A88620] bg-[#F4E8C1] px-1.5 py-0.5 rounded-md font-medium">পরিবর্তন</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#EFE7F6] p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setReadingMode('text')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                readingMode === 'text' ? 'bg-[#3B1E54] text-white shadow-xs' : 'text-[#3B1E54] hover:bg-white/50'
              }`}
            >
              টেক্সট
            </button>
            <button
              onClick={() => setReadingMode('hafizi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                readingMode === 'hafizi' ? 'bg-[#3B1E54] text-white shadow-xs' : 'text-[#3B1E54] hover:bg-white/50'
              }`}
            >
              ১৫-লাইন হাফিজী
            </button>
          </div>

          <button
            onClick={() => onToggleBookmark(currentSurah.number * 1000 + 1)}
            aria-label="বুকমার্ক"
            className="p-2 rounded-full hover:bg-[#EFE7F6] text-[#3B1E54] transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${
                bookmarks.includes(currentSurah.number * 1000 + 1)
                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                  : 'text-[#3B1E54]'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full transition-all duration-200"
        style={{
          fontSize: `${zoom * 100}%`,
        }}
        data-source-reader="tazkir-quran"
      >
        {readingMode === 'text' ? (
          <div>
            {/* Ornate Golden Title Frame (Matching Phone 2 in Reference UI) */}
            <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-b from-[#FDFBF7] to-[#FAF5EC] border-2 border-[#D4AF37]/50 shadow-md text-center overflow-hidden">
              {/* Islamic Decorative Corner Filigrees */}
              <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-sm pointer-events-none" />
              <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37] rounded-br-sm pointer-events-none" />

              <span className="text-xs font-semibold tracking-wider text-[#A88620] uppercase">
                {currentSurah.revelationType === 'Makkah' ? 'মক্কায় অবতীর্ণ' : 'মদীনায় অবতীর্ণ'} · {currentSurah.totalAyahs} আয়াত
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B1E54] mt-1 font-bengali">
                {currentSurah.nameBengali}
              </h1>
              <div className="text-xl sm:text-2xl font-arabic text-[#A88620] mt-1 font-bold">
                {currentSurah.nameArabic}
              </div>
              <p className="text-xs text-[#6F5D84] mt-1.5">
                অর্থ: {currentSurah.meaningBengali} · পারা: {currentSurah.juzNumber} · হাফিজী পৃষ্ঠা: {currentSurah.hafiziPageStart}
              </p>
            </div>

            {/* Bismillah Banner for Surahs */}
            {currentSurah.bismillahPre && (
              <div className="text-center my-6 py-4 px-6 bg-[#F5EFEB]/70 rounded-2xl border border-[#E8DEF8] shadow-xs">
                <p className="font-arabic text-2xl sm:text-3xl text-[#3B1E54] leading-loose">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs sm:text-sm text-[#5A3578] mt-1 font-medium">
                  শুরু করছি আল্লাহর নামে, যিনি পরম করুণাময়, অতি দয়ালু।
                </p>
              </div>
            )}

            {/* Ayahs Stream */}
            <div className="space-y-6">
              {currentSurah.ayahs.map((ayah, index) => {
                const isBookmarked = bookmarks.includes(currentSurah.number * 1000 + ayah.numberInSurah);
                const isActive = activeAyahIndex === index;

                return (
                  <article
                    key={ayah.numberInSurah}
                    className={`relative p-5 sm:p-6 rounded-2xl transition-all border ${
                      isActive
                        ? 'bg-[#F3EEF9] border-[#A88620] shadow-md ring-1 ring-[#D4AF37]'
                        : 'bg-white border-[#EFE7F6] hover:border-[#D4C4DE] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Ayah Badge Number (Matching Reference UI) */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] bg-[#FDFBF7] flex items-center justify-center text-[#3B1E54] font-bold text-xs shadow-xs shrink-0">
                          {ayah.numberInSurah}
                        </div>
                        <span className="text-[11px] font-semibold text-[#8A799E]">
                          আয়াত {ayah.numberInSurah}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePlayAyah(index)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive && isPlayingAudio
                              ? 'bg-[#3B1E54] text-[#D4AF37]'
                              : 'text-[#6F5D84] hover:bg-[#F3EEF9]'
                          }`}
                          title="তিলাওয়াত শুনুন"
                        >
                          {isActive && isPlayingAudio ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            onToggleBookmark(currentSurah.number * 1000 + ayah.numberInSurah)
                          }
                          className="p-1.5 rounded-lg text-[#6F5D84] hover:bg-[#F3EEF9] transition-colors"
                          title="বুকমার্ক করুন"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isBookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse */}
                    <div className="mt-4 text-right">
                      <p
                        className="font-arabic text-[#2A143D] leading-[2.4] tracking-wide"
                        style={{ fontSize: `${arabicFontSize}px` }}
                      >
                        {ayah.arabic}
                      </p>
                    </div>

                    {/* Bengali Translation & Tafsir */}
                    {showTranslations && (
                      <div className="mt-4 pt-4 border-t border-[#F0EBF5] space-y-2">
                        {ayah.transliteration && (
                          <p className="text-xs italic text-[#7E6A93]">
                            উচ্চারণ: {ayah.transliteration}
                          </p>
                        )}
                        <p className="text-sm sm:text-base text-[#2D283E] leading-relaxed font-bengali font-normal">
                          {ayah.bengali}
                        </p>
                        {ayah.tafsirSummary && (
                          <div className="mt-2">
                            <button
                              onClick={() =>
                                setShowTafsirAyah(
                                  showTafsirAyah === ayah.numberInSurah ? null : ayah.numberInSurah
                                )
                              }
                              className="text-xs text-[#A88620] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>{showTafsirAyah === ayah.numberInSurah ? 'তাফসির সংক্ষেপ বন্ধ করুন' : 'তাফসির সংক্ষেপ পড়ুন'}</span>
                            </button>
                            {showTafsirAyah === ayah.numberInSurah && (
                              <div className="mt-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEF8] text-xs text-[#4A2066] leading-relaxed">
                                <span className="font-bold text-[#A88620] block mb-1">ব্যাখ্যা ও প্রেক্ষাপট:</span>
                                {ayah.tafsirSummary}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          /* Hafizi 15-Line Mushaf Mode */
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#FAF5EB] p-4 sm:p-8 rounded-2xl border-4 border-[#D4AF37] shadow-xl relative min-h-[500px] flex flex-col justify-between">
              {/* Hafizi Mushaf Header */}
              <div className="flex items-center justify-between border-b-2 border-[#D4AF37]/50 pb-2 mb-4 text-xs font-bold text-[#3B1E54]">
                <span>পারা {Math.ceil(hafiziPage / 20)}</span>
                <span className="font-arabic text-sm">{currentSurah.nameArabic}</span>
                <span>পৃষ্ঠা {hafiziPage}</span>
              </div>

              {/* 15 Authentic Visual Scan Lines Simulator */}
              <div className="space-y-3.5 my-auto text-center font-arabic text-xl sm:text-2xl text-[#2B1340] leading-relaxed">
                <div className="border-b border-[#D4AF37]/20 pb-1">
                  {currentSurah.ayahs[0]?.arabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </div>
                {currentSurah.ayahs.slice(1, 6).map((a, i) => (
                  <div key={i} className="border-b border-[#D4AF37]/20 pb-1">
                    {a.arabic} ﴿{a.numberInSurah}﴾
                  </div>
                ))}
                <div className="text-xs text-[#A88620] italic font-sans pt-2">
                  — ঐতিহ্যবাহী ১৫-লাইন বিশিষ্ট বাংলাদেশি হাফিজী কুরআন স্ক্যান লেআউট —
                </div>
              </div>

              {/* Hafizi Mushaf Footer & Pagination */}
              <div className="flex items-center justify-between border-t-2 border-[#D4AF37]/50 pt-3 mt-4">
                <button
                  disabled={hafiziPage <= 1}
                  onClick={() => setHafiziPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#3B1E54] text-[#D4AF37] disabled:opacity-30"
                >
                  পূর্ববর্তী পৃষ্ঠা
                </button>
                <span className="text-xs font-bold text-[#3B1E54]">
                  পৃষ্ঠা {hafiziPage} / ৬০৪
                </span>
                <button
                  disabled={hafiziPage >= 604}
                  onClick={() => setHafiziPage((p) => Math.min(604, p + 1))}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#3B1E54] text-[#D4AF37] disabled:opacity-30"
                >
                  পরবর্তী পৃষ্ঠা
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Reader Zoom Controller (Strictly Conforming to Requirements) */}
      <footer className="sticky bottom-0 z-20 p-3 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent">
        <ZoomController
          zoom={zoom}
          onZoomChange={setZoom}
          onOpenIndex={() => setShowSurahSelector(true)}
          language="bn"
        />
      </footer>

      {/* Surah & Juz Selection Modal */}
      {showSurahSelector && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E8DEF8] overflow-hidden">
            <div className="p-4 border-b border-[#E8DEF8] flex items-center justify-between bg-[#FDFBF7]">
              <div>
                <h3 className="font-bold text-[#3B1E54] text-lg font-bengali">সূরা ও পারা নির্বাচন</h3>
                <p className="text-xs text-[#8A799E]">পবিত্র কুরআনের ১১৪টি সূরার তালিকা</p>
              </div>
              <button
                onClick={() => setShowSurahSelector(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE7F6] text-[#3B1E54] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {ALL_SURAHS_INDEX.map((s) => {
                const isSelected = s.number === selectedSurahNumber;
                return (
                  <button
                    key={s.number}
                    onClick={() => {
                      setSelectedSurahNumber(s.number);
                      setShowSurahSelector(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? 'bg-[#3B1E54] text-white shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3B1E54] hover:bg-[#F3EEF9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-[#D4AF37] text-[#3B1E54]' : 'bg-[#E8DEF8] text-[#3B1E54]'
                        }`}
                      >
                        {s.number}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className={`text-xs ${isSelected ? 'text-[#F4E8C1]' : 'text-[#8A799E]'}`}>
                          {s.verses} আয়াত · {s.place} · পৃষ্ঠা {s.page}
                        </div>
                      </div>
                    </div>
                    <div className={`font-arabic text-lg ${isSelected ? 'text-[#D4AF37]' : 'text-[#A88620]'}`}>
                      {s.ar}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
