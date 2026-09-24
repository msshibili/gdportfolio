import React from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, FolderKanban, FileText, Image as ImageIcon, Settings } from "lucide-react";
import { db } from "@/lib/db";
import { Project } from "@prisma/client";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  let totalWorks = 0;
  let featuredWorks = 0;
  let totalStories = 0;
  let totalDrafts = 0;
  let recentProjects: Project[] = [];

  try {
    totalWorks = await db.project.count();
    featuredWorks = await db.project.count({ where: { featured: true } });
    totalStories = await db.story.count();
    totalDrafts = await db.project.count({ where: { published: false } }) + 
                  await db.story.count({ where: { published: false } });

    recentProjects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  }

  const stats = [
    { label: "TOTAL WORKS", count: String(totalWorks).padStart(2, "0"), color: "text-[#F5F5F5]" },
    { label: "FEATURED WORKS", count: String(featuredWorks).padStart(2, "0"), color: "text-[var(--accent-color,#C8FF3D)]" },
    { label: "STORIES", count: String(totalStories).padStart(2, "0"), color: "text-[#F5F5F5]" },
    { label: "DRAFTS", count: String(totalDrafts).padStart(2, "0"), color: "text-[#9A9A9A]" },
  ];

  return (
    <div className="space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
            OVERVIEW
          </span>
          <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
            SYSTEM DASHBOARD
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/works/new"
            className="px-4 py-2.5 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW WORK</span>
          </Link>
          <Link
            href="/admin/stories/new"
            className="px-4 py-2.5 bg-[#111111] border border-[#262626] text-[#F5F5F5] tracking-widest uppercase hover:border-[#777777] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NEW STORY</span>
          </Link>
        </div>
      </div>

      {/* 4 Simple Metric Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st) => (
          <div key={st.label} className="p-6 bg-[#0F0F0F] border border-[#262626] space-y-3">
            <span className="text-[10px] text-[#9A9A9A] tracking-widest uppercase block">{st.label}</span>
            <div className={`font-display text-5xl font-extrabold ${st.color}`}>{st.count}</div>
          </div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/works" className="p-6 bg-[#0F0F0F] border border-[#262626] hover:border-[var(--accent-color,#C8FF3D)] transition-colors group space-y-4">
          <div className="flex justify-between items-center text-[var(--accent-color,#C8FF3D)]">
            <FolderKanban className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div>
            <div className="font-display text-xl font-bold uppercase text-[#F5F5F5]">MANAGE WORKS</div>
            <div className="text-[10px] text-[#9A9A9A] uppercase pt-1">Create, edit, reorder, feature, and publish projects</div>
          </div>
        </Link>

        <Link href="/admin/media" className="p-6 bg-[#0F0F0F] border border-[#262626] hover:border-[var(--accent-color,#C8FF3D)] transition-colors group space-y-4">
          <div className="flex justify-between items-center text-[var(--accent-color,#C8FF3D)]">
            <ImageIcon className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div>
            <div className="font-display text-xl font-bold uppercase text-[#F5F5F5]">MEDIA MANAGER</div>
            <div className="text-[10px] text-[#9A9A9A] uppercase pt-1">Upload and optimize AVIF/WebP responsive assets</div>
          </div>
        </Link>

        <Link href="/admin/settings" className="p-6 bg-[#0F0F0F] border border-[#262626] hover:border-[var(--accent-color,#C8FF3D)] transition-colors group space-y-4">
          <div className="flex justify-between items-center text-[var(--accent-color,#C8FF3D)]">
            <Settings className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div>
            <div className="font-display text-xl font-bold uppercase text-[#F5F5F5]">SITE SETTINGS</div>
            <div className="text-[10px] text-[#9A9A9A] uppercase pt-1">Accent color picker, availability status, designer bio</div>
          </div>
        </Link>
      </div>

      {/* Recent Works List */}
      <div className="space-y-4 pt-6 border-t border-[#262626]">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">RECENTLY ADDED WORKS</h2>
          <Link href="/admin/works" className="text-[11px] text-[var(--accent-color,#C8FF3D)] hover:underline uppercase">
            VIEW ALL WORKS →
          </Link>
        </div>

        <div className="divide-y divide-[#262626] border-y border-[#262626] bg-[#0F0F0F]">
          {recentProjects.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[#141414]">
              <div className="space-y-1">
                <div className="font-display text-base font-bold uppercase text-[#F5F5F5]">{p.title}</div>
                <div className="text-[10px] text-[#9A9A9A] uppercase">{p.category} · {p.year}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-[9px] uppercase border ${p.published ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400" : "bg-amber-950/60 border-amber-500/50 text-amber-400"}`}>
                  {p.published ? "PUBLISHED" : "DRAFT"}
                </span>
                <Link
                  href={`/admin/works/${p.id}`}
                  className="px-3 py-1 bg-[#181818] border border-[#262626] text-[#F5F5F5] text-[10px] hover:border-[var(--accent-color,#C8FF3D)] uppercase"
                >
                  EDIT
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
