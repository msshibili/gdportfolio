import React from "react";
import StoriesList from "@/components/stories/StoriesList";
import { db } from "@/lib/db";
import { Story } from "@prisma/client";

export const revalidate = 0;

export default async function StoriesPage() {
  let stories: Story[] = [];

  try {
    stories = await db.story.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
  }

  return (
    <div className="pt-32 pb-28 px-5 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-[#262626] pb-8">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          EDITORIAL & WRITINGS
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-[#F5F5F5]">
          STORIES & ESSAYS
        </h1>
        <p className="text-xs font-mono text-[#9A9A9A] uppercase max-w-xl">
          Thoughts on visual systems, design process, kinetic typography, and contemporary design philosophy.
        </p>
      </div>

      {/* Interactive Stories List */}
      <StoriesList stories={stories} />
    </div>
  );
}
