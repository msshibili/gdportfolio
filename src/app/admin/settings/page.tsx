import React from "react";
import SettingsForm from "@/components/admin/SettingsForm";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  let settings = null;
  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch (error) {
    console.error("Error fetching settings:", error);
  }

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          SYSTEM CONFIGURATION
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          SITE SETTINGS & ACCENT COLOR
        </h1>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
