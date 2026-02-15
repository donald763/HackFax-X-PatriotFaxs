"use client";

import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "Courses", href: "#courses" },
    { label: "Features", href: "#features" },
    { label: "Gallery", href: "#gallery" },
  ],
  about: [
    { label: "Our Story", href: "#" },
    { label: "Team", href: "#" },
    { label: "Research", href: "#" },
    { label: "Contact", href: "#" },
  ],
  service: [
    { label: "FAQ", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-green-950">
      {/* Main Footer Content */}
      <div className="border-t border-green-900 px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="#hero" className="text-lg font-bold text-green-50">
              CoursAI
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-green-200">
              AI-powered personalized learning platform helping students master any subject with adaptive intelligence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-green-100">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-300 transition-colors hover:text-green-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-green-100">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-300 transition-colors hover:text-green-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-green-100">Service</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-300 transition-colors hover:text-green-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-900 px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-green-300">
            © 2026 CoursAI. All rights reserved.
          </p>

          

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-green-300 transition-colors hover:text-green-100"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-xs text-green-300 transition-colors hover:text-green-100"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-xs text-green-300 transition-colors hover:text-green-100"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
