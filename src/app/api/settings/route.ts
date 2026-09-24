import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncToFirestore } from "@/lib/firestore";

export async function GET() {
  try {
    const settings = await db.settings.findUnique({ where: { id: "default" } });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await db.settings.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    // Automatically sync updated settings to Firebase Firestore
    await syncToFirestore("settings", updated.id, updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
