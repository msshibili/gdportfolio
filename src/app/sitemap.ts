import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { Project, Story } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let projects: Project[] = [];
  let stories: Story[] = [];

  try {
    projects = await db.project.findMany({ where: { published: true } });
    stories = await db.story.findMany({ where: { published: true } });
  } catch {
    // Ignore error
  }

  const staticRoutes = ["", "/works", "/stories", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/works/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storyRoutes = stories.map((s) => ({
    url: `${baseUrl}/stories/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...storyRoutes];
}
