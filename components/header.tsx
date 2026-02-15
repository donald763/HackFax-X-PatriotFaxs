"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md rounded-full border border-green-200" : "bg-transparent"}`}
      style={{
        boxShadow: isScrolled ? "0 10px 30px rgba(34, 197, 94, 0.1)" : "none"
      }}
    >
      <div className="flex items-center justify-between transition-all duration-300 px-2 pl-5 py-2">
        {/* Logo */}
        <Link href="#hero" className="text-lg font-bold tracking-tight transition-colors duration-300 text-green-700">
          CoursAI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="#features"
            className="text-sm transition-colors text-green-700/70 hover:text-green-700"
          >
            Features
          </Link>
          <Link
            href="#courses"
            className="text-sm transition-colors text-green-700/70 hover:text-green-700"
          >
            Courses
          </Link>
          <Link
            href="#pricing"
            className="text-sm transition-colors text-green-700/70 hover:text-green-700"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-sm transition-colors text-green-700/70 hover:text-green-700"
          >
            About
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="/browse"
            className="px-6 py-2 text-sm font-medium transition-all rounded-full bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
          >
            Sign In
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="transition-colors md:hidden text-green-700"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-green-200 bg-white px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <Link
              href="#features"
              className="text-lg text-green-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#courses"
              className="text-lg text-green-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="#pricing"
              className="text-lg text-green-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-lg text-green-700"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <a
              href="/browse"
              className="mt-4 block bg-green-600 px-6 py-3 text-center text-lg font-medium text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
