"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Search, Copy, Check, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
  width: number;
  height: number;
  size: number;
  createdAt: Date;
}

export default function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newAsset = await res.json();
        setMediaList([newAsset, ...mediaList]);
      } else {
        alert("Failed to upload image.");
      }
    } catch {
      alert("Error uploading image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList(mediaList.filter((m) => m.id !== id));
        if (selectedMedia?.id === id) setSelectedMedia(null);
      }
    } catch {
      alert("Failed to delete asset.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Drag/Drop Box & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 relative border-2 border-dashed border-[#262626] bg-[#0F0F0F] hover:border-[var(--accent-color,#C8FF3D)] transition-colors p-8 text-center space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <Upload className="w-8 h-8 mx-auto text-[var(--accent-color,#C8FF3D)]" />
          <div>
            <span className="font-bold text-[#F5F5F5] uppercase">
              {uploading ? "OPTIMIZING & SAVING..." : "CLICK OR DRAG IMAGE HERE TO UPLOAD"}
            </span>
            <p className="text-[10px] text-[#777777] uppercase pt-1">
              SUPPORTS PNG, JPG, WEBP, AVIF (MAX 20MB). AUTOMATICALLY CONVERTED TO AVIF/WEBP + BLUR PLACEHOLDERS.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
          <input
            type="text"
            placeholder="SEARCH ASSETS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-[#0F0F0F] border border-[#262626] text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] uppercase text-xs"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMedia(m)}
            className="group relative aspect-square bg-[#0F0F0F] border border-[#262626] hover:border-[var(--accent-color,#C8FF3D)] overflow-hidden cursor-pointer transition-colors"
          >
            <Image
              src={m.thumbnailUrl || m.url}
              alt={m.filename}
              fill
              sizes="200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-[9px] uppercase">
              <span className="truncate text-[#F5F5F5] font-bold">{m.filename}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(m.url, m.id);
                }}
                className="py-1 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold text-center flex items-center justify-center gap-1"
              >
                {copiedId === m.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === m.id ? "COPIED" : "COPY URL"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Inspection Drawer / Modal */}
      {selectedMedia && (
        <div className="p-6 bg-[#0F0F0F] border border-[#262626] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 bg-[#060606] border border-[#262626] overflow-hidden shrink-0">
              <Image src={selectedMedia.url} alt={selectedMedia.filename} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <div className="font-display text-base font-bold text-[#F5F5F5] uppercase">{selectedMedia.filename}</div>
              <div className="text-[10px] text-[#9A9A9A] uppercase">
                DIMENSIONS: {selectedMedia.width} x {selectedMedia.height} PX · SIZE: {Math.round(selectedMedia.size / 1024)} KB
              </div>
              <div className="text-[10px] text-[#777777] font-mono break-all">{selectedMedia.url}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(selectedMedia.url, selectedMedia.id)}
              className="px-4 py-2 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold uppercase flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>COPY IMAGE URL</span>
            </button>
            <button
              onClick={() => handleDelete(selectedMedia.id)}
              className="px-4 py-2 bg-red-950/60 border border-red-500/50 text-red-400 font-bold uppercase flex items-center gap-2 hover:bg-red-900/60"
            >
              <Trash2 className="w-4 h-4" />
              <span>DELETE ASSET</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
