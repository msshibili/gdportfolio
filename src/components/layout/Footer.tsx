"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  settings?: {
    designerName?: string;
    email?: string;
    instagram?: string;
    linkedin?: string;
    behance?: string;
  } | null;
}

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname();

  // Hide public footer inside admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const designerName = settings?.designerName || "MUHAMMED SHIBILI";
  const email = settings?.email || "hello@shibili.design";
  const instagram = settings?.instagram || "https://instagram.com";
  const linkedin = settings?.linkedin || "https://linkedin.com";
  const behance = settings?.behance || "https://behance.net";

  return (
    <footer className="bg-[#080808] border-t border-[#262626] py-16 px-5 md:px-8 mt-24 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        {/* Left Side: Designer Info */}
        <div className="space-y-3">
          <div className="font-display text-xl font-bold tracking-tight text-[#F5F5F5]">
            {designerName}
          </div>
          <div className="text-[11px] font-mono tracking-widest text-[#9A9A9A] uppercase">
            GRAPHIC DESIGNER & VISUAL STORYTELLER
          </div>
          <div className="text-[11px] font-mono text-[#9A9A9A] pt-2">
            © 2026 ALL RIGHTS RESERVED
          </div>
        </div>

        {/* Center: Social Links */}
        <div className="flex flex-wrap gap-8 text-[11px] font-mono tracking-widest uppercase text-[#9A9A9A]">
          <a
            href={`mailto:${email}`}
            className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            EMAIL
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            LINKEDIN
          </a>
          <a
            href={behance}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            BEHANCE
          </a>
        </div>

        {/* Right Side: Philosophy Statement & Admin Link */}
        <div className="space-y-2 text-right md:text-right">
          <div className="text-[11px] font-mono text-[#9A9A9A] tracking-wider uppercase">
            DESIGNED WITH INTENTION.
          </div>
          <div>
            <Link
              href="/admin/login"
              className="text-[10px] font-mono text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors"
            >
              [ ADMIN PORTAL ]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
