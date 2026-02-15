"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const specs = [
  { label: "Active Learners", value: "50K+" },
  { label: "Courses Available", value: "500+" },
  { label: "Avg. Score Improvement", value: "34%" },
  { label: "Learning Satisfaction", value: "98%" },
];

export function EditorialSection() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const updateParallax = useCallback(() => {
    if (!videoRef.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate when video enters and exits viewport
    const videoTop = rect.top;
    const videoBottom = rect.bottom;
    
    // Progress from 0 (entering viewport) to 1 (exiting viewport)
    if (videoBottom > 0 && videoTop < windowHeight) {
      const progress = 1 - (videoTop + rect.height / 2) / (windowHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateParallax();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateParallax]);

  // Parallax effect: video moves up as you scroll down
  const parallaxY = (scrollProgress - 0.5) * 30; // -15px to +15px range

  return (
    <section className="bg-white">
      {/* Newsletter Banner */}
      

      {/* Decorative Icons */}
      <div className="flex items-center justify-center gap-6 pb-20">
        
        
      </div>

      {/* Full-width Video with Parallax */}
      <div ref={videoRef} className="relative aspect-[16/9] w-full md:aspect-[21/9] overflow-hidden rounded-2xl mx-4 md:mx-8 bg-green-100">
        <Image
          src="/images.webp"
          alt="Learning platform showcase"
          fill
          className="object-cover"
          style={{
            transform: `scale(1.15) translate3d(0, ${parallaxY}px, 0) translateZ(0)`,
            WebkitTransform: `scale(1.15) translate3d(0, ${parallaxY}px, 0) translateZ(0)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 border-t border-green-200 md:grid-cols-4 mt-12 md:mt-16">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-b border-r border-green-200 p-8 text-center last:border-r-0 md:border-b-0 hover:bg-green-50 transition-colors"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-green-700 font-semibold">
              {spec.label}
            </p>
            <p className="font-bold text-green-900 text-5xl">
              {spec.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
