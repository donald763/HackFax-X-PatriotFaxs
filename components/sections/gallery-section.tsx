"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const images = [
    { src: "/images (5).webp", alt: "Learning journey start" },
    { src: "/images (6).webp", alt: "Building knowledge foundation" },
    { src: "/images (7).webp", alt: "Mastering concepts" },
    { src: "/images.webp", alt: "Achievement unlocked" },
  ];

  const updateTransform = useCallback(() => {
    if (!galleryRef.current) return;
    
    const rect = galleryRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = galleryRef.current.offsetHeight;
    
    // Calculate scroll progress through the section
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransform]);

  const isLastImage = images.length - 1;
  
  // Calculate fullscreen progress for the last image - more gradual
  // Start expanding when last image is 80% stacked, finish at end of section
  const fullscreenStartProgress = 0.6; // Start earlier for smoother transition
  const fullscreenProgress = Math.max(0, Math.min(1, (scrollProgress - fullscreenStartProgress) / (1 - fullscreenStartProgress)));
  
  // Ease out cubic for smoother animation
  const easedFullscreenProgress = 1 - Math.pow(1 - fullscreenProgress, 3);

  return (
    <section 
      id="gallery"
      ref={galleryRef}
      className="relative bg-green-900"
      style={{ minHeight: `${(images.length + 1) * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-4">
        <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh]">
          {images.map((image, index) => {
            const isLast = index === isLastImage;
            
            // Calculate stacking progress for each image
            const imageProgress = (scrollProgress * images.length) - index;
            const stackProgress = Math.max(0, Math.min(1, imageProgress));
            
            // Images start below and move up to stack
            let translateY = (1 - stackProgress) * 100; // 100% to 0%
            let scale = 0.8 + (stackProgress * 0.2); // 0.8 to 1
            let opacity = stackProgress;
            
            // Last image expands to fullscreen smoothly
            if (isLast) {
              // Blend between normal scale and expanded scale
              const normalScale = 0.8 + (stackProgress * 0.2);
              const expandedScale = 1 + (easedFullscreenProgress * 0.8); // 1 to 1.8
              scale = normalScale + (Math.max(0, stackProgress - 0.8) * 5) * (expandedScale - normalScale);
            }
            
            // Calculate z-index so later images appear on top
            const zIndex = index;
            
            // Remove border radius on last image when expanding - gradual transition
            const borderRadius = isLast && easedFullscreenProgress > 0.3 ? (1 - easedFullscreenProgress) * 16 : undefined;
            
            return (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  zIndex,
                  transform: `translate3d(0, ${translateY}%, 0) scale(${scale}) translateZ(0)`,
                  WebkitTransform: `translate3d(0, ${translateY}%, 0) scale(${scale}) translateZ(0)`,
                  opacity,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden rounded-xl md:rounded-2xl border border-green-400"
                  style={{
                    borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
                  }}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index < 3}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
