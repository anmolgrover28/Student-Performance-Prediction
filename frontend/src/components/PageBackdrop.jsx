import React from 'react';

/**
 * Shared ambient background for auth + in-app pages (not landing).
 */
export default function PageBackdrop({ variant = 'default' }) {
  const blobs =
    variant === 'warm'
      ? (
          <>
            <div className="absolute -top-48 -left-32 w-[520px] h-[520px] rounded-full bg-fuchsia-600/15 blur-[100px] animate-float-slow" />
            <div style={{ animationDelay: '-7s' }} className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[90px] animate-float-slow" />
            <div style={{ animationDelay: '-14s' }} className="absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[100px] animate-float-slow" />
          </>
        )
      : (
          <>
            <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[100px] animate-float-slow" />
            <div style={{ animationDelay: '-8s' }} className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[90px] animate-float-slow" />
            <div style={{ animationDelay: '-15s' }} className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-float-slow" />
          </>
        );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 mesh-grid opacity-[0.35]" />
      {blobs}
    </div>
  );
}
