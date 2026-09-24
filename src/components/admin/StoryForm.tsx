"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, ArrowLeft } from "lucide-react";

interface StoryData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
}

export default function StoryForm({ initialData }: { initialData?: StoryData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<StoryData>({
    id: initialData?.id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "# Title\n\nWrite your story content here...",
    category: initialData?.category || "Process",
    coverImage: initialData?.coverImage || "/uploads/nss-rentals-cover.webp",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
  });

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: initialData?.id ? prev.slug : slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?.id ? `/api/stories/${initialData.id}` : "/api/stories";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/stories");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save story");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs font-mono">
      <div className="flex justify-between items-center border-b border-[#262626] pb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[#9A9A9A] hover:text-[#F5F5F5] uppercase flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CANCEL / BACK</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "SAVING..." : initialData?.id ? "UPDATE STORY" : "PUBLISH STORY"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 text-red-400 uppercase">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 bg-[#0F0F0F] p-6 border border-[#262626]">
          <h2 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">STORY CONTENT</h2>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">STORY TITLE *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] uppercase text-sm font-bold focus:outline-none focus:border-[var(--accent-color,#C8FF3D)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">SLUG *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] lowercase focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">CATEGORY *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] uppercase focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">SHORT EXCERPT *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">ARTICLE CONTENT (MARKDOWN) *</label>
            <textarea
              required
              rows={14}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F0F0F] p-6 border border-[#262626] space-y-4">
            <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">COVER IMAGE *</h2>

            <div className="relative aspect-[16/9] bg-[#060606] border border-[#262626] overflow-hidden">
              {formData.coverImage && (
                <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">COVER IMAGE URL</label>
              <input
                type="text"
                required
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] text-[11px]"
              />
            </div>
          </div>

          <div className="bg-[#0F0F0F] p-6 border border-[#262626] space-y-4">
            <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">STATUS</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-color,#C8FF3D)]"
              />
              <span className="text-[#F5F5F5] uppercase">PUBLISHED</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-color,#C8FF3D)]"
              />
              <span className="text-[#F5F5F5] uppercase">FEATURED STORY</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
