"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import LightboxModal, { PosterItem } from "@/components/ui/LightboxModal";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  coverImage: string;
}

interface FeaturedWorksProps {
  works: Project[];
}

export default function FeaturedWorks({ works }: FeaturedWorksProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const posterList: PosterItem[] = (works || []).map((w) => ({
    id: w.id,
    url: w.coverImage,
    title: w.title,
    category: w.category,
    caption: `${w.title} (${w.year}) — ${w.category}`,
  }));

  const openPosterModal = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePosterIndex(index);
    setLightboxOpen(true);
  };

  if (!works || works.length === 0) {
    return (
      <section className="py-24 px-5 md:px-8 max-w-7xl mx-auto border-b border-[#262626]">
        <h2 className="font-display text-xs font-mono tracking-widest text-[#9A9A9A] uppercase mb-4">
          SELECTED WORKS
        </h2>
        <div className="p-12 border border-[#262626] bg-[#111111] text-center space-y-2">
          <p className="font-display text-xl font-bold uppercase text-[#F5F5F5]">NO FEATURED WORKS</p>
          <p className="text-xs font-mono text-[#9A9A9A]">Featured projects will appear here once published in the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 px-5 md:px-8 max-w-7xl mx-auto border-b border-[#262626]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 gap-6">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block mb-2">
            01 // SELECTION
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-[#F5F5F5]">
            SELECTED WORKS
          </h2>
        </div>
        <p className="text-xs font-mono tracking-widest text-[#9A9A9A] uppercase max-w-sm">
          A selection of identities, campaigns, posters and visual experiments.
        </p>
      </div>

      {/* Editorial Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {works.map((work, index) => {
          const isLarge = index % 4 === 0 || index % 4 === 3;
          const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
          const formattedIndex = String(index + 1).padStart(2, "0");

          return (
            <div key={work.id} className={`${colSpan} group`}>
              <div className="space-y-4">
                {/* Image Container with Editorial Border */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111111] border border-[#262626] group-hover:border-[var(--accent-color,#C8FF3D)] transition-colors duration-300">
                  <Link href={`/works/${work.slug}`} className="block w-full h-full">
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </Link>
                  
                  {/* Action Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    {/* Poster Popup Trigger Button */}
                    <button
                      onClick={(e) => openPosterModal(e, index)}
                      className="p-2 bg-[#0A0A0A]/90 border border-[#262626] text-[#F5F5F5] hover:bg-[var(--accent-color,#C8FF3D)] hover:text-[#0A0A0A] hover:border-[var(--accent-color,#C8FF3D)] transition-all"
                      title="Expand Poster Preview"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/works/${work.slug}`}
                      className="p-2 bg-[#0A0A0A] border border-[#262626] text-[#F5F5F5] group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Metadata Column */}
                <div className="flex justify-between items-start pt-2 border-t border-[#181818] group-hover:border-[#262626] transition-colors">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest block">
                      {formattedIndex}
                    </span>
                    <Link href={`/works/${work.slug}`}>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors">
                        {work.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[11px] font-mono text-[#9A9A9A] tracking-wider uppercase block">
                      {work.category}
                    </span>
                    <button
                      onClick={(e) => openPosterModal(e, index)}
                      className="text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] underline uppercase block hover:text-white"
                    >
                      POPUP POSTER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Works CTA */}
      <div className="pt-16 text-center">
        <Link
          href="/works"
          className="inline-flex items-center gap-3 px-8 py-4 border border-[#262626] bg-[#111111] hover:bg-[#161616] hover:border-[var(--accent-color,#C8FF3D)] text-xs font-mono tracking-widest uppercase text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] transition-all group"
        >
          <span>VIEW ALL WORKS ARCHIVE</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Interactive Poster Lightbox Popup */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        posters={posterList}
        currentIndex={activePosterIndex}
        onNavigate={(idx) => setActivePosterIndex(idx)}
      />
    </section>
  );
}
