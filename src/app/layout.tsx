import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectionShield from "@/components/ui/ProtectionShield";
import { db } from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch {
    // Fallback if db isn't initialized yet
  }

  const designerName = settings?.designerName || "MUHAMMED SHIBILI";
  const title = `${designerName} — Graphic Designer & Visual Storyteller`;
  const description = settings?.mainStatement || "Luxury Creative Studio + Editorial Magazine + Digital Art Archive";

  return {
    title,
    description,
    keywords: ["Graphic Design", "Brand Identity", "Posters", "Editorial Design", "Visual Systems", "Muhammed Shibili"],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: designerName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch {
    // Ignore error if loading
  }

  const accentColor = settings?.accentColor || "#C8FF3D";

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root { --accent-color: ${accentColor}; }` }} />
      </head>
      <body className="bg-[#0A0A0A] text-[#F5F5F5] antialiased min-h-screen flex flex-col selection:bg-[#C8FF3D] selection:text-[#0A0A0A] bg-grain">
        <ProtectionShield>
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </ProtectionShield>
      </body>
    </html>
  );
}
