"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function ProtectionShield({ children }: { children: React.ReactNode }) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setWarningMessage(msg);
    setTimeout(() => {
      setWarningMessage(null);
    }, 2500);
  };

  useEffect(() => {
    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showNotice("ARTWORK PROTECTED: RIGHT CLICK IS DISABLED");
    };

    // 2. Disable Key Shortcuts (Ctrl+S, Ctrl+U, Ctrl+P, F12, Ctrl+Shift+I, Ctrl+Shift+J, PrintScreen)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 or DevTools
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P"))
      ) {
        e.preventDefault();
        showNotice("CONTENT PROTECTED: SHORTCUT DISABLED");
      }

      // Detect PrintScreen
      if (e.key === "PrintScreen") {
        showNotice("SCREENSHOT PREVENTED: ARTWORK IS COPYRIGHTED");
        // Clear clipboard if possible
        navigator.clipboard?.writeText("").catch(() => {});
      }
    };

    // 3. Disable Image Dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showNotice("IMAGE DOWNLOADING IS RESTRICTED");
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <div className="relative min-h-screen select-none">
      {/* Privacy Floating Warning Toast */}
      {warningMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] border border-[var(--accent-color,#C8FF3D)] text-[#F5F5F5] px-4 py-3 text-xs font-mono tracking-widest uppercase flex items-center gap-3 shadow-2xl animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-[var(--accent-color,#C8FF3D)] animate-pulse" />
          <span>{warningMessage}</span>
        </div>
      )}
      {children}
    </div>
  );
}
