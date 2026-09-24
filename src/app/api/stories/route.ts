import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncToFirestore } from "@/lib/firestore";

export async function GET() {
  try {
    const stories = await db.story.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, coverImage, featured, published } = body;

    if (!title || !slug || !content || !coverImage) {
      return NextResponse.json({ error: "Missing required story fields" }, { status: 400 });
    }

    const story = await db.story.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        excerpt: excerpt || "",
        content,
        category: category || "Process",
        coverImage,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    // Automatically sync story to Firebase Firestore
    await syncToFirestore("stories", story.id, story);

    return NextResponse.json(story);
  } catch (error) {
    console.error("Create story error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
