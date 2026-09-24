"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "BRAND IDENTITY",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", projectType: "BRAND IDENTITY", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-12 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-[var(--accent-color,#C8FF3D)] mx-auto" />
        <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">INQUIRY RECEIVED</h3>
        <p className="text-xs font-mono text-[#9A9A9A] uppercase max-w-sm mx-auto">
          Thank you for reaching out. Muhammed Shibili will review your project details and respond within 24-48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] underline uppercase pt-4"
        >
          SEND ANOTHER INQUIRY
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
          YOUR NAME *
        </label>
        <input
          type="text"
          required
          placeholder="E.G. ALEXANDER VANCE"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#F5F5F5] placeholder-[#777777] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
          EMAIL ADDRESS *
        </label>
        <input
          type="email"
          required
          placeholder="E.G. ALEXANDER@STUDIO.COM"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#F5F5F5] placeholder-[#777777] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        />
      </div>

      {/* Project Type Select */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
          PROJECT DISCIPLINE *
        </label>
        <select
          value={formData.projectType}
          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        >
          <option value="BRAND IDENTITY">BRAND IDENTITY & SYSTEM</option>
          <option value="POSTER DESIGN">POSTER & TYPOGRAPHY SERIES</option>
          <option value="EDITORIAL">EDITORIAL & PUBLICATION DESIGN</option>
          <option value="DIGITAL / UI">DIGITAL INTERFACE / UI</option>
          <option value="OTHER">OTHER VISUAL INQUIRY</option>
        </select>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
          PROJECT SCOPE & TIMELINE *
        </label>
        <textarea
          required
          rows={5}
          placeholder="DESCRIBE YOUR PROJECT GOALS, TIMELINE, AND REQUIREMENTS..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#F5F5F5] placeholder-[#777777] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
        />
      </div>

      {status === "error" && (
        <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-400 text-xs font-mono uppercase">
          An error occurred. Please try sending again.
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-4 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"
      >
        <span>{status === "submitting" ? "SENDING INQUIRY..." : "TRANSMIT INQUIRY"}</span>
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
