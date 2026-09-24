"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  settings?: {
    designerName?: string;
    available?: boolean;
    accentColor?: string;
  } | null;
}

export default function Header({ settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Do not show public header inside admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const designerName = settings?.designerName || "MUHAMMED SHIBILI";
  const isAvailable = settings?.available ?? true;

  const navLinks = [
    { name: "WORKS", href: "/works" },
    { name: "STORIES", href: "/stories" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-md py-3.5 border-[#262626]"
            : "bg-transparent py-5 border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo / Designer Name */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2 text-xs font-semibold tracking-editorial uppercase text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color,#C8FF3D)] inline-block group-hover:scale-125 transition-transform shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">[ {designerName} ]</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-[12px] font-medium tracking-editorial uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-[#F5F5F5] ${
                    isActive ? "text-[var(--accent-color,#C8FF3D)]" : "text-[#9A9A9A]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--accent-color,#C8FF3D)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Availability Status Badge & Admin Shortcut */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#9A9A9A]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-[var(--accent-color,#C8FF3D)] animate-pulse" : "bg-red-500"
                }`}
              />
              <span>{isAvailable ? "AVAILABLE" : "UNAVAILABLE"}</span>
            </div>

            <Link
              href="/admin"
              className="text-[10px] font-mono uppercase text-[#9A9A9A] hover:text-[#F5F5F5] px-2.5 py-1 border border-[#262626] hover:border-[#F5F5F5] transition-colors"
            >
              ADMIN
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xs font-mono tracking-widest text-[#F5F5F5] px-3 py-1.5 border border-[#262626] bg-[#111111] hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "[ CLOSE ]" : "[ MENU ]"}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col justify-between px-6 sm:px-8 py-24 md:hidden border-b border-[#262626] overflow-y-auto">
          <div className="flex flex-col space-y-6">
            <div className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase">
              NAVIGATION
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-3xl sm:text-4xl uppercase font-bold tracking-tight text-[#F5F5F5] hover:text-[var(--accent-color,#C8FF3D)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col space-y-4 border-t border-[#262626] pt-6 mt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isAvailable ? "bg-[var(--accent-color,#C8FF3D)] animate-pulse" : "bg-red-500"
                }`}
              />
              <span>{isAvailable ? "AVAILABLE FOR SELECTED PROJECTS" : "UNAVAILABLE AT THIS TIME"}</span>
            </div>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono uppercase text-[#9A9A9A] underline"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
