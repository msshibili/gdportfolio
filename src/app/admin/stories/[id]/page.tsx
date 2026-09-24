import React from "react";
import StoryForm from "@/components/admin/StoryForm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: PageProps) {
  const { id } = await params;

  let story = null;
  try {
    story = await db.story.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error fetching story:", error);
  }

  if (!story) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-4">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          EDIT STORY
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          EDIT STORY: {story.title}
        </h1>
      </div>

      <StoryForm initialData={story} />
    </div>
  );
}
