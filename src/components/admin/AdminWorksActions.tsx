"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Copy, Eye, EyeOff, Star } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
}

export default function AdminWorksActions({ project }: { project: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    await fetch(`/api/works/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    setLoading(false);
    router.refresh();
  };

  const toggleFeature = async () => {
    setLoading(true);
    await fetch(`/api/works/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !project.featured }),
    });
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;
    setLoading(true);
    await fetch(`/api/works/${project.id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  const handleDuplicate = async () => {
    setLoading(true);
    await fetch("/api/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...project,
        title: `${project.title} (COPY)`,
        slug: `${project.slug}-copy-${Date.now().toString().slice(-4)}`,
        published: false,
        featured: false,
      }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePublish}
        disabled={loading}
        title={project.published ? "Unpublish Project" : "Publish Project"}
        className={`p-2 border text-[10px] uppercase flex items-center gap-1.5 transition-colors ${
          project.published
            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60"
            : "bg-amber-950/60 border-amber-500/50 text-amber-400 hover:bg-amber-900/60"
        }`}
      >
        {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{project.published ? "PUBLISHED" : "DRAFT"}</span>
      </button>

      <button
        onClick={toggleFeature}
        disabled={loading}
        title={project.featured ? "Unfeature" : "Feature on Homepage"}
        className={`p-2 border text-[10px] uppercase transition-colors ${
          project.featured
            ? "bg-[var(--accent-color,#C8FF3D)] border-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold"
            : "bg-[#181818] border-[#262626] text-[#9A9A9A] hover:text-[#F5F5F5]"
        }`}
      >
        <Star className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={handleDuplicate}
        disabled={loading}
        title="Duplicate Work"
        className="p-2 bg-[#181818] border border-[#262626] text-[#9A9A9A] hover:text-[#F5F5F5] hover:border-[#777777] transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <Link
        href={`/admin/works/${project.id}`}
        className="p-2 bg-[#181818] border border-[#262626] text-[#F5F5F5] hover:border-[var(--accent-color,#C8FF3D)] transition-colors flex items-center gap-1"
      >
        <Edit className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-[10px]">EDIT</span>
      </Link>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="Delete Work"
        className="p-2 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 hover:border-red-500 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
