import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncToFirestore, deleteFromFirestore } from "@/lib/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const project = await db.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        ...body,
        gallery: typeof body.gallery === "object" ? JSON.stringify(body.gallery) : body.gallery,
        tools: typeof body.tools === "object" ? JSON.stringify(body.tools) : body.tools,
        tags: typeof body.tags === "object" ? JSON.stringify(body.tags) : body.tags,
      },
    });

    // Automatically sync updated project to Firebase Firestore
    await syncToFirestore("projects", id, updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.project.delete({ where: { id } });

    // Automatically delete from Firebase Firestore
    await deleteFromFirestore("projects", id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
