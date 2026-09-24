"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Story {
  id: string;
  title: string;
  published: boolean;
}

export default function AdminStoriesActions({ story }: { story: Story }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    await fetch(`/api/stories/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !story.published }),
    });
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete story "${story.title}"?`)) return;
    setLoading(true);
    await fetch(`/api/stories/${story.id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePublish}
        disabled={loading}
        className={`p-2 border text-[10px] uppercase flex items-center gap-1.5 transition-colors ${
          story.published
            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60"
            : "bg-amber-950/60 border-amber-500/50 text-amber-400 hover:bg-amber-900/60"
        }`}
      >
        {story.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>{story.published ? "PUBLISHED" : "DRAFT"}</span>
      </button>

      <Link
        href={`/admin/stories/${story.id}`}
        className="p-2 bg-[#181818] border border-[#262626] text-[#F5F5F5] hover:border-[var(--accent-color,#C8FF3D)] transition-colors flex items-center gap-1"
      >
        <Edit className="w-3.5 h-3.5" />
        <span className="text-[10px]">EDIT</span>
      </Link>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 hover:border-red-500 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
