import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Helper to generate visually striking graphic design poster SVG & save as WebP
async function generateGraphicDesignPoster(
  title: string,
  subtitle: string,
  colorScheme: { bg: string; accent: string; text: string; secondary: string },
  patternType: "grid" | "circle" | "editorial" | "typographic" | "abstract",
  filename: string
): Promise<{ url: string; thumbUrl: string; width: number; height: number; blurUrl: string }> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const width = 1200;
  const height = 1500;

  let patternSvg = "";
  if (patternType === "grid") {
    patternSvg = `
      <g opacity="0.15" stroke="${colorScheme.text}" stroke-width="1">
        ${Array.from({ length: 12 }).map((_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="1500" />`).join("")}
        ${Array.from({ length: 15 }).map((_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}" />`).join("")}
      </g>
      <rect x="100" y="200" width="1000" height="1000" fill="none" stroke="${colorScheme.accent}" stroke-width="4" opacity="0.8"/>
      <circle cx="600" cy="700" r="350" fill="none" stroke="${colorScheme.accent}" stroke-width="8"/>
      <circle cx="600" cy="700" r="200" fill="${colorScheme.accent}" opacity="0.15"/>
    `;
  } else if (patternType === "circle") {
    patternSvg = `
      <circle cx="600" cy="650" r="450" fill="${colorScheme.accent}" opacity="0.2"/>
      <circle cx="600" cy="650" r="300" fill="none" stroke="${colorScheme.text}" stroke-width="2" stroke-dasharray="10,15"/>
      <rect x="200" y="300" width="800" height="700" fill="none" stroke="${colorScheme.text}" stroke-width="1" opacity="0.3"/>
      <line x1="100" y1="650" x2="1100" y2="650" stroke="${colorScheme.accent}" stroke-width="2"/>
    `;
  } else if (patternType === "editorial") {
    patternSvg = `
      <rect x="80" y="80" width="1040" height="1340" fill="none" stroke="${colorScheme.secondary}" stroke-width="1"/>
      <rect x="140" y="140" width="920" height="600" fill="${colorScheme.accent}" opacity="0.1"/>
      <rect x="140" y="140" width="920" height="600" fill="none" stroke="${colorScheme.accent}" stroke-width="2"/>
      <line x1="140" y1="800" x2="1060" y2="800" stroke="${colorScheme.secondary}" stroke-width="1"/>
    `;
  } else if (patternType === "typographic") {
    patternSvg = `
      <text x="80" y="450" font-family="sans-serif" font-size="280" font-weight="900" fill="${colorScheme.accent}" opacity="0.25">STUDIO</text>
      <text x="80" y="750" font-family="sans-serif" font-size="280" font-weight="900" fill="${colorScheme.text}" opacity="0.15">SYSTEM</text>
      <circle cx="950" cy="300" r="120" fill="${colorScheme.accent}"/>
    `;
  } else {
    patternSvg = `
      <path d="M100 300 Q 600 100 1100 300 T 1100 1100 Q 600 1300 100 1100 Z" fill="none" stroke="${colorScheme.accent}" stroke-width="3"/>
      <line x1="100" y1="100" x2="1100" y2="1400" stroke="${colorScheme.secondary}" stroke-width="1" opacity="0.4"/>
      <circle cx="600" cy="700" r="280" fill="${colorScheme.accent}" opacity="0.1"/>
    `;
  }

  const cleanTitle = title.replace(/&/g, "AND").toUpperCase();
  const cleanSubtitle = subtitle.replace(/&/g, "AND").toUpperCase();

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad_${filename}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.bg}" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGrad_${filename})" />
      
      ${patternSvg}

      <g font-family="sans-serif">
        <text x="100" y="140" font-size="16" letter-spacing="4" font-weight="700" fill="${colorScheme.accent}">MUHAMMED SHIBILI · SELECTED WORKS</text>
        <text x="100" y="1250" font-size="64" font-weight="900" fill="${colorScheme.text}">${cleanTitle}</text>
        <text x="100" y="1320" font-size="24" font-weight="500" fill="${colorScheme.secondary}">${cleanSubtitle}</text>
        
        <text x="1000" y="140" font-size="16" font-weight="600" fill="${colorScheme.secondary}" text-anchor="end">2026 ARCHIVE</text>
        <line x1="100" y1="1170" x2="1100" y2="1170" stroke="${colorScheme.secondary}" stroke-width="1" opacity="0.4"/>
      </g>
    </svg>`;

  const webpBuffer = await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toBuffer();

  const filePath = path.join(UPLOAD_DIR, `${filename}.webp`);
  const thumbPath = path.join(UPLOAD_DIR, `${filename}-thumb.webp`);

  await fs.writeFile(filePath, webpBuffer);

  const thumbBuffer = await sharp(webpBuffer)
    .resize(400, 500)
    .webp({ quality: 80 })
    .toBuffer();
  await fs.writeFile(thumbPath, thumbBuffer);

  // Blur placeholder
  const blurBuffer = await sharp(webpBuffer)
    .resize(10, 12)
    .webp({ quality: 20 })
    .toBuffer();
  const blurUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    url: `/uploads/${filename}.webp`,
    thumbUrl: `/uploads/${filename}-thumb.webp`,
    width,
    height,
    blurUrl,
  };
}

async function main() {
  console.log("Seeding database...");

  // Clean existing tables
  await prisma.project.deleteMany();
  await prisma.story.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.adminUser.deleteMany();

  // 1. Seed Settings
  await prisma.settings.create({
    data: {
      id: "default",
      designerName: "MUHAMMED SHIBILI",
      title: "GRAPHIC DESIGNER & VISUAL STORYTELLER",
      mainStatement: "I CREATE VISUAL SYSTEMS, STORIES AND EXPERIENCES.",
      available: true,
      accentColor: "#C8FF3D",
      email: "hello@shibili.design",
      instagram: "https://instagram.com/shibili.design",
      linkedin: "https://linkedin.com/in/shibili-design",
      behance: "https://behance.net/shibili-design",
    },
  });

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash("admin123456", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@shibili.design",
      passwordHash,
      role: "ADMIN",
    },
  });

  // 3. Seed Categories
  const categoriesData = [
    { name: "BRANDING", slug: "branding", sortOrder: 1 },
    { name: "POSTERS", slug: "posters", sortOrder: 2 },
    { name: "SOCIAL", slug: "social", sortOrder: 3 },
    { name: "EDITORIAL", slug: "editorial", sortOrder: 4 },
    { name: "UI/UX", slug: "ui-ux", sortOrder: 5 },
    { name: "ILLUSTRATION", slug: "illustration", sortOrder: 6 },
    { name: "MOTION", slug: "motion", sortOrder: 7 },
    { name: "EXPERIMENTAL", slug: "experimental", sortOrder: 8 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  // Generate Artworks
  const artwork1 = await generateGraphicDesignPoster(
    "NSS RENTALS",
    "Brand Identity Spatial System",
    { bg: "#0D0D0D", accent: "#C8FF3D", text: "#F5F5F5", secondary: "#9A9A9A" },
    "grid",
    "nss-rentals-cover"
  );

  const artwork2 = await generateGraphicDesignPoster(
    "AURA KINETICS",
    "Editorial Poster Series",
    { bg: "#111111", accent: "#C8FF3D", text: "#FFFFFF", secondary: "#777777" },
    "circle",
    "aura-kinetics-cover"
  );

  const artwork3 = await generateGraphicDesignPoster(
    "MONOLITH RECORDS",
    "Vinyl Packaging Visual Identity",
    { bg: "#080808", accent: "#E5E5E5", text: "#F5F5F5", secondary: "#888888" },
    "editorial",
    "monolith-records-cover"
  );

  const artwork4 = await generateGraphicDesignPoster(
    "SYNTHESIS MAG",
    "Publication Design Grid System",
    { bg: "#141414", accent: "#C8FF3D", text: "#F5F5F5", secondary: "#9A9A9A" },
    "typographic",
    "synthesis-mag-cover"
  );

  const artwork5 = await generateGraphicDesignPoster(
    "SOLARIS 2026",
    "Festival Identity Campaign",
    { bg: "#0F0F0F", accent: "#C8FF3D", text: "#FFFFFF", secondary: "#999999" },
    "abstract",
    "solaris-cover"
  );

  const artwork6 = await generateGraphicDesignPoster(
    "NEURAL FORMS",
    "Generative Posters Typography",
    { bg: "#0B0B0B", accent: "#C8FF3D", text: "#F5F5F5", secondary: "#888888" },
    "grid",
    "neural-forms-cover"
  );

  // Gallery items
  const gal1 = await generateGraphicDesignPoster(
    "NSS DETAIL 01",
    "Brand Guidelines Layout",
    { bg: "#161616", accent: "#C8FF3D", text: "#F5F5F5", secondary: "#9A9A9A" },
    "editorial",
    "nss-detail-1"
  );

  const gal2 = await generateGraphicDesignPoster(
    "NSS DETAIL 02",
    "Stationery Typography",
    { bg: "#121212", accent: "#F5F5F5", text: "#C8FF3D", secondary: "#888888" },
    "grid",
    "nss-detail-2"
  );

  // Seed Projects
  const projectsData = [
    {
      title: "NSS RENTALS",
      slug: "nss-rentals",
      category: "BRANDING",
      year: "2026",
      client: "NSS Group",
      description: "A comprehensive dark visual identity created for a modern equipment rental company.",
      overview: "NSS Rentals required a refreshed, high-impact brand identity that communicates precision, modern engineering, and confidence across digital and physical touchpoints.",
      challenge: "The previous brand lacked coherence across large-scale physical equipment branding, digital platforms, and printed collateral.",
      approach: "We built a rigid structural grid system accompanied by high-contrast typography, high-visibility accent highlights, and modular iconography.",
      outcome: "A versatile visual design system deployed across 400+ physical assets, mobile applications, and web platforms.",
      coverImage: artwork1.url,
      gallery: JSON.stringify([gal1.url, gal2.url]),
      tools: JSON.stringify(["Figma", "Illustrator", "Photoshop", "After Effects"]),
      tags: JSON.stringify(["Branding", "Grid System", "Identity", "Posters"]),
      credits: "Client: NSS Group · Art Direction: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "AURA KINETICS",
      slug: "aura-kinetics",
      category: "POSTERS",
      year: "2026",
      client: "Aura Kinetic Sound",
      description: "A series of typographic poster compositions exploring rhythm, motion, and digital sound structures.",
      overview: "A kinetic typography experiment turned official poster series for electronic sound producer Aura Kinetics.",
      challenge: "Capturing sound frequency and movement in static print formats.",
      approach: "Utilizing warped vector paths, severe negative space, and custom grotesque letterforms.",
      outcome: "Featured in international poster archives and selected for Tokyo Design Week 2026.",
      coverImage: artwork2.url,
      gallery: JSON.stringify([artwork2.url]),
      tools: JSON.stringify(["Illustrator", "Glyphs", "Photoshop"]),
      tags: JSON.stringify(["Posters", "Typography", "Experimental"]),
      credits: "Design & Art Direction: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 2,
    },
    {
      title: "MONOLITH RECORDS",
      slug: "monolith-records",
      category: "BRANDING",
      year: "2026",
      client: "Monolith Music",
      description: "Tactile vinyl record packaging and identity system for an independent ambient music label.",
      overview: "Minimalist brutalist vinyl sleeves, embossing, and typography for Monolith's catalog series.",
      challenge: "Balancing ultra-minimalism with rich textural depth.",
      approach: "Deep black foil stamping on heavy matte dark paper stock with subtle chartreuse accent stickers.",
      outcome: "Sold out 1,000 limited edition vinyl pressings within 48 hours.",
      coverImage: artwork3.url,
      gallery: JSON.stringify([artwork3.url]),
      tools: JSON.stringify(["InDesign", "Illustrator", "Photoshop"]),
      tags: JSON.stringify(["Packaging", "Vinyl", "Branding"]),
      credits: "Client: Monolith Records · Designer: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 3,
    },
    {
      title: "SYNTHESIS MAGAZINE",
      slug: "synthesis-magazine",
      category: "EDITORIAL",
      year: "2026",
      client: "Synthesis Collective",
      description: "Quarterly publication covering design theory, generative art, and visual systems.",
      overview: "Complete editorial layout, custom typeface selection, and grid composition for Issue 04.",
      challenge: "Structuring dense multi-column essay content alongside large-format visual art spreads.",
      approach: "Asymmetric 6-column editorial layout system with dynamic marginalia.",
      outcome: "Distributed across 25 international art book stores in Berlin, London, and Tokyo.",
      coverImage: artwork4.url,
      gallery: JSON.stringify([artwork4.url]),
      tools: JSON.stringify(["InDesign", "Figma", "Photoshop"]),
      tags: JSON.stringify(["Editorial", "Magazine", "Typography"]),
      credits: "Editor-in-Chief: Elena Vance · Design: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 4,
    },
    {
      title: "SOLARIS 2026",
      slug: "solaris-2026",
      category: "EXPERIMENTAL",
      year: "2025",
      client: "Solaris Arts",
      description: "Visual identity and digital campaign for an international generative art symposium.",
      overview: "Dynamic visual identity system featuring generative pattern algorithms and high-contrast digital displays.",
      challenge: "Designing an identity that adapts seamlessly across massive LED displays and printed banners.",
      approach: "Vector parametric formulas generating unique geometric icons for every participant ticket.",
      outcome: "3,500 tickets sold out, campaign reached 1.2M impressions across digital design channels.",
      coverImage: artwork5.url,
      gallery: JSON.stringify([artwork5.url]),
      tools: JSON.stringify(["TouchDesigner", "Illustrator", "After Effects"]),
      tags: JSON.stringify(["Generative", "Identity", "Event"]),
      credits: "Art Direction: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 5,
    },
    {
      title: "NEURAL FORMS",
      slug: "neural-forms",
      category: "ILLUSTRATION",
      year: "2025",
      client: "Personal Project",
      description: "Vector exploration of algorithmic typography, organic geometry, and dark surface aesthetics.",
      overview: "Personal visual archive exploring the boundary between machine precision and human graphic design intuition.",
      challenge: "Maintaining organic warmth inside strict dark vector geometry.",
      approach: "Iterative hand-drawn vector paths combined with precision grid snapping.",
      outcome: "Exhibited at Berlin Digital Art Archive 2025.",
      coverImage: artwork6.url,
      gallery: JSON.stringify([artwork6.url]),
      tools: JSON.stringify(["Illustrator", "Photoshop"]),
      tags: JSON.stringify(["Illustration", "Grid", "Digital Art"]),
      credits: "Design: Muhammed Shibili",
      featured: true,
      published: true,
      sortOrder: 6,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.create({ data: proj });
  }

  // Seed Stories
  const storiesData = [
    {
      title: "THE MAKING OF A BRAND IDENTITY SYSTEM",
      slug: "making-of-a-brand-identity-system",
      excerpt: "How grid structures, high contrast typography, and restrained accent palettes form timeless visual systems.",
      content: `
# The Architecture of Modern Brand Systems

Graphic design is not decoration; it is communication. When building visual systems for modern brands, the fundamental goal is clarity of intention.

## 01. Grid as Structure
Without a rigid grid, visual design quickly degrades into arbitrary placement. A fine line grid establishes rhythm, proportion, and visual hierarchy.

> "Order produces freedom. When the underlying grid is absolute, typography can breathe."

## 02. The Restraint of Color
In a world saturated with chaotic gradients and noisy backgrounds, high-contrast dark visual systems stand out through confidence and intention.

A neutral dark surface (#0A0A0A) paired with clean off-white typography (#F5F5F5) and a single sharp accent (#C8FF3D) directs user attention to the artwork itself.
      `,
      category: "Process",
      coverImage: artwork1.url,
      featured: true,
      published: true,
    },
    {
      title: "FROM SKETCH TO POSTER: TYPOGRAPHIC RHYTHM",
      slug: "from-sketch-to-poster",
      excerpt: "A breakdown of designing high-impact editorial posters with Space Grotesk and asymmetric layouts.",
      content: `
# Crafting Typographic Posters

Poster design is pure graphic design. It requires compressing an entire visual philosophy into a single frame.

## The Asymmetric Balance
Equilateral balance can often feel static. By placing heavy display letterforms off-center and counter-balancing them with compact 12px tracking metadata, the poster gains kinetic tension.
      `,
      category: "Design Process",
      coverImage: artwork2.url,
      featured: false,
      published: true,
    },
    {
      title: "WHY VISUAL SYSTEMS MATTER MORE THAN LOGOS",
      slug: "why-visual-systems-matter",
      excerpt: "A logo is only a signature. A visual system is the voice, rhythm, and structural grid of a brand.",
      content: `
# Beyond the Logo

Clients often request a logo, but what they truly require is a comprehensive visual system.

A system defines:
1. Spatial relationships and margins
2. Typographic hierarchy
3. Motion signatures
4. Editorial image treatments
      `,
      category: "Opinion",
      coverImage: artwork4.url,
      featured: false,
      published: true,
    },
  ];

  for (const story of storiesData) {
    await prisma.story.create({ data: story });
  }

  // Seed Media Library Entries
  const mediaItems = [
    { filename: "nss-rentals-cover.webp", url: artwork1.url, thumbnailUrl: artwork1.thumbUrl, width: 1200, height: 1500, blurDataUrl: artwork1.blurUrl, altText: "NSS Rentals Cover" },
    { filename: "aura-kinetics-cover.webp", url: artwork2.url, thumbnailUrl: artwork2.thumbUrl, width: 1200, height: 1500, blurDataUrl: artwork2.blurUrl, altText: "Aura Kinetics Cover" },
    { filename: "monolith-records-cover.webp", url: artwork3.url, thumbnailUrl: artwork3.thumbUrl, width: 1200, height: 1500, blurDataUrl: artwork3.blurUrl, altText: "Monolith Records Cover" },
    { filename: "synthesis-mag-cover.webp", url: artwork4.url, thumbnailUrl: artwork4.thumbUrl, width: 1200, height: 1500, blurDataUrl: artwork4.blurUrl, altText: "Synthesis Mag Cover" },
  ];

  for (const med of mediaItems) {
    await prisma.media.create({ data: med });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
