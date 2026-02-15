"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    image: "/images (5).webp",
    span: "col-span-2 row-span-2", // Large
  },
  {
    image: "/images.webp",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images (1).webp",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images (2).webp",
    span: "col-span-1 row-span-2", // Tall
  },
  {
    image: "/images (3).webp",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images (4).webp",
    span: "col-span-2 row-span-1", // Wide
  },
  {
    image: "/images (5).webp",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images (6).webp",
    span: "col-span-1 row-span-2", // Tall
  },
  {
    image: "/images (7).webp",
    span: "col-span-2 row-span-1", // Wide
  },
  {
    image: "/images.webp",
    span: "col-span-1 row-span-1", // Small
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="courses" className="relative bg-white py-20 md:py-32">
      <div className="px-4 md:px-12 lg:px-20">
        {/* Section Title */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-lg text-green-700 max-w-2xl">
            Learn from expert-curated courses powered by AI tutoring
          </p>
        </div>
        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-7xl mx-auto auto-rows-[180px] md:auto-rows-[220px]">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:border-green-400 transition-all ${feature.span}`}
            >
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={`Course preview ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
