"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, Shield } from "lucide-react";

export interface PosterItem {
  id?: string;
  url: string;
  title?: string;
  category?: string;
  caption?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  posters: PosterItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  isOpen,
  onClose,
  posters,
  currentIndex,
  onNavigate,
}: LightboxModalProps) {
  const currentPoster = posters[currentIndex];

  const handleNext = useCallback(() => {
    if (posters.length > 0) {
      onNavigate((currentIndex + 1) % posters.length);
    }
  }, [currentIndex, posters.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (posters.length > 0) {
      onNavigate((currentIndex - 1 + posters.length) % posters.length);
    }
  }, [currentIndex, posters.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentPoster) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#060606]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between z-10 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-color,#C8FF3D)] animate-pulse" />
          <span className="font-mono text-xs text-[#F5F5F5] uppercase tracking-widest">
            {currentPoster.title || "POSTER VIEW"}
          </span>
          {currentPoster.category && (
            <span className="text-[10px] font-mono text-[#9A9A9A] uppercase bg-[#141414] px-2 py-0.5 border border-[#262626]">
              {currentPoster.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#9A9A9A]">
            [ {currentIndex + 1} / {posters.length} ]
          </span>

          <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] bg-[#111111] px-2 py-1 border border-[#262626]">
            <Shield className="w-3 h-3 inline" />
            <span>PROTECTED ARTWORK</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#141414] border border-[#262626] text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] hover:border-[var(--accent-color,#C8FF3D)] transition-colors"
            aria-label="Close poster view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Poster Image Display Container */}
      <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
        {/* Previous Navigation Button */}
        {posters.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 bg-[#0D0D0D]/80 border border-[#262626] text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] hover:border-[var(--accent-color,#C8FF3D)] transition-colors"
            aria-label="Previous poster"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Poster Image Container */}
        <div className="relative max-w-5xl max-h-[78vh] w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full max-h-[78vh] aspect-[3/4] sm:aspect-[4/5]">
            <Image
              src={currentPoster.url}
              alt={currentPoster.title || "Poster artwork"}
              fill
              unoptimized
              priority
              className="object-contain pointer-events-none select-none"
            />
            {/* Subtle Diagonal Security Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center rotate-[-25deg]">
              <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white bg-black/40 px-4 py-2 border border-white/20 whitespace-nowrap">
                © MUHAMMED SHIBILI · ARTWORK PROTECTED
              </span>
            </div>
          </div>
        </div>

        {/* Next Navigation Button */}
        {posters.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 bg-[#0D0D0D]/80 border border-[#262626] text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] hover:border-[var(--accent-color,#C8FF3D)] transition-colors"
            aria-label="Next poster"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Footer Caption & Thumbnails */}
      <div className="z-10 border-t border-[#262626] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="text-[#9A9A9A] uppercase truncate max-w-md">
          {currentPoster.caption || currentPoster.title || "Graphic Design & Visual Storytelling Poster"}
        </div>

        {/* Poster Thumbnail Strip */}
        {posters.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {posters.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={`relative w-10 h-12 border transition-all ${
                  idx === currentIndex
                    ? "border-[var(--accent-color,#C8FF3D)] scale-105"
                    : "border-[#262626] opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={p.url} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
