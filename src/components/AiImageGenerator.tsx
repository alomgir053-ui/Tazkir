import React, { useState } from 'react';
import { Sparkles, Download, CloudUpload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { saveBackupToDrive, getAccessToken } from '../services/googleDriveService.ts';

interface AiImageGeneratorProps {
  onNotify?: (msg: string) => void;
}

export const AiImageGenerator: React.FC<AiImageGeneratorProps> = ({ onNotify }) => {
  const [prompt, setPrompt] = useState<string>('Golden Arabic calligraphy Bismillah with intricate royal purple and warm gold arabesque borders');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  const [savedToDriveSuccess, setSavedToDriveSuccess] = useState<boolean>(false);

  const presets = [
    {
      title: 'স্বর্ণালী ক্যালিগ্রাফি',
      prompt: 'Majestic golden Arabic calligraphy of Ayatul Kursi surrounded by intricate royal purple and warm gold arabesque borders, museum lighting, 8k aesthetic',
      size: '2K' as const,
      ratio: '1:1' as const,
    },
    {
      title: 'গোধূলিলগ্নে মসজিদ',
      prompt: 'Serene silhouette of traditional mosque minarets at golden hour twilight, glowing warm lanterns, deep violet and amber sky, peaceful spiritual Islamic atmosphere',
      size: '4K' as const,
      ratio: '16:9' as const,
    },
    {
      title: 'ইলুমিনেটেড মুসহাফ বর্ডার',
      prompt: 'Traditional Islamic illuminated manuscript page frame with delicate gold foil filigree, emerald floral motifs, ivory cream parchment background',
      size: '2K' as const,
      ratio: '9:16' as const,
    },
    {
      title: 'ইসলামিক জ্যামিতিক টাইলস',
      prompt: 'Authentic complex Islamic geometric arabesque star pattern tilework, royal purple and brass gold accents, architectural luxury tile design',
      size: '1K' as const,
      ratio: '1:1' as const,
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setSavedToDriveSuccess(false);

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'ইমেজ জেনারেট করতে সমস্যা হয়েছে');
      }

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        if (onNotify) onNotify(`${imageSize} রেজোলিউশনে ইসলামিক আর্ট সফলভাবে প্রস্তুত হয়েছে!`);
      } else {
        throw new Error('সার্ভার থেকে ইমেজ ডেটা পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.error('Image gen error:', err);
      setError(err.message || 'ইমেজ জেনারেট করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!generatedImageUrl) return;
    setIsSavingToDrive(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Google Drive এ সেভ করার জন্য অনুগ্রহ করে প্রোফাইল থেকে "Sign in with Google" সম্পন্ন করুন।');
        setIsSavingToDrive(false);
        return;
      }

      await saveBackupToDrive({
        type: 'tazkir_generated_art',
        date: new Date().toISOString(),
        prompt,
        imageSize,
        aspectRatio,
        imageUrl: generatedImageUrl,
      });

      setSavedToDriveSuccess(true);
      if (onNotify) onNotify('Google Drive এ ইমেজ ডেটা সফলভাবে ব্যাকআপ হয়েছে!');
    } catch (err: any) {
      setError(err.message || 'Google Drive এ আপলোড ব্যর্থ হয়েছে');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `tazkir_art_${imageSize}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#3B1E54] to-[#5A3578] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F4E8C1] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Gemini 3 Pro Image Preview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-bengali">
            উচ্চ রেজোলিউশন ইসলামিক আর্ট ও ওয়ালপেপার জেনারেটর
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DEF8] mt-1 max-w-xl">
            পবিত্র কুরআনের আয়াত, ক্যালিগ্রাফি ও ইসলামিক নান্দনিকতা ফুটিয়ে তুলুন ১কে, ২কে অথবা ৪কে আল্ট্রা-এইচডি কোয়ালিটিতে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-6 space-y-5 bg-white p-5 rounded-3xl border border-[#EFE7F6] shadow-xs">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider block mb-2 font-bengali">
              দ্রুত বিষয় নির্বাচন (Presets)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(p.prompt);
                    setImageSize(p.size);
                    setAspectRatio(p.ratio);
                  }}
                  className="p-2.5 text-left rounded-xl bg-[#FAF7F2] hover:bg-[#F3EEF9] border border-[#E8DEF8] hover:border-[#D4AF37] transition-all text-xs font-medium text-[#3B1E54]"
                >
                  <div className="font-bold text-[#5A3578]">{p.title}</div>
                  <div className="text-[10px] text-[#8A799E] mt-0.5">{p.size} · {p.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider block mb-1 font-bengali">
              প্রম্পট বিবরণ লিখুন
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="যেকোনো ইসলামিক দৃশ্য, ক্যালিগ্রাফি বা আর্টের বিবরণ লিখুন..."
              className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DEF8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm text-[#231F20] outline-hidden resize-none transition-all"
            />
          </div>

          {/* User Affordance: Resolution Selector (1K, 2K, 4K) as required by prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider font-bengali">
                ইমেজ সাইজ ও রেজোলিউশন (Affordance)
              </label>
              <span className="text-[10px] text-[#A88620] font-semibold bg-[#FAF5EB] px-2 py-0.5 rounded-md">
                gemini-3-pro-image-preview
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setImageSize(size)}
                  className={`p-2.5 rounded-xl text-center font-bold text-xs transition-all border ${
                    imageSize === size
                      ? 'bg-[#3B1E54] text-white border-[#3B1E54] shadow-xs ring-2 ring-[#D4AF37]/50'
                      : 'bg-[#FAF7F2] text-[#3B1E54] border-[#E8DEF8] hover:bg-[#F3EEF9]'
                  }`}
                >
                  <span className="text-sm block">{size}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    {size === '1K' ? '1024px Standard' : size === '2K' ? '2048px High Def' : '3840px Ultra 4K'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider block mb-1.5 font-bengali">
              অ্যাসপেক্ট রেশিও (Aspect Ratio)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-1 text-center font-semibold text-xs rounded-xl border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-[#A88620] text-white border-[#A88620]'
                      : 'bg-[#FAF7F2] text-[#5A3578] border-[#E8DEF8] hover:bg-[#F3EEF9]'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#3B1E54] to-[#5A3578] hover:from-[#2B1340] hover:to-[#4A2066] text-[#F4E8C1] font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{imageSize} আর্ট রেন্ডার হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>{imageSize} রেজোলিউশনে জেনারেট করুন</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Preview Column */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-white p-5 rounded-3xl border border-[#EFE7F6] shadow-xs min-h-[380px]">
          {isLoading ? (
            <div className="text-center space-y-4 py-12">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-[#E8DEF8] border-t-[#D4AF37] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#3B1E54] absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-bold text-[#3B1E54] text-base">gemini-3-pro-image-preview আর্ট তৈরি করছে</h4>
                <p className="text-xs text-[#8A799E] mt-1">
                  নির্বাচিত রেজোলিউশন: <span className="font-bold text-[#A88620]">{imageSize}</span>
                </p>
              </div>
            </div>
          ) : generatedImageUrl ? (
            <div className="w-full space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg relative bg-black/5 group">
                <img
                  src={generatedImageUrl}
                  alt={prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain max-h-[420px] mx-auto"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {imageSize} · {aspectRatio}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#3B1E54] text-white hover:bg-[#2B1340] text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>ডাউনলোড ({imageSize})</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isSavingToDrive}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF5EB] hover:bg-[#F4E8C1] text-[#3B1E54] border border-[#D4AF37] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSavingToDrive ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#A88620]" />
                  ) : savedToDriveSuccess ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <CloudUpload className="w-4 h-4 text-[#A88620]" />
                  )}
                  <span>{savedToDriveSuccess ? 'ড্রাইভে সংরক্ষিত' : 'Google Drive এ সেভ'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-[#8A799E] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DEF8] flex items-center justify-center mx-auto text-[#D4AF37]">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-[#3B1E54] text-sm font-bengali">
                কোনো ইমেজ এখনো জেনারেট করা হয়নি
              </h4>
              <p className="text-xs text-[#8A799E] max-w-xs mx-auto">
                বামে পছন্দমতো ইসলামিক বিষয় লিখুন বা প্রিসেট নির্বাচন করে ১কে, ২কে বা ৪কে রেজোলিউশন সিলেক্ট করুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
