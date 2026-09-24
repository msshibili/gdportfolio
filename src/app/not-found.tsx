import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-5 py-24">
      <div className="space-y-6 max-w-md">
        <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          404 // PAGE NOT FOUND
        </span>
        <h1 className="font-display text-6xl font-extrabold uppercase tracking-tight text-[#F5F5F5]">
          OUT OF BOUNDS
        </h1>
        <p className="text-xs font-mono text-[#9A9A9A] uppercase leading-relaxed">
          The requested portfolio route or case study asset does not exist in the visual archive.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#262626] bg-[#111111] text-xs font-mono tracking-widest text-[#F5F5F5] hover:border-[var(--accent-color,#C8FF3D)] hover:text-[var(--accent-color,#C8FF3D)] uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO MAIN PORTFOLIO</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
