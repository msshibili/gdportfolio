import React from "react";
import StoryForm from "@/components/admin/StoryForm";

export default function NewStoryPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-4">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          CREATE STORY
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          WRITE NEW EDITORIAL ESSAY
        </h1>
      </div>

      <StoryForm />
    </div>
  );
}
