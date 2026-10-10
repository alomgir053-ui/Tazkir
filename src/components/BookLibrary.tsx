import React, { useState } from 'react';
import { BookOpen, Search, Upload, Bookmark, ArrowLeft, Check, CloudUpload, FileText } from 'lucide-react';
import { CURATED_BOOKS } from '../data/libraryBooks.ts';
import { IslamicBook, ReaderZoomStep } from '../types/index.ts';
import { ZoomController } from './ZoomController.tsx';

interface BookLibraryProps {
  onOpenBook?: (book: IslamicBook) => void;
  savedBooks: string[];
  onToggleSaveBook: (id: string) => void;
  onUploadCustomBook?: (file: File) => void;
}

export const BookLibrary: React.FC<BookLibraryProps> = ({
  savedBooks,
  onToggleSaveBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingBook, setActiveReadingBook] = useState<IslamicBook | null>(null);
  const [zoom, setZoom] = useState<ReaderZoomStep>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksList, setBooksList] = useState<IslamicBook[]>(CURATED_BOOKS);

  const filteredBooks = booksList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newBook: IslamicBook = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      author: 'ব্যক্তিগত আপলোডকৃত বই (পিডিএফ)',
      category: 'ব্যক্তিগত সংগ্রহ',
      pagesCount: 15,
      description: 'আপনার ব্যক্তিগত ডিভাইস বা গুগল ড্রাইভ থেকে সংরক্ষিত ইসলামিক বই।',
      coverGradient: 'from-purple-900 via-indigo-900 to-slate-900',
      accentColor: '#D4AF37',
      badgeText: 'ব্যক্তিগত PDF',
      isCurated: false,
      contentSnippet: 'ব্যক্তিগত ইসলামিক কিতাব সফলভাবে সংরক্ষিত হয়েছে। তাজকির রিডারে নির্বিঘ্নে পড়ার জন্য প্রস্তুত।',
    };

    setBooksList((prev) => [newBook, ...prev]);
  };

  if (activeReadingBook) {
    return (
      <div className="flex flex-col h-full bg-[#FAF7F2]">
        {/* Book Reader Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/95 backdrop-blur-md border-b border-[#E8DEF8]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveReadingBook(null)}
              className="p-1.5 rounded-full hover:bg-[#F3EEF9] text-[#3B1E54] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#3B1E54] font-bengali">
                {activeReadingBook.title}
              </h2>
              <span className="text-xs text-[#8A799E]">পৃষ্ঠা {currentPage} / {activeReadingBook.pagesCount}</span>
            </div>
          </div>

          <button
            onClick={() => onToggleSaveBook(activeReadingBook.id)}
            className="p-2 rounded-full hover:bg-[#F3EEF9] text-[#3B1E54] transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${
                savedBooks.includes(activeReadingBook.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
              }`}
            />
          </button>
        </header>

        {/* Reader Document View */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-2xl mx-auto w-full transition-all"
          style={{ fontSize: `${zoom * 100}%` }}
        >
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8DEF8] shadow-md space-y-6 min-h-[500px]">
            <div className="text-center border-b border-[#E8DEF8] pb-4">
              <span className="text-xs font-bold text-[#A88620] uppercase tracking-wider block">
                {activeReadingBook.category}
              </span>
              <h1 className="text-2xl font-bold text-[#3B1E54] mt-1 font-bengali">
                {activeReadingBook.title}
              </h1>
              <p className="text-xs text-[#8A799E] mt-1">{activeReadingBook.author}</p>
            </div>

            <div className="space-y-4 text-[#2D283E] leading-relaxed font-bengali">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#A88620] first-letter:float-left first-letter:mr-2">
                {activeReadingBook.contentSnippet}
              </p>
              <p>
                আল্লাহর সন্তুষ্টি অর্জনে জ্ঞান অর্জন প্রত্যেক মুসলমানের ওপর ফরজ। দৈনন্দিন জীবনে বিভিন্ন সময়ে পাঠ করার উপযোগী দোয়া ও সহিহ সুন্নাহর দিকনির্দেশনা এই অধ্যায়ে আলোচিত হয়েছে।
              </p>
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DEF8] my-4 text-center">
                <p className="font-arabic text-xl text-[#3B1E54] leading-loose">
                  رَّبِّ زِدْنِي عِلْمًا
                </p>
                <p className="text-xs text-[#6F5D84] mt-1 font-medium">
                  "হে আমার প্রতিপালক! আমার জ্ঞান বৃদ্ধি করে দিন।" (সূরা ত্বা-হা: ১১৪)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E8DEF8] pt-4 text-xs font-bold text-[#6F5D84]">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-[#F3EEF9] text-[#3B1E54] disabled:opacity-30"
              >
                পূর্ববর্তী পাতা
              </button>
              <span>{currentPage} / {activeReadingBook.pagesCount}</span>
              <button
                disabled={currentPage >= activeReadingBook.pagesCount}
                onClick={() => setCurrentPage((p) => Math.min(activeReadingBook.pagesCount, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-[#F3EEF9] text-[#3B1E54] disabled:opacity-30"
              >
                পরবর্তী পাতা
              </button>
            </div>
          </div>
        </main>

        {/* Floating Zoom Bar */}
        <footer className="sticky bottom-0 z-20 p-3 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent">
          <ZoomController zoom={zoom} onZoomChange={setZoom} language="bn" />
        </footer>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Search & Upload Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A799E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বই, লেখক বা বিষয় খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8DEF8] rounded-2xl text-xs sm:text-sm text-[#231F20] outline-hidden focus:border-[#D4AF37]"
          />
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#3B1E54] text-[#D4AF37] hover:bg-[#2B1340] text-xs font-bold transition-all shadow-xs cursor-pointer w-full sm:w-auto justify-center">
          <Upload className="w-4 h-4" />
          <span>ব্যক্তিগত বই / PDF যোগ করুন</span>
          <input type="file" accept=".pdf,.epub,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredBooks.map((book) => {
          const isSaved = savedBooks.includes(book.id);

          return (
            <div
              key={book.id}
              onClick={() => setActiveReadingBook(book)}
              className="group flex flex-col bg-white rounded-3xl p-3 border border-[#EFE7F6] hover:border-[#D4AF37] shadow-xs hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Book Spine / Cover Mockup (Matching Reference Image) */}
              <div
                className={`w-full aspect-[3/4] rounded-2xl bg-gradient-to-br ${book.coverGradient} p-4 flex flex-col justify-between text-white relative shadow-inner border border-white/10 overflow-hidden`}
              >
                {/* Gold filigree subtle corner pattern */}
                <div className="absolute top-1 right-1 w-6 h-6 border-t border-r border-[#D4AF37]/50 rounded-tr-md" />
                <div className="absolute bottom-1 left-1 w-6 h-6 border-b border-l border-[#D4AF37]/50 rounded-bl-md" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#F4E8C1] bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {book.badgeText}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveBook(book.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/80'}`}
                    />
                  </button>
                </div>

                <div className="text-center my-auto py-2">
                  <div className="w-7 h-7 mx-auto mb-2 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base font-bengali text-[#FAF7F2] leading-tight">
                    {book.title}
                  </h3>
                </div>

                <div className="text-[10px] text-white/70 text-center truncate">
                  {book.author}
                </div>
              </div>

              {/* Book Details below cover */}
              <div className="mt-2.5 px-1 space-y-1">
                <div className="font-bold text-xs text-[#3B1E54] truncate font-bengali">
                  {book.title}
                </div>
                <div className="text-[11px] text-[#8A799E] truncate">
                  {book.pagesCount} পৃষ্ঠা · {book.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
