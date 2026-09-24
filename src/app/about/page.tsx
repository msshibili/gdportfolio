import React from "react";
import ServicesPreview from "@/components/home/ServicesPreview";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch {
    // Fallback
  }

  const designerName = settings?.designerName || "MUHAMMED SHIBILI";

  const experiences = [
    { year: "2024 — PRESENT", role: "SENIOR GRAPHIC DESIGNER & ART DIRECTOR", company: "INDEPENDENT STUDIO" },
    { year: "2022 — 2024", role: "LEAD BRAND IDENTITIES DESIGNER", company: "KINETIC VISUAL CO." },
    { year: "2020 — 2022", role: "EDITORIAL & POSTER DESIGNER", company: "SYNTHESIS MAGAZINE" },
  ];

  const tools = [
    "ADOBE ILLUSTRATOR", "ADOBE PHOTOSHOP", "ADOBE INDESIGN", "FIGMA", 
    "TOUCHDESIGNER", "AFTER EFFECTS", "GLYPHS TYPE DESIGN", "BLENDER 3D"
  ];

  const approaches = [
    { num: "01", title: "GRID ABSOLUTISM", desc: "Every visual composition starts with a rigid structural layout grid. Structure creates visual tension." },
    { num: "02", title: "TYPOGRAPHIC CLARITY", desc: "Typography is not just text; it is the visual voice and primary architecture of communication." },
    { num: "03", title: "COLOR RESTRAINT", desc: "Deep dark surfaces with a singular, high-visibility accent color draw focus strictly to artwork." },
    { num: "04", title: "SYSTEMIC THINKING", desc: "We design adaptable visual systems that scale effortlessly from physical poster print to mobile apps." }
  ];

  return (
    <div className="pt-32 pb-28 px-5 md:px-8 max-w-7xl mx-auto space-y-24">
      {/* Hero Header */}
      <div className="space-y-6 border-b border-[#262626] pb-12">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          ABOUT // {designerName}
        </span>
        
        <h1 className="font-display text-fluid-hero font-extrabold uppercase tracking-tight text-[#F5F5F5] leading-none">
          DESIGN IS NOT <br />
          DECORATION. <br />
          <span className="text-[var(--accent-color,#C8FF3D)]">IT IS COMMUNICATION.</span>
        </h1>
      </div>

      {/* Professional Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 text-xs font-mono text-[#9A9A9A] tracking-widest uppercase space-y-4">
          <div>[ BIOGRAPHY ]</div>
          <div className="text-[#F5F5F5] font-bold text-sm">BASED IN GLOBAL DIGITAL STUDIO</div>
        </div>

        <div className="lg:col-span-8 space-y-6 text-base font-sans text-[#9A9A9A] leading-relaxed">
          <p className="text-xl font-display font-semibold text-[#F5F5F5] leading-snug uppercase">
            I am Muhammed Shibili, a multidisciplinary graphic designer and visual storyteller specializing in high-contrast brand identities, editorial publications, poster design, and digital archives.
          </p>
          <p>
            With over 6 years of experience working alongside international creative studios, cultural institutions, and independent brands, my work is rooted in structural grids, kinetic typography, and brutalist minimalism.
          </p>
          <p>
            I believe that great design communicates confidence, intention, and clarity without relying on unnecessary decorative clutter.
          </p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-8 border-t border-[#262626] pt-16">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          01 // EXPERIENCE
        </span>
        <h2 className="font-display text-3xl font-bold uppercase text-[#F5F5F5]">CAREER TIMELINE</h2>

        <div className="divide-y divide-[#262626] border-y border-[#262626]">
          {experiences.map((exp, idx) => (
            <div key={idx} className="py-6 flex flex-col md:flex-row justify-between md:items-center gap-2">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)]">{exp.year}</span>
              <span className="font-display text-xl font-bold text-[#F5F5F5] uppercase">{exp.role}</span>
              <span className="text-xs font-mono text-[#9A9A9A] uppercase">{exp.company}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Hover Image Section */}
      <ServicesPreview />

      {/* Tools Section */}
      <div className="space-y-8 border-t border-[#262626] pt-16">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          02 // TOOLKIT
        </span>
        <h2 className="font-display text-3xl font-bold uppercase text-[#F5F5F5]">SOFTWARE & UTILITIES</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool, idx) => (
            <div key={idx} className="p-4 bg-[#111111] border border-[#262626] text-xs font-mono text-[#F5F5F5] uppercase tracking-wider text-center">
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Approach Cards Section */}
      <div className="space-y-8 border-t border-[#262626] pt-16">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          03 // PHILOSOPHY
        </span>
        <h2 className="font-display text-3xl font-bold uppercase text-[#F5F5F5]">DESIGN APPROACH</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {approaches.map((app, idx) => (
            <div key={idx} className="p-8 bg-[#111111] border border-[#262626] space-y-3">
              <span className="text-xs font-mono text-[var(--accent-color,#C8FF3D)] font-bold">{app.num}</span>
              <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">{app.title}</h3>
              <p className="text-xs font-mono text-[#9A9A9A] leading-relaxed uppercase">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
