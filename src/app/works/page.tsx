import React from "react";
import WorksGallery from "@/components/works/WorksGallery";
import { db } from "@/lib/db";
import { Project, Category } from "@prisma/client";

export const revalidate = 0;

export default async function WorksPage() {
  let works: Project[] = [];
  let categories: Category[] = [];

  try {
    works = await db.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });

    categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching works archive:", error);
  }

  return (
    <div className="pt-32 pb-28 px-5 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="space-y-4 border-b border-[#262626] pb-8">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          PORTFOLIO ARCHIVE
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-[#F5F5F5]">
          ALL WORKS
        </h1>
        <p className="text-xs font-mono text-[#9A9A9A] uppercase max-w-xl">
          Complete repository of identities, editorial publications, poster designs, and digital visual experiments.
        </p>
      </div>

      {/* Interactive Category Filter & Works Grid Component */}
      <WorksGallery works={works} categories={categories} />
    </div>
  );
}
