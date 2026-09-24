"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2 } from "lucide-react";

interface SettingsData {
  designerName: string;
  title: string;
  mainStatement: string;
  available: boolean;
  accentColor: string;
  email: string;
  instagram: string;
  linkedin: string;
  behance: string;
}

export default function SettingsForm({ initialSettings }: { initialSettings?: SettingsData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState<SettingsData>({
    designerName: initialSettings?.designerName || "MUHAMMED SHIBILI",
    title: initialSettings?.title || "GRAPHIC DESIGNER & VISUAL STORYTELLER",
    mainStatement: initialSettings?.mainStatement || "I CREATE VISUAL SYSTEMS, STORIES AND EXPERIENCES.",
    available: initialSettings?.available ?? true,
    accentColor: initialSettings?.accentColor || "#C8FF3D",
    email: initialSettings?.email || "hello@shibili.design",
    instagram: initialSettings?.instagram || "https://instagram.com",
    linkedin: initialSettings?.linkedin || "https://linkedin.com",
    behance: initialSettings?.behance || "https://behance.net",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSaved(true);
        // Apply dynamic accent color to current root immediately
        document.documentElement.style.setProperty("--accent-color", formData.accentColor);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {saved && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 font-bold uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>SETTINGS & ACCENT COLOR UPDATED SUCCESSFULLY!</span>
        </div>
      )}

      {/* Accent Color System */}
      <div className="p-6 bg-[#0F0F0F] border border-[#262626] space-y-4">
        <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">VISUAL ACCENT SYSTEM</h2>
        <p className="text-[#9A9A9A] text-[11px] uppercase">
          Select ONE restrained accent color used across hover states, status badges, and highlights.
        </p>

        <div className="flex items-center gap-4">
          <input
            type="color"
            value={formData.accentColor}
            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
            className="w-12 h-12 bg-transparent border-0 cursor-pointer"
          />
          <input
            type="text"
            value={formData.accentColor}
            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
            className="px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] font-mono uppercase text-sm font-bold w-36"
          />
          <div
            className="w-10 h-10 border border-[#262626]"
            style={{ backgroundColor: formData.accentColor }}
          />
          <span className="text-[10px] text-[#777777] uppercase">PREFERENCE: #C8FF3D</span>
        </div>
      </div>

      {/* Designer Availability Status */}
      <div className="p-6 bg-[#0F0F0F] border border-[#262626] space-y-4">
        <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">AVAILABILITY STATUS</h2>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="w-5 h-5 accent-[var(--accent-color,#C8FF3D)]"
          />
          <span className="font-bold text-[#F5F5F5] uppercase">
            STATUS: {formData.available ? "AVAILABLE FOR SELECTED PROJECTS" : "UNAVAILABLE"}
          </span>
        </label>
      </div>

      {/* Identity & Metadata */}
      <div className="p-6 bg-[#0F0F0F] border border-[#262626] space-y-6">
        <h2 className="font-display text-lg font-bold uppercase text-[#F5F5F5]">IDENTITY METADATA</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">DESIGNER NAME *</label>
            <input
              type="text"
              required
              value={formData.designerName}
              onChange={(e) => setFormData({ ...formData, designerName: e.target.value })}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] font-bold uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">CONTACT EMAIL *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] lowercase"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#9A9A9A] uppercase block">SUBTITLE / TITLE *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] uppercase"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[#9A9A9A] uppercase block">HERO MAIN STATEMENT *</label>
          <textarea
            required
            rows={2}
            value={formData.mainStatement}
            onChange={(e) => setFormData({ ...formData, mainStatement: e.target.value })}
            className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] uppercase font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#262626]">
          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">INSTAGRAM URL</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] text-[11px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">LINKEDIN URL</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] text-[11px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase block">BEHANCE URL</label>
            <input
              type="text"
              value={formData.behance}
              onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
              className="w-full px-3 py-2 bg-[#060606] border border-[#262626] text-[#F5F5F5] text-[11px]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-4 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? "SAVING SETTINGS..." : "SAVE SITE CONFIGURATION"}</span>
      </button>
    </form>
  );
}
