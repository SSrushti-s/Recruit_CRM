// components/StatusDropdown.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { updateApplicationStatus } from '@/lib/action';

interface StatusDropdownProps {
  id: string;
  currentStatus: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  WISHLIST: { label: 'Wishlist', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' },
  APPLIED: { label: 'Applied', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  OA_STAGE: { label: 'OA Stage', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  INTERVIEWING: { label: 'Interviewing', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export default function StatusDropdown({ id, currentStatus }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.WISHLIST;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (nextStatus: string) => {
    setIsOpen(false);
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      await updateApplicationStatus(id, nextStatus as any);
    });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !isPending && setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${current.bg} ${current.text} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot} ${isPending ? 'animate-pulse' : ''}`}></span>
        {current.label}
        <svg className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-100 origin-top-right">
          <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move Stage</p>
          <hr className="my-1 border-slate-100" />
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-slate-50 transition-colors ${key === currentStatus ? 'text-slate-900 font-bold bg-slate-50/50' : 'text-slate-600'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
              {config.label}
              {key === currentStatus && (
                <svg className="w-3.5 h-3.5 ml-auto text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}