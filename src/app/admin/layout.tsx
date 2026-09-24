"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Image as ImageIcon,
  Tag,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  // Do not render dashboard sidebar wrapper on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleManualFirebaseSync = async () => {
    setSyncing(true);
    setSyncStatus("");
    try {
      const res = await fetch("/api/firebase/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus("Firebase Synced!");
      } else {
        setSyncStatus("Sync failed");
      }
    } catch {
      setSyncStatus("Network error");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncStatus(""), 4000);
    }
  };

  const menuItems = [
    { name: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
    { name: "WORKS", href: "/admin/works", icon: FolderKanban },
    { name: "STORIES", href: "/admin/stories", icon: FileText },
    { name: "MEDIA", href: "/admin/media", icon: ImageIcon },
    { name: "CATEGORIES", href: "/admin/categories", icon: Tag },
    { name: "SETTINGS", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] flex flex-col md:flex-row font-mono text-xs">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#0D0D0D] border-b border-[#262626] p-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <div className="font-display text-sm font-bold uppercase tracking-tight text-[#F5F5F5]">
            STUDIO DASHBOARD
          </div>
          <div className="text-[9px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase">
            ADMIN PANEL
          </div>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 border border-[#262626] bg-[#141414] text-[#F5F5F5]"
          aria-label="Toggle Navigation"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside
        className={`${
          mobileDrawerOpen ? "block" : "hidden md:flex"
        } w-full md:w-64 bg-[#0D0D0D] border-r border-[#262626] p-6 flex-col justify-between space-y-8 shrink-0 z-20`}
      >
        <div className="space-y-6">
          {/* Header Title (Desktop) */}
          <div className="hidden md:block space-y-1 border-b border-[#262626] pb-4">
            <div className="font-display text-lg font-bold uppercase tracking-tight text-[#F5F5F5]">
              STUDIO DASHBOARD
            </div>
            <div className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase">
              ADMIN CONTROL PANEL
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-[#181818] text-[var(--accent-color,#C8FF3D)] font-bold border-l-2 border-[var(--accent-color,#C8FF3D)]"
                      : "text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-[#111111]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className="space-y-3 pt-6 border-t border-[#262626]">
          {/* Firebase Sync Button */}
          <button
            onClick={handleManualFirebaseSync}
            disabled={syncing}
            className="w-full flex items-center justify-between p-3 bg-[#111111] border border-[#262626] text-[#9A9A9A] hover:text-[var(--accent-color,#C8FF3D)] hover:border-[var(--accent-color,#C8FF3D)] transition-colors uppercase"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "SYNCING..." : "SYNC FIREBASE"}</span>
            </span>
            {syncStatus && <span className="text-[9px] text-[var(--accent-color,#C8FF3D)]">{syncStatus}</span>}
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-3 bg-[#111111] border border-[#262626] text-[#9A9A9A] hover:text-[#F5F5F5] hover:border-[#777777] transition-colors"
          >
            <span>PUBLIC PORTFOLIO</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 bg-[#111111] border border-[#262626] text-red-400 hover:bg-red-950/40 hover:border-red-500/50 transition-colors uppercase"
          >
            <span>SIGN OUT</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 bg-[#070707] overflow-y-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
