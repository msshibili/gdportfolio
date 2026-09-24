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
    const story = await db.story.findUnique({ where: { id } });
    if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });
    return NextResponse.json(story);
  } catch {
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const updated = await db.story.update({
      where: { id },
      data: body,
    });

    // Automatically sync updated story to Firebase Firestore
    await syncToFirestore("stories", id, updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update story error:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.story.delete({ where: { id } });

    // Automatically delete story from Firebase Firestore
    await deleteFromFirestore("stories", id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
