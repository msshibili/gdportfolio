"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCatName, setNewCatName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });

      if (res.ok) {
        const cat = await res.json();
        setCategories([...categories, cat]);
        setNewCatName("");
      }
    } catch {
      alert("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Add New Category Form */}
      <form onSubmit={handleAddCategory} className="flex gap-4">
        <input
          type="text"
          placeholder="NEW CATEGORY NAME (E.G. MOTION DESIGN)..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#0F0F0F] border border-[#262626] text-[#F5F5F5] uppercase focus:outline-none focus:border-[var(--accent-color,#C8FF3D)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CATEGORY</span>
        </button>
      </form>

      {/* Category List Table */}
      <div className="bg-[#0F0F0F] border border-[#262626] divide-y divide-[#262626]">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between hover:bg-[#141414]">
            <div>
              <span className="font-display text-base font-bold text-[#F5F5F5] uppercase">{c.name}</span>
              <span className="text-[10px] text-[#777777] block font-mono">/works?category={c.slug}</span>
            </div>

            <button
              onClick={() => handleDelete(c.id, c.name)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
