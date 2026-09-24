"use client";

import React from "react";
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

interface FeaturedStoryProps {
  story?: Story | null;
}

export default function FeaturedStory({ story }: FeaturedStoryProps) {
  if (!story) return null;

  const formattedDate = new Date(story.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  return (
    <section className="py-28 px-5 md:px-8 max-w-7xl mx-auto border-b border-[#262626]">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-12">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block mb-2">
            02 // EDITORIAL
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-[#F5F5F5]">
            LATEST STORY
          </h2>
        </div>
        <Link
          href="/stories"
          className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A] hover:text-[var(--accent-color,#C8FF3D)] transition-colors mt-4 md:mt-0"
        >
          READ ALL STORIES →
        </Link>
      </div>

      {/* Featured Editorial Card */}
      <Link href={`/stories/${story.slug}`} className="block group">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#111111] border border-[#262626] group-hover:border-[var(--accent-color,#C8FF3D)] transition-all duration-300">
          {/* Cover Image */}
          <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto min-h-[350px] overflow-hidden bg-[#0A0A0A]">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-103"
            />
          </div>

          {/* Story Text Content */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[11px] font-mono tracking-widest text-[#9A9A9A] uppercase">
                <span className="text-[var(--accent-color,#C8FF3D)]">{story.category}</span>
                <span>·</span>
                <span>{formattedDate}</span>
              </div>

              <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors">
                {story.title}
              </h3>

              <p className="text-sm font-sans text-[#9A9A9A] leading-relaxed">
                {story.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors pt-4 border-t border-[#181818]">
              <span>READ FULL STORY</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
