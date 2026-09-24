import React from "react";
import ContactForm from "@/components/contact/ContactForm";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch {
    // Fallback
  }

  const email = settings?.email || "hello@shibili.design";
  const instagram = settings?.instagram || "https://instagram.com";
  const linkedin = settings?.linkedin || "https://linkedin.com";
  const behance = settings?.behance || "https://behance.net";

  return (
    <div className="pt-28 md:pt-32 pb-20 md:pb-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12 md:space-y-16">
      {/* Header CTA */}
      <div className="space-y-4 md:space-y-6 border-b border-[#262626] pb-8 md:pb-12">
        <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          COMMISSION & INQUIRIES
        </span>
        
        <h1 className="font-display text-fluid-display font-extrabold uppercase tracking-tight text-[#F5F5F5] leading-none">
          HAVE AN IDEA? <br />
          <span className="text-[var(--accent-color,#C8FF3D)]">LET&apos;S MAKE IT VISIBLE.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Contact Info & Socials */}
        <div className="lg:col-span-5 space-y-8 md:space-y-10">
          <div className="space-y-3 bg-[#0F0F0F] p-6 border border-[#262626]">
            <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
              DIRECT EMAIL
            </span>
            <a
              href={`mailto:${email}`}
              className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] transition-colors uppercase block break-all leading-snug"
            >
              {email}
            </a>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#262626]">
            <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-widest block">
              SOCIAL CHANNELS
            </span>

            <div className="flex flex-col space-y-2 text-xs sm:text-sm font-mono tracking-widest uppercase text-[#F5F5F5]">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors flex justify-between items-center py-3 px-4 bg-[#0F0F0F] border border-[#262626]"
              >
                <span>INSTAGRAM</span>
                <span>↗</span>
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors flex justify-between items-center py-3 px-4 bg-[#0F0F0F] border border-[#262626]"
              >
                <span>LINKEDIN</span>
                <span>↗</span>
              </a>
              <a
                href={behance}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors flex justify-between items-center py-3 px-4 bg-[#0F0F0F] border border-[#262626]"
              >
                <span>BEHANCE</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#111111] border border-[#262626] space-y-2">
            <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] uppercase tracking-widest block font-bold">
              ● AVAILABILITY NOTICE
            </span>
            <p className="text-xs font-mono text-[#9A9A9A] uppercase leading-relaxed">
              Currently accepting selected brand identity systems, poster commissions, and editorial projects for Q3/Q4 2026.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#111111] p-6 sm:p-8 md:p-10 border border-[#262626] w-full min-w-0">
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#F5F5F5] mb-6">
            SEND PROJECT INQUIRY
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
