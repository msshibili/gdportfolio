"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  createdAt: Date;
}

interface StoriesListProps {
  stories: Story[];
}

export default function StoriesList({ stories }: StoriesListProps) {
  const [activeCover, setActiveCover] = useState<string | null>(null);

  if (!stories || stories.length === 0) {
    return (
      <div className="py-20 text-center border border-[#262626] bg-[#111111] space-y-2">
        <p className="font-display text-xl font-bold uppercase text-[#F5F5F5]">NO STORIES PUBLISHED</p>
        <p className="text-xs font-mono text-[#9A9A9A]">Check back soon for new design essays and process breakdowns.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="divide-y divide-[#262626] border-y border-[#262626]">
        {stories.map((story, index) => {
          const formattedIndex = String(index + 1).padStart(2, "0");
          const formattedDate = new Date(story.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).toUpperCase();

          return (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              onMouseEnter={() => setActiveCover(story.coverImage)}
              onMouseLeave={() => setActiveCover(null)}
              className="group py-8 px-4 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:bg-[#111111] hover:px-8 cursor-pointer block"
            >
              <div className="flex items-start md:items-center gap-6 md:gap-10">
                <span className="font-mono text-sm text-[var(--accent-color,#C8FF3D)] font-bold tracking-widest pt-1 md:pt-0">
                  {formattedIndex}
                </span>

                <div className="space-y-1">
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors">
                    {story.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#9A9A9A] tracking-widest uppercase">
                    <span>{story.category}</span>
                    <span>·</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#9A9A9A] group-hover:text-[#F5F5F5] transition-colors">
                <span className="hidden md:inline text-right max-w-xs truncate">{story.excerpt}</span>
                <div className="p-2 border border-[#262626] group-hover:border-[var(--accent-color,#C8FF3D)] group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Floating Hover Cover Image Preview */}
      {activeCover && (
        <div className="hidden lg:block fixed bottom-12 right-12 z-40 w-80 h-96 bg-[#111111] border border-[var(--accent-color,#C8FF3D)] shadow-2xl overflow-hidden pointer-events-none transition-all duration-300">
          <Image
            src={activeCover}
            alt="Story Cover Preview"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
