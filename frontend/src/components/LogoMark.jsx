import React from 'react';

export default function LogoMark({ className = 'w-10 h-10', iconClass = 'w-6 h-6' }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10 ${className}`}
    >
      <svg className={`${iconClass} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
  );
}
