import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import AdminWorksActions from "@/components/admin/AdminWorksActions";
import { Project } from "@prisma/client";

export const revalidate = 0;

export default async function AdminWorksPage() {
  let works: Project[] = [];

  try {
    works = await db.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching admin works:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
            MANAGEMENT
          </span>
          <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
            WORK ARCHIVE ({works.length})
          </h1>
        </div>

        <Link
          href="/admin/works/new"
          className="px-4 py-2.5 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW WORK</span>
        </Link>
      </div>

      {/* Works Data Table */}
      {works.length === 0 ? (
        <div className="py-20 text-center border border-[#262626] bg-[#0F0F0F] space-y-3">
          <p className="font-display text-xl font-bold uppercase text-[#F5F5F5]">NO WORKS CREATED</p>
          <p className="text-xs font-mono text-[#9A9A9A]">Click &quot;CREATE NEW WORK&quot; above to add your first project.</p>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-[#262626] divide-y divide-[#262626]">
          {works.map((p) => (
            <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-[#181818] border border-[#262626] overflow-hidden shrink-0">
                  {p.coverImage && (
                    <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold uppercase text-[#F5F5F5]">
                      {p.title}
                    </span>
                    {p.featured && (
                      <span className="px-2 py-0.5 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold text-[9px] uppercase">
                        ★ FEATURED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#9A9A9A] uppercase">
                    {p.category} · {p.year} · CLIENT: {p.client || "N/A"}
                  </div>
                </div>
              </div>

              {/* Interactive Actions */}
              <AdminWorksActions project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
