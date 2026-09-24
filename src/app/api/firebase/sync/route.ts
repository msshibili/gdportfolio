import { NextResponse } from "next/server";
import { syncAllToFirestore } from "@/lib/firestore";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncAllToFirestore();
  if (result.success) {
    return NextResponse.json({ message: "Firebase Firestore sync completed successfully", ...result });
  } else {
    return NextResponse.json({ error: "Firebase sync failed", details: result.error }, { status: 500 });
  }
}
