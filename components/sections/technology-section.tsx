"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Slower animation - more viewport range
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;
      
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");
  
  return (
    <p
      ref={containerRef}
      className="text-3xl font-semibold leading-snug text-green-100 md:text-4xl lg:text-5xl"
    >
      {words.map((word, index) => {
        // Calculate blur and opacity based on scroll progress
        const appearProgress = progress * (words.length + 1);
        const wordAppearProgress = Math.max(0, Math.min(1, appearProgress - index));
        const wordOpacity = wordAppearProgress;
        const wordBlur = (1 - wordAppearProgress) * 40;
        
        return (
          <span
            key={index}
            className="inline-block"
            style={{
              opacity: wordOpacity,
              filter: `blur(${wordBlur}px)`,
              transition: 'opacity 0.1s linear, filter 0.1s linear',
              marginRight: '0.3em',
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}

const sideImages = [
  {
    src: "/images (6).webp",
    alt: "Books and learning",
    position: "left",
  },
  {
    src: "/images (7).webp",
    alt: "Educational resources",
    position: "right",
  },
];

const textCycles = [
  "AI-Powered Learning.",
  "Real-Time Feedback.",
  "Adaptive Difficulty.",
];

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  
  const descriptionText = "Our proprietary AI engine understands learning patterns and adjusts teaching methods in real-time. Instant feedback keeps you engaged while the difficulty adapts to your progress, ensuring optimal challenge balance. Every lesson is personalized, making complex concepts accessible and retention higher.";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 4; // Increased for 3 text cycles
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);

      // Text scroll progress
      if (textSectionRef.current) {
        const textRect = textSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const startOffset = windowHeight * 0.9;
        const endOffset = windowHeight * 0.1;
        
        const totalDistance = startOffset - endOffset;
        const currentPosition = startOffset - textRect.top;
        
        const newTextProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
        setTextProgress(newTextProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Title fades out first (0 to 0.2)
  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  
  // Image transforms start after title fades (0.2 to 1)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 58); // 100% to 42%
  const centerHeight = 100 - (imageProgress * 30); // 100% to 70%
  const sideWidth = imageProgress * 22; // 0% to 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const gap = imageProgress * 16; // 0px to 16px

  // Calculate grayscale for text section based on textProgress
  const grayscaleAmount = Math.round((1 - textProgress) * 100);

  return (
    <section ref={sectionRef} className="relative bg-green-900">
      {/* Sticky container for scroll animation */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          {/* Bento Grid Container */}
          <div 
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}
          >
            
            {/* Left Column */}
            <div 
              className="relative overflow-hidden will-change-transform bg-green-800"
              style={{
                width: `${sideWidth}%`,
                height: "100%",
                transform: `translateX(${sideTranslateLeft}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover opacity-70"
                />
              ))}
            </div>

            {/* Main Center Image */}
            <div 
              className="relative overflow-hidden will-change-transform bg-green-800"
              style={{
                width: `${centerWidth}%`,
                height: "100%",
                flex: "0 0 auto",
              }}
            >
              {/* Layered Images - Progressive Fade In */}
              <Image
                src="/images.webp"
                alt="Learning platform interface"
                fill
                className="object-cover opacity-40"
                style={{
                  opacity: scrollProgress < 0.25 ? 0.4 : 0.4,
                }}
              />
              
              <Image
                src="/images (1).webp"
                alt="AI tutor interface"
                fill
                className="absolute inset-0 object-cover opacity-40"
                style={{
                  opacity: Math.max(0, Math.min(0.4, (scrollProgress - 0.1) / 0.2)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              <Image
                src="/images (2).webp"
                alt="Student progress dashboard"
                fill
                className="absolute inset-0 object-cover opacity-40"
                style={{
                  opacity: Math.max(0, Math.min(0.4, (scrollProgress - 0.4) / 0.2)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              <Image
                src="/images (3).webp"
                alt="Learning achievements"
                fill
                className="absolute inset-0 object-cover opacity-40"
                style={{
                  opacity: Math.max(0, Math.min(0.4, (scrollProgress - 0.7) / 0.2)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-900/60 to-green-950" />
              
              {/* Title Text - Cycles through 3 texts with blur effect */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              >
                {textCycles.map((text, cycleIndex) => {
                  // Each text cycle takes 1/3 of the scroll progress
                  const cycleStart = cycleIndex / textCycles.length;
                  const cycleEnd = (cycleIndex + 1) / textCycles.length;
                  const cycleMid = (cycleStart + cycleEnd) / 2;
                  
                  const words = text.split(" ");
                  
                  return (
                    <h2 
                      key={cycleIndex}
                      className="absolute max-w-3xl font-bold leading-tight tracking-tight text-green-100 md:text-5xl lg:text-7xl text-5xl"
                    >
                      {words.map((word, wordIndex) => {
                        let wordOpacity = 0;
                        let wordBlur = 40;
                        
                        if (scrollProgress >= cycleStart && scrollProgress < cycleEnd) {
                          const localProgress = (scrollProgress - cycleStart) / (cycleEnd - cycleStart);
                          
                          // First half: appear (blur 40→0, opacity 0→1)
                          if (localProgress < 0.5) {
                            const appearProgress = (localProgress / 0.5) * (words.length + 1);
                            const wordAppearProgress = Math.max(0, Math.min(1, appearProgress - wordIndex));
                            wordOpacity = wordAppearProgress;
                            wordBlur = (1 - wordAppearProgress) * 40;
                          } 
                          // Second half: disappear (blur 0→40, opacity 1→0)
                          else {
                            const disappearProgress = ((localProgress - 0.5) / 0.5) * (words.length + 1);
                            const wordDisappearProgress = Math.max(0, Math.min(1, disappearProgress - wordIndex));
                            wordOpacity = 1 - wordDisappearProgress;
                            wordBlur = wordDisappearProgress * 40;
                          }
                        }
                        
                        return (
                          <span
                            key={wordIndex}
                            className="inline-block"
                            style={{
                              opacity: wordOpacity,
                              filter: `blur(${wordBlur}px)`,
                              transition: 'opacity 0.1s linear, filter 0.1s linear',
                              marginRight: '0.3em',
                            }}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </h2>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="relative overflow-hidden will-change-transform bg-green-800"
              style={{
                width: `${sideWidth}%`,
                height: "100%",
                transform: `translateX(${sideTranslateRight}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover opacity-70"
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll space to enable animation - increased for 3 text cycles */}
      <div className="h-[400vh]" />

      {/* Description Section with Background Image and Scroll Reveal */}
      <div 
        ref={textSectionRef}
        className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40 bg-green-950"
      >
        {/* Gradient Overlay - Top to transparent */}
        <div 
          className="absolute top-0 left-0 right-0 z-0 pointer-events-none"
          style={{
            height: '150px',
            background: 'linear-gradient(to bottom, rgba(5, 46, 22, 1) 0%, rgba(5, 46, 22, 0) 100%)'
          }}
        />

        {/* Text Content */}
        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollRevealText text={descriptionText} />
        </div>
      </div>
    </section>
  );
}
