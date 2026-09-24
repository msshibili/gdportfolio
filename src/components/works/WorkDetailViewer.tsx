"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import LightboxModal, { PosterItem } from "@/components/ui/LightboxModal";

interface WorkDetailViewerProps {
  title: string;
  category: string;
  coverImage: string;
  galleryImages: string[];
}

export default function WorkDetailViewer({
  title,
  category,
  coverImage,
  galleryImages,
}: WorkDetailViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const allPosters: PosterItem[] = [
    { url: coverImage, title: `${title} (Cover Poster)`, category },
    ...galleryImages.map((imgUrl, idx) => ({
      url: imgUrl,
      title: `${title} — Poster Artwork ${idx + 1}`,
      category,
    })),
  ];

  const openLightbox = (index: number) => {
    setActivePosterIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Main Cover Poster Hero */}
      <div
        onClick={() => openLightbox(0)}
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#111111] border border-[#262626] group cursor-pointer"
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />
        <div className="absolute top-4 right-4 p-3 bg-[#0A0A0A]/90 border border-[#262626] text-[#F5F5F5] group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-all flex items-center gap-2 text-xs font-mono">
          <Maximize2 className="w-4 h-4" />
          <span>EXPAND POSTER</span>
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-[#262626]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
              VISUAL SYSTEM & POSTER GALLERY ({galleryImages.length} ARTWORKS)
            </span>
            <span className="text-[10px] font-mono text-[#9A9A9A] uppercase">
              CLICK ANY POSTER TO SEE POPUP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#111111] border border-[#262626] group cursor-pointer"
              >
                <Image
                  src={imgUrl}
                  alt={`${title} gallery artwork ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <div className="absolute top-3 right-3 p-2 bg-[#0A0A0A]/90 border border-[#262626] text-[#F5F5F5] opacity-0 group-hover:opacity-100 group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal Popup */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        posters={allPosters}
        currentIndex={activePosterIndex}
        onNavigate={(idx) => setActivePosterIndex(idx)}
      />
    </div>
  );
}
