const { execSync } = require("child_process");

// Fallback DATABASE_URL if missing or empty on Vercel/CI environment
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  process.env.DATABASE_URL = "file:./dev.db";
}

console.log(`[Build] Using DATABASE_URL="${process.env.DATABASE_URL}"`);

try {
  console.log("[Build] Generating Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });

  console.log("[Build] Syncing SQLite Database...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });

  console.log("[Build] Building Next.js application...");
  execSync("npx next build", { stdio: "inherit", env: process.env });

  console.log("[Build] Build completed successfully!");
} catch (error) {
  console.error("[Build] Build failed with error:", error.message);
  process.exit(1);
}
