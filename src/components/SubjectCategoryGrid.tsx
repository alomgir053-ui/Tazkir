import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Coffee,
  HeartPulse,
  ShieldAlert,
  Shield,
  Users,
  HeartHandshake,
  Coins,
  Plane,
  Compass,
  CloudRain,
  ChevronRight,
  ArrowLeft,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Share2
} from 'lucide-react';
import { DUA_CATEGORIES, DUAS_LIST } from '../data/duaData.ts';
import { DuaCategory, DuaItem } from '../types/index.ts';

interface SubjectCategoryGridProps {
  onSelectDua?: (dua: DuaItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const SubjectCategoryGrid: React.FC<SubjectCategoryGridProps> = ({
  onSelectDua,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Mosque':
        return (
          <svg className="w-6 h-6 text-[#3B1E54]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3 5h5l-4 4 2 6-6-4-6 4 2-6-4-4h5z" />
          </svg>
        );
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-600" />;
      case 'Moon':
        return <Moon className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-600" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-teal-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-yellow-600" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-sky-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-fuchsia-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-orange-600" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-lime-600" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-cyan-600" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-stone-600" />;
      case 'CloudRain':
        return <CloudRain className="w-6 h-6 text-teal-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-[#3B1E54]" />;
    }
  };

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.transliteration}\n\nঅর্থ: ${dua.bengali}\n\nরেফারেন্স: ${dua.source}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (dua: DuaItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingId === dua.id) {
        setSpeakingId(null);
        return;
      }
      setSpeakingId(dua.id);
      const utterance = new SpeechSynthesisUtterance(dua.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.onend = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // If a category is selected, render the list of Duas in that category
  if (selectedCategory) {
    const categoryDuas = DUAS_LIST.filter((d) => d.categoryId === selectedCategory.id);

    return (
      <div className="flex flex-col h-full bg-[#FAF7F2]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/95 backdrop-blur-md border-b border-[#E8DEF8]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-1.5 rounded-full hover:bg-[#F3EEF9] text-[#3B1E54] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-[#3B1E54] text-lg font-bengali">
                {selectedCategory.title}
              </h2>
              <span className="text-xs text-[#8A799E]">{selectedCategory.titleArabic} · {categoryDuas.length}টি সংরক্ষিত দোয়া</span>
            </div>
          </div>
        </div>

        {/* List of Duas */}
        <div className="p-4 space-y-4 max-w-2xl mx-auto w-full">
          <div className="p-3 bg-[#F3EEF9] rounded-2xl text-xs text-[#5A3578] border border-[#E8DEF8]">
            {selectedCategory.description}
          </div>

          {categoryDuas.length === 0 ? (
            <div className="p-8 text-center text-[#8A799E] bg-white rounded-2xl border border-dashed border-[#D4C4DE]">
              এই বিভাগে আরও দোয়া শিগগিরই যুক্ত হচ্ছে।
            </div>
          ) : (
            categoryDuas.map((dua) => {
              const isFav = favorites.includes(dua.id);
              const isSpeaking = speakingId === dua.id;
              const isCopied = copiedId === dua.id;

              return (
                <article
                  key={dua.id}
                  className="p-5 bg-white rounded-2xl border border-[#EFE7F6] hover:border-[#D4C4DE] shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">
                      {dua.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSpeak(dua)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSpeaking ? 'bg-[#3B1E54] text-[#D4AF37]' : 'text-[#6F5D84] hover:bg-[#F3EEF9]'
                        }`}
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(dua)}
                        className="p-1.5 rounded-lg text-[#6F5D84] hover:bg-[#F3EEF9] transition-colors"
                        title="কপি করুন"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onToggleFavorite(dua.id)}
                        className="p-1.5 rounded-lg text-[#6F5D84] hover:bg-[#F3EEF9] transition-colors"
                        title="পছন্দ"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#F0EBF5] text-right">
                    <p className="font-arabic text-xl text-[#2B1340] leading-loose">
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Pronunciation & Bengali Translation */}
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <p className="text-[#7E6A93] italic">
                      <span className="font-semibold text-[#5A3578]">উচ্চারণ: </span>
                      {dua.transliteration}
                    </p>
                    <p className="text-[#2D283E] leading-relaxed">
                      <span className="font-semibold text-[#3B1E54]">অর্থ: </span>
                      {dua.bengali}
                    </p>
                  </div>

                  {/* Virtue & Reference */}
                  <div className="pt-2 border-t border-[#F5EFEB] flex flex-wrap items-center justify-between text-[11px] text-[#8A799E] gap-2">
                    {dua.virtue && (
                      <span className="text-[#A88620] bg-[#FAF5EB] px-2 py-0.5 rounded-md font-medium">
                        {dua.virtue}
                      </span>
                    )}
                    <span className="font-mono text-[#8A799E] ml-auto">
                      {dua.source}
                    </span>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // 15-Grid Category View matching Phone 1 in Reference Image
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#3B1E54] font-bengali">
            বিষয় ভিত্তিক দোয়া ও আমল
          </h2>
          <p className="text-xs text-[#8A799E]">প্রতিটি জীবনের মুহূর্তের জন্য প্রামাণ্য মাসনূন দোয়া</p>
        </div>
        <span className="text-xs font-semibold text-[#A88620] hover:underline cursor-pointer">
          সব দেখুন &gt;
        </span>
      </div>

      {/* 3 columns on phone, 4 or 5 columns on tablet */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#EFE7F6] hover:border-[#D4AF37] hover:shadow-md transition-all group active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] group-hover:bg-[#F3EEF9] flex items-center justify-center mb-2 transition-colors shadow-2xs">
              {getIcon(cat.iconName)}
            </div>
            <span className="text-xs font-bold text-[#3B1E54] group-hover:text-[#5A3578] font-bengali leading-tight">
              {cat.title}
            </span>
            <span className="text-[10px] text-[#8A799E] mt-0.5 font-arabic">
              {cat.titleArabic}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
