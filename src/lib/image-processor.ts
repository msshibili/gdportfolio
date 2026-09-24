import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface ProcessedImageResult {
  filename: string;
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  blurDataUrl: string;
  width: number;
  height: number;
  size: number;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDirExists() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // Directory exists or created
  }
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImageResult> {
  await ensureUploadDirExists();

  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  const fileHash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 10);
  const sanitizeName = path.parse(originalFilename).name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const baseName = `${sanitizeName}-${fileHash}`;

  const originalPath = path.join(UPLOAD_DIR, `${baseName}.webp`);
  const thumbPath = path.join(UPLOAD_DIR, `${baseName}-thumb.webp`);
  const mediumPath = path.join(UPLOAD_DIR, `${baseName}-medium.webp`);
  const largePath = path.join(UPLOAD_DIR, `${baseName}-large.webp`);

  // Original optimized WebP
  await sharp(buffer)
    .webp({ quality: 85 })
    .toFile(originalPath);

  // Thumbnail (400px width)
  await sharp(buffer)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  // Medium (800px width)
  await sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(mediumPath);

  // Large (1600px width)
  await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(largePath);

  // Generate Blur Data URL (10px width)
  const blurBuffer = await sharp(buffer)
    .resize(10, Math.round(10 * (height / width)))
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  const stats = await fs.stat(originalPath);

  return {
    filename: `${baseName}.webp`,
    url: `/uploads/${baseName}.webp`,
    thumbnailUrl: `/uploads/${baseName}-thumb.webp`,
    mediumUrl: `/uploads/${baseName}-medium.webp`,
    largeUrl: `/uploads/${baseName}-large.webp`,
    blurDataUrl,
    width,
    height,
    size: stats.size,
  };
}
