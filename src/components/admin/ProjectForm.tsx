"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, ArrowLeft, Image as ImageIcon, Upload, Plus, Trash2 } from "lucide-react";

interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  year: string;
  client?: string | null;
  overview?: string | null;
  challenge?: string | null;
  approach?: string | null;
  outcome?: string | null;
  coverImage: string;
  gallery?: string | null;
  tools?: string | null;
  tags?: string | null;
  credits?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

interface ProjectFormProps {
  initialData?: ProjectData | null;
  categories: { name: string }[];
}

export default function ProjectForm({ initialData, categories }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ProjectData>({
    id: initialData?.id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || categories[0]?.name || "POSTERS",
    description: initialData?.description || "",
    year: initialData?.year || "2026",
    client: initialData?.client || "",
    overview: initialData?.overview || "",
    challenge: initialData?.challenge || "",
    approach: initialData?.approach || "",
    outcome: initialData?.outcome || "",
    coverImage: initialData?.coverImage || "/uploads/nss-rentals-cover.webp",
    gallery: initialData?.gallery || "[]",
    tools: initialData?.tools || "[]",
    tags: initialData?.tags || "[]",
    credits: initialData?.credits || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
    sortOrder: initialData?.sortOrder || 0,
  });

  const parsedGallery: string[] = React.useMemo(() => {
    try {
      return JSON.parse(formData.gallery || "[]");
    } catch {
      return [];
    }
  }, [formData.gallery]);

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: initialData?.id ? prev.slug : slug,
    }));
  };

  // Manual Cover Poster Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const media = await res.json();
        setFormData((prev) => ({ ...prev, coverImage: media.url }));
      } else {
        setError("Failed to upload poster image.");
      }
    } catch {
      setError("Network error uploading poster image.");
    } finally {
      setUploadingCover(false);
    }
  };

  // Manual Gallery Poster Upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError("");

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        data.append("file", files[i]);
        const res = await fetch("/api/media/upload", { method: "POST", body: data });
        if (res.ok) {
          const media = await res.json();
          newUrls.push(media.url);
        }
      }
      const updatedList = [...parsedGallery, ...newUrls];
      setFormData((prev) => ({ ...prev, gallery: JSON.stringify(updatedList) }));
    } catch {
      setError("Error uploading gallery poster files.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    const updatedList = parsedGallery.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({ ...prev, gallery: JSON.stringify(updatedList) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?.id ? `/api/works/${initialData.id}` : "/api/works";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/works");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save project");
      }
    } catch {
      setError("An unexpected network error occurred.");
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
          <span>{loading ? "SAVING WORK..." : initialData?.id ? "UPDATE WORK" : "PUBLISH NEW WORK"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 text-red-400 uppercase">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 bg-[#0F0F0F] p-6 border border-[#262626]">
          <h2 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">PROJECT & POSTER DETAILS</h2>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">POSTER / PROJECT TITLE *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] uppercase text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">URL SLUG *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] lowercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">CATEGORY *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] uppercase"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">YEAR *</label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">CLIENT NAME</label>
              <input
                type="text"
                value={formData.client || ""}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">SHORT DESCRIPTION *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)]"
            />
          </div>

          {/* POSTER GALLERY MANUAL UPLOAD SECTION */}
          <div className="pt-6 border-t border-[#262626] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">
                POSTER GALLERY ({parsedGallery.length} ARTWORKS)
              </h2>
              <label className="cursor-pointer px-4 py-2 bg-[#181818] border border-[#262626] text-[var(--accent-color,#C8FF3D)] hover:bg-[#222222] transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{uploadingGallery ? "UPLOADING..." : "MANUAL UPLOAD POSTERS"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                  disabled={uploadingGallery}
                />
              </label>
            </div>

            {/* Poster Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {parsedGallery.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-[#060606] border border-[#262626] group overflow-hidden">
                  <Image src={imgUrl} alt={`Gallery ${idx}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-950/80 border border-red-500/50 text-red-400 hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Cover Poster Image */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F0F0F] p-6 border border-[#262626] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">MAIN POSTER *</h2>
              <label className="cursor-pointer px-3 py-1.5 bg-[#181818] border border-[#262626] text-[var(--accent-color,#C8FF3D)] text-[10px] hover:bg-[#222222] transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingCover ? "UPLOADING..." : "MANUAL UPLOAD"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            </div>

            <div className="relative aspect-[4/5] bg-[#060606] border border-[#262626] overflow-hidden flex items-center justify-center">
              {formData.coverImage ? (
                <Image src={formData.coverImage} alt="Cover Preview" fill className="object-cover" />
              ) : (
                <div className="text-center text-[#777777] p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <span>NO COVER SELECTED</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[#9A9A9A] uppercase block">COVER IMAGE URL</label>
              <input
                type="text"
                required
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] text-[11px]"
              />
            </div>
          </div>

          <div className="bg-[#0F0F0F] p-6 border border-[#262626] space-y-4">
            <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">STATUS & VISIBILITY</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-color,#C8FF3D)]"
              />
              <span className="text-[#F5F5F5] uppercase">PUBLISHED (PUBLIC VISIBLE)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-color,#C8FF3D)]"
              />
              <span className="text-[#F5F5F5] uppercase">FEATURED ON HOMEPAGE</span>
            </label>

            <div className="space-y-2 pt-2">
              <label className="text-[#9A9A9A] uppercase block">SORT ORDER INDEX</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
