import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncToFirestore } from "@/lib/firestore";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      description,
      year,
      client,
      overview,
      challenge,
      approach,
      outcome,
      coverImage,
      gallery,
      tools,
      tags,
      credits,
      featured,
      published,
      sortOrder,
    } = body;

    if (!title || !slug || !category || !coverImage) {
      return NextResponse.json({ error: "Missing required fields (title, slug, category, coverImage)" }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        category,
        description: description || "",
        year: year || "2026",
        client,
        overview,
        challenge,
        approach,
        outcome,
        coverImage,
        gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
        tools: typeof tools === "string" ? tools : JSON.stringify(tools || []),
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        credits,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    // Automatically sync to Firebase Firestore
    await syncToFirestore("projects", project.id, project);

    return NextResponse.json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
