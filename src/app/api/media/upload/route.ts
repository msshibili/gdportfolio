import { NextResponse } from "next/server";
import { processAndSaveImage } from "@/lib/image-processor";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Sharp: AVIF/WebP conversion, responsive sizes, blur placeholder
    const processed = await processAndSaveImage(buffer, file.name);

    // Store in Media DB table
    const mediaRecord = await db.media.create({
      data: {
        filename: processed.filename,
        url: processed.url,
        thumbnailUrl: processed.thumbnailUrl,
        mediumUrl: processed.mediumUrl,
        largeUrl: processed.largeUrl,
        blurDataUrl: processed.blurDataUrl,
        width: processed.width,
        height: processed.height,
        size: processed.size,
        altText: file.name,
      },
    });

    return NextResponse.json(mediaRecord);
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Failed to process and upload image" }, { status: 500 });
  }
}
