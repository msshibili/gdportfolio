import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncToFirestore, deleteFromFirestore } from "@/lib/firestore";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Category name required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const created = await db.category.create({
      data: { name: name.toUpperCase(), slug },
    });

    // Automatically sync created category to Firebase Firestore
    await syncToFirestore("categories", created.id, created);

    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.category.delete({ where: { id } });

    // Automatically delete category from Firebase Firestore
    await deleteFromFirestore("categories", id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
