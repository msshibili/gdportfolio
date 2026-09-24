import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let story = null;

  try {
    story = await db.story.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Error fetching story detail:", error);
  }

  if (!story) {
    notFound();
  }

  const formattedDate = new Date(story.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  return (
    <article className="pt-32 pb-28 px-5 md:px-8 max-w-4xl mx-auto space-y-12">
      {/* Navigation */}
      <div>
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#9A9A9A] hover:text-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL STORIES</span>
        </Link>
      </div>

      {/* Story Header */}
      <div className="space-y-4 border-b border-[#262626] pb-8">
        <div className="flex items-center gap-3 text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase">
          <span>{story.category}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-[#F5F5F5] leading-tight">
          {story.title}
        </h1>
        <p className="text-lg font-sans text-[#9A9A9A] leading-relaxed">
          {story.excerpt}
        </p>
      </div>

      {/* Cover Artwork */}
      {story.coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111111] border border-[#262626]">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content Layout */}
      <div className="prose prose-invert max-w-none space-y-6 text-[#F5F5F5] font-sans text-base leading-relaxed">
        {story.content.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("# ")) {
            return (
              <h2 key={index} className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] pt-6 border-b border-[#262626] pb-3">
                {paragraph.replace("# ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("## ")) {
            return (
              <h3 key={index} className="font-display text-2xl font-bold uppercase tracking-tight text-[var(--accent-color,#C8FF3D)] pt-4">
                {paragraph.replace("## ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("> ")) {
            return (
              <blockquote key={index} className="border-l-2 border-[var(--accent-color,#C8FF3D)] pl-6 py-2 my-6 font-display italic text-xl text-[#F5F5F5] bg-[#111111]">
                {paragraph.replace("> ", "")}
              </blockquote>
            );
          }
          return (
            <p key={index} className="text-[#9A9A9A]">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Author Footer */}
      <div className="pt-12 border-t border-[#262626] flex items-center justify-between text-xs font-mono text-[#9A9A9A]">
        <div>WRITTEN BY MUHAMMED SHIBILI</div>
        <div>PUBLISHED {formattedDate}</div>
      </div>
    </article>
  );
}
