import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import FeaturedStory from "@/components/home/FeaturedStory";
import ServicesPreview from "@/components/home/ServicesPreview";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { Project, Story, Settings } from "@prisma/client";

export const revalidate = 0;

export default async function HomePage() {
  let settings: Settings | null = null;
  let featuredWorks: Project[] = [];
  let latestStory: Story | null = null;

  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
    
    featuredWorks = await db.project.findMany({
      where: { published: true, featured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });

    if (featuredWorks.length === 0) {
      featuredWorks = await db.project.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      });
    }

    latestStory = await db.story.findFirst({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
    });

    if (!latestStory) {
      latestStory = await db.story.findFirst({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Error loading home page data:", error);
  }

  const primaryHeroArtwork = featuredWorks.length > 0 ? featuredWorks[0] : null;

  return (
    <div className="space-y-0">
      {/* 01. Minimal Hero */}
      <Hero settings={settings} featuredWork={primaryHeroArtwork} />

      {/* 02. Selected Works Asymmetric Grid */}
      <FeaturedWorks works={featuredWorks} />

      {/* 03. Latest Editorial Story */}
      {latestStory && <FeaturedStory story={latestStory} />}

      {/* 04. Editorial Services List */}
      <ServicesPreview />

      {/* 05. Large Final Contact CTA */}
      <section className="py-32 px-5 md:px-8 max-w-7xl mx-auto text-center space-y-8">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          04 // GET IN TOUCH
        </span>
        
        <h2 className="font-display text-fluid-display font-extrabold uppercase tracking-tight text-[#F5F5F5] max-w-4xl mx-auto leading-none">
          HAVE AN IDEA? <br />
          <span className="text-[var(--accent-color,#C8FF3D)]">LET&apos;S MAKE IT VISIBLE.</span>
        </h2>

        <div className="pt-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors group"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
