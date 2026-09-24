import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import AdminStoriesActions from "@/components/admin/AdminStoriesActions";
import { Story } from "@prisma/client";

export const revalidate = 0;

export default async function AdminStoriesPage() {
  let stories: Story[] = [];

  try {
    stories = await db.story.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
  }

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
            MANAGEMENT
          </span>
          <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
            STORIES & ESSAYS ({stories.length})
          </h1>
        </div>

        <Link
          href="/admin/stories/new"
          className="px-4 py-2.5 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW STORY</span>
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="py-20 text-center border border-[#262626] bg-[#0F0F0F] space-y-3">
          <p className="font-display text-xl font-bold uppercase text-[#F5F5F5]">NO STORIES FOUND</p>
          <p className="text-xs font-mono text-[#9A9A9A]">Click &quot;CREATE NEW STORY&quot; above to add your first essay.</p>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-[#262626] divide-y divide-[#262626]">
          {stories.map((story) => (
            <div key={story.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-[#181818] border border-[#262626] overflow-hidden shrink-0">
                  {story.coverImage && (
                    <Image src={story.coverImage} alt={story.title} fill className="object-cover" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="font-display text-lg font-bold uppercase text-[#F5F5F5]">
                    {story.title}
                  </div>
                  <div className="text-[10px] text-[#9A9A9A] uppercase">
                    CATEGORY: {story.category} · {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <AdminStoriesActions story={story} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
