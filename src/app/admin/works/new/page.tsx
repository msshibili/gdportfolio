import React from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export const revalidate = 0;

export default async function NewWorkPage() {
  let categories: Category[] = [];
  try {
    categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    categories = [{ id: "cat1", name: "BRANDING", slug: "branding", sortOrder: 1 }];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-4">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          CREATE WORK
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          ADD NEW PROJECT
        </h1>
      </div>

      <ProjectForm categories={categories} />
    </div>
  );
}
