"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const defaultNavLinks = [
  { href: "/pinterest-video-downloader", label: "Video Downloader" },
  { href: "/pinterest-image-downloader", label: "Image Downloader" },
  { href: "/pinterest-gif-downloader", label: "GIF Downloader" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [navLinks, setNavLinks] = useState(defaultNavLinks);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="absolute inset-y-0 right-0 w-72 bg-white dark:bg-surface-900 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <span className="font-bold text-lg text-surface-900 dark:text-white">Menu</span>
          <button onClick={onClose} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800" aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={onClose} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg dark:text-surface-300 dark:hover:bg-surface-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
