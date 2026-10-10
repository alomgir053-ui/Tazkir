import React from 'react';
import { Minus, Plus, Maximize, Minimize, RotateCcw } from 'lucide-react';
import { ReaderZoomStep } from '../types/index.ts';

export const READER_ZOOM_STEPS: ReaderZoomStep[] = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

export function stepReaderZoom(current: ReaderZoomStep, direction: 1 | -1 | 0): ReaderZoomStep {
  if (direction === 0) return 1;
  const idx = READER_ZOOM_STEPS.indexOf(current);
  if (idx === -1) return 1;
  const nextIdx = idx + direction;
  if (nextIdx < 0) return READER_ZOOM_STEPS[0];
  if (nextIdx >= READER_ZOOM_STEPS.length) return READER_ZOOM_STEPS[READER_ZOOM_STEPS.length - 1];
  return READER_ZOOM_STEPS[nextIdx];
}

interface ZoomControllerProps {
  zoom: ReaderZoomStep;
  onZoomChange: (newZoom: ReaderZoomStep) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOpenIndex?: () => void;
  language?: 'bn' | 'en' | 'ar';
}

export const ZoomController: React.FC<ZoomControllerProps> = ({
  zoom,
  onZoomChange,
  isFullscreen = false,
  onToggleFullscreen,
  onOpenIndex,
  language = 'bn',
}) => {
  const isMinZoom = zoom <= READER_ZOOM_STEPS[0];
  const isMaxZoom = zoom >= READER_ZOOM_STEPS[READER_ZOOM_STEPS.length - 1];

  const labels = {
    bn: {
      group: 'জুম নিয়ন্ত্রণ',
      out: 'জুম কমান (ছোট করুন)',
      in: 'জুম বাড়ান (বড় করুন)',
      reset: '১০০% রিসেট করুন',
      fullscreen: 'পূর্ণ স্ক্রিন',
      index: 'তালিকা',
    },
    en: {
      group: 'Zoom controls',
      out: 'Zoom out',
      in: 'Zoom in',
      reset: 'Reset to 100%',
      fullscreen: 'Fullscreen',
      index: 'Index',
    },
    ar: {
      group: 'التحكم في التكبير',
      out: 'تصغير',
      in: 'تكبير',
      reset: 'إعادة ضبط إلى 100%',
      fullscreen: 'شاشة كاملة',
      index: 'الفهرس',
    },
  }[language];

  return (
    <div
      role="toolbar"
      aria-label={labels.group}
      className="flex items-center justify-between gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8DEF8] shadow-lg text-[#3B1E54] w-full max-w-md mx-auto"
      data-reader-zoom-container
    >
      {onOpenIndex && (
        <button
          type="button"
          onClick={onOpenIndex}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-[#3B1E54] hover:bg-[#F3EEF9] transition-colors"
          title={labels.index}
        >
          <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <span>{labels.index}</span>
        </button>
      )}

      {/* Main Zoom Group */}
      <div className="flex items-center gap-1 bg-[#F9F6FC] p-1 rounded-xl border border-[#EFE7F6]">
        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={() => onZoomChange(stepReaderZoom(zoom, -1))}
          disabled={isMinZoom}
          data-action="reader-zoom"
          data-step="-1"
          data-zoom={zoom}
          aria-label={labels.out}
          title={labels.out}
          className="p-1.5 rounded-lg text-[#3B1E54] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Zoom Value & Reset Button */}
        <button
          type="button"
          onClick={() => onZoomChange(1)}
          data-action="reader-zoom"
          data-step="0"
          data-zoom={zoom}
          data-reader-zoom-value={zoom}
          aria-label={labels.reset}
          title={labels.reset}
          className="px-2.5 py-1 text-xs font-semibold tracking-wide text-[#3B1E54] hover:bg-white rounded-lg transition-colors active:scale-95 cursor-pointer flex items-center gap-1"
        >
          <span>{Math.round(zoom * 100)}%</span>
          {zoom !== 1 && <RotateCcw className="w-3 h-3 text-[#D4AF37] opacity-80" />}
        </button>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={() => onZoomChange(stepReaderZoom(zoom, 1))}
          disabled={isMaxZoom}
          data-action="reader-zoom"
          data-step="1"
          data-zoom={zoom}
          aria-label={labels.in}
          title={labels.in}
          className="p-1.5 rounded-lg text-[#3B1E54] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Toggle */}
      {onToggleFullscreen && (
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl text-[#3B1E54] hover:bg-[#F3EEF9] transition-colors"
          title={labels.fullscreen}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-[#D4AF37]" /> : <Maximize className="w-4 h-4 text-[#D4AF37]" />}
          <span className="hidden sm:inline">{labels.fullscreen}</span>
        </button>
      )}
    </div>
  );
};
