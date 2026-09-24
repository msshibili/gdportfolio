"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

interface HeroProps {
  settings?: {
    designerName?: string;
    title?: string;
    mainStatement?: string;
    available?: boolean;
  } | null;
  featuredWork?: {
    id: string;
    title: string;
    category: string;
    slug: string;
    coverImage: string;
  } | null;
}

export default function Hero({ settings, featuredWork }: HeroProps) {
  const designerName = settings?.designerName || "MUHAMMED SHIBILI";
  const subtitle = settings?.title || "GRAPHIC DESIGNER & VISUAL STORYTELLER";
  const mainStatement = settings?.mainStatement || "I CREATE VISUAL SYSTEMS, STORIES AND EXPERIENCES.";
  const isAvailable = settings?.available ?? true;

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 px-5 md:px-8 flex flex-col justify-between border-b border-[#262626]">
      {/* Upper Grid Layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Headline & Main Statement */}
        <div className="lg:col-span-7 space-y-8">
          {/* Designer Title */}
          <div className="space-y-2">
            <h1 className="font-display text-base md:text-lg font-bold tracking-widest uppercase text-[#F5F5F5]">
              {designerName}
            </h1>
            <p className="text-xs font-mono tracking-widest text-[#9A9A9A] uppercase">
              {subtitle}
            </p>
          </div>

          {/* Main Statement - Oversized Display Typography */}
          <h2 className="font-display text-fluid-hero font-extrabold tracking-tight uppercase text-[#F5F5F5] leading-none">
            {mainStatement.split(", ").map((part, idx) => (
              <span key={idx} className="block">
                {part}
              </span>
            ))}
          </h2>

          {/* Supporting Text & Status Badge */}
          <div className="pt-4 space-y-4">
            <p className="text-xs font-mono tracking-widest text-[#9A9A9A] uppercase">
              Branding · Editorial · Posters · Digital · Spatial Systems
            </p>

            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-[#262626] bg-[#111111] rounded-none">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-[var(--accent-color,#C8FF3D)] animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="text-[11px] font-mono tracking-widest text-[#F5F5F5] uppercase">
                {isAvailable ? "● AVAILABLE FOR SELECTED PROJECTS" : "● BOOKED UNTIL LATE 2026"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Artwork */}
        {featuredWork && (
          <div className="lg:col-span-5 relative group">
            <Link href={`/works/${featuredWork.slug}`} className="block relative overflow-hidden bg-[#111111] border border-[#262626] project-card-hover">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={featuredWork.coverImage}
                  alt={featuredWork.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover project-image transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
              </div>

              {/* Artwork Label Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase mb-1">
                    FEATURED ARTWORK // {featuredWork.category}
                  </div>
                  <div className="font-display text-2xl font-bold text-[#F5F5F5] uppercase">
                    {featuredWork.title}
                  </div>
                </div>
                <div className="p-2 border border-white/20 bg-[#0A0A0A]/80 text-[#F5F5F5] group-hover:bg-[var(--accent-color,#C8FF3D)] group-hover:text-[#0A0A0A] transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Row: Subtle Scroll Prompt */}
      <div className="max-w-7xl mx-auto w-full pt-16 flex justify-between items-center text-[11px] font-mono tracking-widest text-[#9A9A9A] uppercase">
        <div className="flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-[var(--accent-color,#C8FF3D)] animate-bounce" />
          <span>SCROLL TO EXPLORE ARCHIVE</span>
        </div>
        <div>
          [ ARCHIVE 2026 ]
        </div>
      </div>
    </section>
  );
}
