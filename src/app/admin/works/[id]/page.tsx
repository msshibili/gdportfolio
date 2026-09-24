import React from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: PageProps) {
  const { id } = await params;

  let project = null;
  let categories: Category[] = [];

  try {
    project = await db.project.findUnique({ where: { id } });
    categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("Error fetching work:", error);
  }

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-4">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          EDIT WORK
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          EDIT PROJECT: {project.title}
        </h1>
      </div>

      <ProjectForm initialData={project} categories={categories} />
    </div>
  );
}
