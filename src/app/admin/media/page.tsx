import React from "react";
import MediaManager from "@/components/admin/MediaManager";
import { db } from "@/lib/db";
import { Media } from "@prisma/client";

export const revalidate = 0;

export default async function AdminMediaPage() {
  let mediaItems: Media[] = [];
  try {
    mediaItems = await db.media.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching media assets:", error);
  }

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          ASSETS & STORAGE
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          MEDIA LIBRARY ({mediaItems.length})
        </h1>
        <p className="text-[11px] text-[#9A9A9A] uppercase pt-1">
          Automated server-side Sharp optimizer converts all uploads to WebP/AVIF with responsive variants (Thumb, Medium, Large) & low-quality blur placeholders.
        </p>
      </div>

      <MediaManager initialMedia={mediaItems} />
    </div>
  );
}
