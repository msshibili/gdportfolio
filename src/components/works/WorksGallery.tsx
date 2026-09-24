"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Maximize2 } from "lucide-react";
import LightboxModal, { PosterItem } from "@/components/ui/LightboxModal";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  coverImage: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface WorksGalleryProps {
  works: Project[];
  categories: Category[];
}

export default function WorksGallery({ works, categories }: WorksGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        work.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.year.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [works, selectedCategory, searchQuery]);

  const posterList: PosterItem[] = useMemo(() => {
    return filteredWorks.map((w) => ({
      id: w.id,
      url: w.coverImage,
      title: w.title,
      category: w.category,
      caption: `${w.title} (${w.year}) — ${w.category}`,
    }));
  }, [filteredWorks]);

  const openPosterModal = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePosterIndex(index);
    setLightboxOpen(true);
  };

  const allCategories = ["ALL", ...categories.map((c) => c.name)];

  return (
    <div className="space-y-8">
      {/* Category Filter Bar & Live Search */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center border-b border-[#262626] pb-6">
        {/* Filter Buttons Scrollable */}
        <div className="flex flex-wrap gap-2 text-xs font-mono tracking-widest uppercase">
          {allCategories.map((cat) => {
            const isActive = selectedCategory.toUpperCase() === cat.toUpperCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 border transition-colors ${
                  isActive
                    ? "bg-[var(--accent-color,#C8FF3D)] border-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold"
                    : "bg-[#111111] border-[#262626] text-[#9A9A9A] hover:text-[#F5F5F5] hover:border-[#777777]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
          <input
            type="text"
            placeholder="SEARCH WORKS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#262626] text-xs font-mono text-[#F5F5F5] placeholder-[#777777] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
          />
        </div>
      </div>

      {/* Gallery Grid: 2-column mobile / 3-column desktop */}
      {filteredWorks.length === 0 ? (
        <div className="py-20 text-center border border-[#262626] bg-[#111111] space-y-2">
          <p className="font-display text-xl font-bold uppercase text-[#F5F5F5]">NO WORKS FOUND</p>
          <p className="text-xs font-mono text-[#9A9A9A]">
            No projects match category &quot;{selectedCategory}&quot; or query &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredWorks.map((work, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            return (
              <div key={work.id} className="group space-y-3">
                <div className="space-y-3">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111] border border-[#262626] group-hover:border-[var(--accent-color,#C8FF3D)] transition-colors duration-300">
                    <Link href={`/works/${work.slug}`} className="block w-full h-full">
                      <Image
                        src={work.coverImage}
                        alt={work.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-104"
                      />
                    </Link>

                    {/* Poster Lightbox Popup & Detail Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => openPosterModal(e, index)}
                        className="p-1.5 bg-[#0A0A0A]/90 border border-[#262626] text-[#F5F5F5] hover:bg-[var(--accent-color,#C8FF3D)] hover:text-[#0A0A0A] hover:border-[var(--accent-color,#C8FF3D)] transition-colors"
                        title="Popup Poster Preview"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/works/${work.slug}`}
                        className="p-1.5 bg-[#0A0A0A] border border-[#262626] text-[#F5F5F5] group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-between items-start pt-1 border-t border-[#181818] group-hover:border-[#262626] transition-colors">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest block">
                        {formattedIndex}
                      </span>
                      <Link href={`/works/${work.slug}`}>
                        <h3 className="font-display text-base md:text-xl font-bold uppercase text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors truncate max-w-[160px] sm:max-w-none">
                          {work.title}
                        </h3>
                      </Link>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#9A9A9A] tracking-wider uppercase block">
                        {work.category}
                      </span>
                      <button
                        onClick={(e) => openPosterModal(e, index)}
                        className="text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] underline uppercase block hover:text-white"
                      >
                        POPUP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Poster Popup */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        posters={posterList}
        currentIndex={activePosterIndex}
        onNavigate={(idx) => setActivePosterIndex(idx)}
      />
    </div>
  );
}
