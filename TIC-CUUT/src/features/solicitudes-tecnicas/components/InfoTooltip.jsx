import React, { useState, useEffect, useRef } from 'react';

export default function InfoTooltip({ text, tone = 'blue', position = 'top' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  const toneClasses =
    tone === 'pink'
      ? 'text-[#A65D8B] hover:bg-[#A65D8B]/10 focus:ring-[#A65D8B]/30'
      : 'text-[#486AE6] hover:bg-[#486AE6]/10 focus:ring-[#486AE6]/30';

  return (
    <span ref={wrapperRef} className="relative inline-flex items-center ml-1 z-20">
      <button
        type="button"
        aria-label="Más información"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors outline-none focus:ring-2 ${toneClasses}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
        </svg>
      </button>

      {open && (
        <span
          className={`absolute z-50 w-56 bg-slate-900 text-white text-[11px] leading-tight rounded-lg px-3 py-2 shadow-xl border border-slate-700 pointer-events-none ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
        >
          {text}
        </span>
      )}
    </span>
  );
}