import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import WorkDetailViewer from "@/components/works/WorkDetailViewer";
import { db } from "@/lib/db";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let project = null;
  let nextProject = null;

  try {
    project = await db.project.findUnique({
      where: { slug },
    });

    if (project) {
      nextProject = await db.project.findFirst({
        where: {
          published: true,
          id: { not: project.id },
        },
        orderBy: { sortOrder: "asc" },
      });
    }
  } catch (error) {
    console.error("Error loading project detail:", error);
  }

  if (!project) {
    notFound();
  }

  let galleryImages: string[] = [];
  try {
    if (project.gallery) {
      galleryImages = JSON.parse(project.gallery);
    }
  } catch {
    galleryImages = [];
  }

  let toolsList: string[] = [];
  try {
    if (project.tools) {
      toolsList = JSON.parse(project.tools);
    }
  } catch {
    toolsList = project.tools ? [project.tools] : [];
  }

  return (
    <article className="pt-32 pb-28 px-5 md:px-8 max-w-7xl mx-auto space-y-16">
      {/* Back to Works Nav */}
      <div>
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#9A9A9A] hover:text-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL WORKS</span>
        </Link>
      </div>

      {/* Case Study Header Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#262626] pb-12 items-end">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase">
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-[#F5F5F5]">
            {project.title}
          </h1>
          <p className="text-lg font-sans text-[#9A9A9A] max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Metadata Sidebar Bar */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6 bg-[#111111] p-6 border border-[#262626] text-xs font-mono uppercase">
          <div>
            <span className="text-[#777777] block mb-1">CLIENT</span>
            <span className="text-[#F5F5F5] font-bold">{project.client || "CONFIDENTIAL"}</span>
          </div>
          <div>
            <span className="text-[#777777] block mb-1">YEAR</span>
            <span className="text-[#F5F5F5] font-bold">{project.year}</span>
          </div>
          <div>
            <span className="text-[#777777] block mb-1">DISCIPLINE</span>
            <span className="text-[#F5F5F5] font-bold">{project.category}</span>
          </div>
          <div>
            <span className="text-[#777777] block mb-1">TOOLS</span>
            <span className="text-[#F5F5F5] font-bold">{toolsList.join(", ") || "DESIGN SUITE"}</span>
          </div>
        </div>
      </div>

      {/* Interactive Work Poster Viewer Component */}
      <WorkDetailViewer
        title={project.title}
        category={project.category}
        coverImage={project.coverImage}
        galleryImages={galleryImages}
      />

      {/* Case Study Written Sections: OVERVIEW, CHALLENGE, APPROACH, OUTCOME */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6 text-xs font-mono uppercase text-[#9A9A9A] tracking-widest">
            <div>[ CASE STUDY ANALYSIS ]</div>
            {project.credits && (
              <div className="pt-4 border-t border-[#262626] space-y-1">
                <span className="text-[#777777]">PROJECT CREDITS</span>
                <p className="text-[#F5F5F5] font-sans font-normal text-sm normal-case">{project.credits}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-16">
          {project.overview && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
                01 // OVERVIEW
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">OVERVIEW</h2>
              <p className="text-base text-[#9A9A9A] leading-relaxed font-sans">{project.overview}</p>
            </div>
          )}

          {project.challenge && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
                02 // CHALLENGE
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">THE CHALLENGE</h2>
              <p className="text-base text-[#9A9A9A] leading-relaxed font-sans">{project.challenge}</p>
            </div>
          )}

          {project.approach && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
                03 // APPROACH
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">OUR APPROACH</h2>
              <p className="text-base text-[#9A9A9A] leading-relaxed font-sans">{project.approach}</p>
            </div>
          )}

          {project.outcome && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
                04 // OUTCOME
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">THE OUTCOME</h2>
              <p className="text-base text-[#9A9A9A] leading-relaxed font-sans">{project.outcome}</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Project Footer Bar */}
      {nextProject && (
        <div className="pt-20 border-t border-[#262626] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[11px] font-mono text-[#9A9A9A] uppercase tracking-widest block">
              NEXT PROJECT
            </span>
            <h3 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] transition-colors">
              <Link href={`/works/${nextProject.slug}`}>{nextProject.title}</Link>
            </h3>
          </div>
          <Link
            href={`/works/${nextProject.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#262626] bg-[#111111] text-xs font-mono tracking-widest uppercase text-[#F5F5F5] hover:border-[var(--accent-color,#C8FF3D)] hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            <span>VIEW NEXT CASE STUDY</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </article>
  );
}
