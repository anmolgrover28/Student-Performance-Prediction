import React, { useEffect, useState } from 'react';
import { SERVER_ORIGIN, ML_ORIGIN } from '../utils/api';

const POLL_MS = 20000;

export default function ServiceStatus() {
  const [backend, setBackend] = useState(null);
  const [ml, setMl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const r = await fetch(`${SERVER_ORIGIN}/health`, { method: 'GET' });
        if (!cancelled) setBackend(r.ok);
      } catch {
        if (!cancelled) setBackend(false);
      }
      try {
        const r = await fetch(`${ML_ORIGIN}/health`, { method: 'GET' });
        if (!cancelled) setMl(r.ok);
      } catch {
        if (!cancelled) setMl(false);
      }
    };

    check();
    const id = window.setInterval(check, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const Dot = ({ ok, label, title }) => (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
      title={title}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          ok === null ? 'bg-slate-600 animate-pulse' : ok ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-500'
        }`}
      />
      {label}
    </span>
  );

  return (
    <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-700/40">
      <Dot ok={backend} label="API" title={`Backend ${SERVER_ORIGIN}`} />
      <Dot ok={ml} label="ML" title={`ML service ${ML_ORIGIN}`} />
    </div>
  );
}
