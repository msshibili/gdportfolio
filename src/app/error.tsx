"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-5 py-24">
      <div className="space-y-6 max-w-md">
        <span className="text-xs font-mono text-red-400 tracking-widest uppercase block">
          500 // SYSTEM EXCEPTION
        </span>
        <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight text-[#F5F5F5]">
          UNEXPECTED ERROR
        </h1>
        <p className="text-xs font-mono text-[#9A9A9A] uppercase leading-relaxed">
          An unexpected application runtime exception occurred. Try re-initializing the view state.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold text-xs font-mono tracking-widest uppercase hover:bg-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RETRY VIEW</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#262626] bg-[#111111] text-xs font-mono tracking-widest text-[#F5F5F5] uppercase"
          >
            HOMEPAGE
          </Link>
        </div>
      </div>
    </div>
  );
}
