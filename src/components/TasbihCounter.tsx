import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DhikrItem {
  id: string;
  arabic: string;
  bengali: string;
  meaning: string;
  target: number;
}

export const TasbihCounter: React.FC = () => {
  const dhikrs: DhikrItem[] = [
    {
      id: 'subhanallah',
      arabic: 'سُبْحَانَ اللَّهِ',
      bengali: 'সুবহানাল্লাহ',
      meaning: 'আল্লাহ অতি পবিত্র ও নিষ্কলুষ',
      target: 33,
    },
    {
      id: 'alhamdulillah',
      arabic: 'الْحَمْدُ لِلَّهِ',
      bengali: 'আলহামদুলিল্লাহ',
      meaning: 'সমস্ত প্রশংসা একমাত্র আল্লাহর জন্য',
      target: 33,
    },
    {
      id: 'allahuakbar',
      arabic: 'اللَّهُ أَكْبَرُ',
      bengali: 'আল্লাহু আকবার',
      meaning: 'আল্লাহ সর্বশ্রেষ্ঠ',
      target: 34,
    },
    {
      id: 'astaghfirullah',
      arabic: 'أَسْتَغْفِرُ اللَّهَ',
      bengali: 'আস্তাগফিরুল্লাহ',
      meaning: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি',
      target: 100,
    },
    {
      id: 'lailahaillallah',
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
      bengali: 'লা ইলাহা ইল্লাল্লাহ',
      meaning: 'আল্লাহ ব্যতীত সত্য কোনো উপাস্য নেই',
      target: 100,
    },
    {
      id: 'darood',
      arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
      bengali: 'আল্লাহুম্মা সাল্লি ‘আলা মুহাম্মাদ',
      meaning: 'হে আল্লাহ! হযরত মুহাম্মাদ (সা.)-এর প্রতি রহমত বর্ষণ করুন',
      target: 100,
    },
  ];

  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(dhikrs[0]);
  const [count, setCount] = useState<number>(0);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Audio click
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {
        // audio context failed
      }
    }

    // Milestone reached
    if (nextCount === selectedDhikr.target) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#3B1E54', '#E8DEF8'],
      });
      setTotalCompletedCycles((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const progressPercent = Math.min(100, Math.round((count / selectedDhikr.target) * 100));

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 max-w-md mx-auto w-full space-y-6">
      {/* Dhikr Selector Bar */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {dhikrs.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDhikr(d);
              setCount(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              selectedDhikr.id === d.id
                ? 'bg-[#3B1E54] text-[#D4AF37] border-[#3B1E54] shadow-xs'
                : 'bg-white text-[#5A3578] border-[#E8DEF8] hover:bg-[#F3EEF9]'
            }`}
          >
            {d.bengali}
          </button>
        ))}
      </div>

      {/* Main Counter Card */}
      <div className="w-full bg-white rounded-3xl p-6 border border-[#E8DEF8] shadow-lg text-center relative overflow-hidden">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#6F5D84] transition-colors"
            title={soundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#A88620]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="text-xs font-bold text-[#A88620] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#D4AF37]/30">
            লক্ষ্য: {selectedDhikr.target} বার
          </span>

          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#6F5D84] transition-colors"
            title="গণনা রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Dhikr Display */}
        <div className="my-2 space-y-1">
          <div className="font-arabic text-3xl sm:text-4xl text-[#3B1E54] font-bold py-2">
            {selectedDhikr.arabic}
          </div>
          <h3 className="font-bold text-lg text-[#3B1E54] font-bengali">
            {selectedDhikr.bengali}
          </h3>
          <p className="text-xs text-[#8A799E]">
            {selectedDhikr.meaning}
          </p>
        </div>

        {/* Big Tactile Bead Counter Button */}
        <div className="my-8 flex justify-center">
          <button
            type="button"
            onClick={handleIncrement}
            className="relative w-44 h-44 rounded-full bg-gradient-to-br from-[#3B1E54] via-[#4A2066] to-[#2B1340] border-8 border-[#FAF7F2] shadow-2xl flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer group select-none ring-4 ring-[#D4AF37]/40"
          >
            <span className="text-5xl font-black tracking-tight text-[#F4E8C1] font-mono group-hover:scale-105 transition-transform">
              {count}
            </span>
            <span className="text-xs text-[#D4AF37] font-semibold mt-1 uppercase tracking-wider">
              চাপুন (জিকির)
            </span>

            {/* Circular Progress border ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-[#E8DEF8]/20"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-[#D4AF37] transition-all duration-300"
                strokeWidth="4"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        {/* Progress & Milestone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#6F5D84]">
            <span>অগ্রগতি: {progressPercent}%</span>
            <span>সম্পন্ন চক্র: {totalCompletedCycles} বার</span>
          </div>
          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E8DEF8]">
            <div
              className="bg-gradient-to-r from-[#A88620] to-[#D4AF37] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
