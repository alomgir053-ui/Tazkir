import React, { useState } from 'react';
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, Compass, Moon, ShieldCheck, Heart } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AiCoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! আমি তাজকির স্মার্ট ইসলামিক কোচ। দৈনন্দিন জীবনে আত্মিক প্রশান্তি, নিয়মিত সালাত, কুরআন তিলাওয়াত এবং ডিজিটাল আসক্তি কমিয়ে বরকতময় জীবন গঠনে আমি আপনার সার্বক্ষণিক সঙ্গী। আজ আপনাকে কীভাবে সহায়তা করতে পারি?',
      time: 'এখন',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coachingStyle, setCoachingStyle] = useState<'gentle' | 'balanced' | 'firm'>('balanced');

  const quickPrompts = [
    'ফজরের সালাতে নিয়মিত ওঠার কার্যকরী কৌশল',
    'কুরআন তিলাওয়াতে মনোযোগ ও একাগ্রতা অর্জনের উপায়',
    'সোশ্যাল মিডিয়ায় অনর্থক স্ক্রলিং কমানোর ইসলামী আত্মনিয়ন্ত্রণ',
    'অন্তরকে দুশ্চিন্তা ও উদ্বেগ থেকে মুক্ত রাখার আমল',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          style: coachingStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'কোচ উত্তর দিতে পারেনি');
      }

      const botMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'ক্ষমা করবেন, সাময়িক সংযোগ সমস্যার কারণে উত্তর প্রস্তুত করা যায়নি। আল্লাহর স্মরণেই সকল অন্তরের প্রশান্তি—অনুগ্রহ করে আবার জিজ্ঞাসা করুন।',
        time: 'এখন',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 space-y-4">
      {/* Header & Style Selector */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DEF8] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3B1E54] flex items-center justify-center text-[#D4AF37] shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-[#3B1E54] text-base font-bengali">
              তাজকির স্মার্ট ইসলামিক কোচ
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-[#A88620]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>সহিহ কুরআন-সুন্নাহ নির্দেশিত · কোনো ফতোয়া জারি করা হয় না</span>
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="flex items-center gap-1 bg-[#F5EFEB] p-1 rounded-xl text-xs font-semibold">
          {(
            [
              { id: 'gentle', label: 'কোমল' },
              { id: 'balanced', label: 'ভারসাম্যপূর্ণ' },
              { id: 'firm', label: 'সংকল্পবদ্ধ' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setCoachingStyle(s.id)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                coachingStyle === s.id
                  ? 'bg-[#3B1E54] text-white shadow-xs'
                  : 'text-[#6F5D84] hover:bg-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.role === 'user'
                  ? 'bg-[#D4AF37] text-[#3B1E54]'
                  : 'bg-[#3B1E54] text-[#D4AF37]'
              }`}
            >
              {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#3B1E54] text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#2B1340] border border-[#E8DEF8] rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-bengali">{msg.text}</div>
              <span
                className={`text-[10px] block mt-1.5 ${
                  msg.role === 'user' ? 'text-[#E8DEF8]/70 text-right' : 'text-[#8A799E]'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#6F5D84] p-3 bg-white/70 rounded-2xl w-fit border border-[#E8DEF8]">
            <Bot className="w-4 h-4 animate-bounce text-[#A88620]" />
            <span>কোচ উত্তর প্রস্তুত করছেন...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 bg-white hover:bg-[#F3EEF9] border border-[#E8DEF8] hover:border-[#D4AF37] text-[#5A3578] text-xs font-medium rounded-xl whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#E8DEF8] shadow-sm">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ইসলামিক জীবনধারা, সালাত বা মনোযোগ নিয়ে পরামর্শ চান..."
          className="flex-1 px-3 py-2 text-sm text-[#231F20] outline-hidden bg-transparent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#3B1E54] text-[#D4AF37] hover:bg-[#2B1340] disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
