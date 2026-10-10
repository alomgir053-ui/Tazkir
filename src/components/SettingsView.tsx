import React, { useState } from 'react';
import {
  User as UserIcon,
  Cloud,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  Download,
  Trash2,
  MapPin,
  Globe,
  LogOut,
  Loader2
} from 'lucide-react';
import { BD_CITIES, CityLocation } from '../services/prayerService.ts';

interface SettingsViewProps {
  userName: string;
  setUserName: (name: string) => void;
  selectedCity: CityLocation;
  setSelectedCity: (city: CityLocation) => void;
  isGoogleConnected: boolean;
  userEmail?: string;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onSyncBackup: () => void;
  onRestoreBackup: () => void;
  isSyncing: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  setUserName,
  selectedCity,
  setSelectedCity,
  isGoogleConnected,
  userEmail,
  onGoogleSignIn,
  onGoogleSignOut,
  onSyncBackup,
  onRestoreBackup,
  isSyncing,
}) => {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* User Identity Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DEF8] shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#3B1E54] flex items-center justify-center text-[#D4AF37] font-bold text-2xl shadow-md shrink-0">
          {userName.slice(0, 1) || 'ন'}
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-bold text-[#8A799E] uppercase tracking-wider block">
            ব্যবহারকারীর নাম
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-lg font-bold text-[#3B1E54] border-b border-transparent hover:border-[#D4AF37] focus:border-[#D4AF37] outline-hidden transition-colors w-full font-bengali"
          />
          <span className="text-xs text-[#6F5D84] block mt-0.5">
            {isGoogleConnected ? userEmail : 'গেস্ট একাউন্ট · গুগল ড্রাইভে ব্যাকআপ রাখুন'}
          </span>
        </div>
      </div>

      {/* Google Drive Integration Section (Skill Mandated UI) */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DEF8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A88620]">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#3B1E54] font-bengali">Google Drive ক্লাউড ব্যাকআপ</h3>
              <p className="text-xs text-[#8A799E]">কুরআন বুকমার্ক, নোট ও পড়ার অগ্রগতি ড্রাইভে নিরাপদ রাখুন</p>
            </div>
          </div>

          {isGoogleConnected && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>সংযুক্ত</span>
            </span>
          )}
        </div>

        {/* Official Sign in with Google Button (Exact Skill Spec) */}
        {!isGoogleConnected ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-[#747775] hover:bg-slate-50 text-[#1f1f1f] font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
            <p className="text-[11px] text-[#8A799E] text-center mt-2">
              ব্যবহারকারীর স্পষ্ট অনুমতিক্রমে গুগল ড্রাইভে নিরাপদে ডেটা সংরক্ষণ করা হয়।
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSyncBackup}
                disabled={isSyncing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3B1E54] text-[#D4AF37] font-bold text-xs hover:bg-[#2B1340] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                <span>এখনই ড্রাইভে সিঙ্ক করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRestoreConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF7F2] text-[#3B1E54] border border-[#E8DEF8] font-bold text-xs hover:bg-[#F3EEF9] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#A88620]" />
                <span>ড্রাইভ থেকে রিস্টোর</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onGoogleSignOut}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:underline font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Google একাউন্ট লগআউট</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Confirmation Modal for Restoring from Drive (Per Skill Spec) */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8DEF8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-[#3B1E54] text-base font-bengali">
                গুগল ড্রাইভ থেকে রিস্টোর নিশ্চিতকরণ
              </h4>
              <p className="text-xs text-[#6F5D84] mt-1.5 leading-relaxed">
                এটি আপনার বর্তমান ডিভাইসের বুকমার্ক ও নোটগুলোকে গুগল ড্রাইভে সংরক্ষিত সর্বশেষ ডেটা দ্বারা আপডেট করবে। আপনি কি এগিয়ে যেতে চান?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#FAF7F2] text-[#6F5D84] text-xs font-semibold hover:bg-[#F3EEF9]"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setShowRestoreConfirm(false);
                  onRestoreBackup();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#3B1E54] text-[#D4AF37] text-xs font-bold shadow-xs hover:bg-[#2B1340]"
              >
                হ্যাঁ, রিস্টোর করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Calculation Location Settings */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DEF8] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#3B1E54] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#3B1E54] font-bengali">নামাজের জেলা ও অবস্থান</h3>
            <p className="text-xs text-[#8A799E]">বাংলাদেশ ইসলামিক ফাউন্ডেশন অনুমোদিত সময়সূচি</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {BD_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all border ${
                selectedCity.name === city.name
                  ? 'bg-[#3B1E54] text-white border-[#3B1E54] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5A3578] border-[#E8DEF8] hover:bg-[#F3EEF9]'
              }`}
            >
              {city.bnName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
