import React from "react";
import CategoryManager from "@/components/admin/CategoryManager";
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block">
          TAXONOMY
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase text-[#F5F5F5]">
          CATEGORIES ({categories.length})
        </h1>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
