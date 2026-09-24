"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ServiceItem {
  id: string;
  number: string;
  name: string;
  description: string;
  previewImage: string;
}

const servicesData: ServiceItem[] = [
  {
    id: "1",
    number: "01",
    name: "BRAND IDENTITY",
    description: "Complete visual systems, logo marks, brand guidelines, and spatial identity.",
    previewImage: "/uploads/nss-rentals-cover.webp",
  },
  {
    id: "2",
    number: "02",
    name: "POSTER DESIGN",
    description: "Typographic, editorial, and kinetic poster series for cultural events.",
    previewImage: "/uploads/aura-kinetics-cover.webp",
  },
  {
    id: "3",
    number: "03",
    name: "CAMPAIGN DESIGN",
    description: "360-degree brand launch campaigns across print and digital channels.",
    previewImage: "/uploads/solaris-cover.webp",
  },
  {
    id: "4",
    number: "04",
    name: "SOCIAL MEDIA",
    description: "High-impact social templates, motion assets, and content design systems.",
    previewImage: "/uploads/neural-forms-cover.webp",
  },
  {
    id: "5",
    number: "05",
    name: "EDITORIAL DESIGN",
    description: "Book, magazine, vinyl packaging, and multi-column publication layouts.",
    previewImage: "/uploads/synthesis-mag-cover.webp",
  },
  {
    id: "6",
    number: "06",
    name: "UI / UX DESIGN",
    description: "Dark-themed digital interfaces, web archives, and portfolio systems.",
    previewImage: "/uploads/monolith-records-cover.webp",
  },
  {
    id: "7",
    number: "07",
    name: "ART DIRECTION",
    description: "Creative direction, photography styling, and visual theme architecture.",
    previewImage: "/uploads/nss-detail-1.webp",
  },
  {
    id: "8",
    number: "08",
    name: "MOTION DESIGN",
    description: "Kinetic typography, animated posters, and digital identity movement.",
    previewImage: "/uploads/nss-detail-2.webp",
  },
];

export default function ServicesPreview() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section className="py-28 px-5 md:px-8 max-w-7xl mx-auto border-b border-[#262626] relative">
      <div className="pb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-color,#C8FF3D)] tracking-widest uppercase block mb-2">
            03 // CAPABILITIES
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-[#F5F5F5]">
            SERVICES
          </h2>
        </div>
        <p className="text-xs font-mono tracking-widest text-[#9A9A9A] uppercase max-w-sm">
          Disciplines, visual tools, and design capabilities.
        </p>
      </div>

      {/* Editorial Numbered List */}
      <div className="divide-y divide-[#262626] border-y border-[#262626]">
        {servicesData.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveImage(item.previewImage)}
            onMouseLeave={() => setActiveImage(null)}
            className="group py-6 md:py-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-[#111111] hover:px-6 cursor-pointer"
          >
            <div className="flex items-center gap-6 md:gap-12">
              <span className="font-mono text-sm text-[var(--accent-color,#C8FF3D)] tracking-widest font-bold">
                {item.number}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F5] group-hover:text-[var(--accent-color,#C8FF3D)] transition-colors">
                {item.name}
              </h3>
            </div>

            <p className="text-xs font-mono text-[#9A9A9A] max-w-md group-hover:text-[#F5F5F5] transition-colors">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Image Preview on Hover */}
      {activeImage && (
        <div className="hidden lg:block fixed bottom-12 right-12 z-40 w-72 h-96 bg-[#111111] border border-[var(--accent-color,#C8FF3D)] shadow-2xl overflow-hidden pointer-events-none transition-all duration-300">
          <Image
            src={activeImage}
            alt="Service Preview"
            fill
            sizes="300px"
            className="object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 p-3 bg-[#0A0A0A]/90 text-[10px] font-mono text-[var(--accent-color,#C8FF3D)] uppercase tracking-widest text-center">
            [ SERVICE VISUAL PREVIEW ]
          </div>
        </div>
      )}
    </section>
  );
}
