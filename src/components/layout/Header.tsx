"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { createClient } from "@/lib/supabase/client";

const defaultNavLinks = [
  { href: "/pinterest-video-downloader", label: "Video" },
  { href: "/pinterest-image-downloader", label: "Image" },
  { href: "/pinterest-gif-downloader", label: "GIF" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(defaultNavLinks);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("navigation")
      .select("label, url, sort_order")
      .eq("menu_name", "header")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }: { data: any }) => {
        if (data && data.length > 0) {
          setNavLinks(data.map((item: any) => ({ href: item.url, label: item.label })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-surface-950/80 dark:border-surface-800">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-surface-900 dark:text-white"
          >
            <img src="/logo.svg" alt="SavePin" className="w-8 h-8" />
            <span><span className="text-brand-600">Save</span>Pin</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-800 transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
