import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing media ID" }, { status: 400 });

    await db.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
