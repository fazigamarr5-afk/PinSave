"use client";

import Link from "next/link";
import { useEffect } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/pinterest-video-downloader", label: "Video Downloader" },
  { href: "/pinterest-image-downloader", label: "Image Downloader" },
  { href: "/pinterest-gif-downloader", label: "GIF Downloader" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  // Lock body scroll when open
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white dark:bg-surface-900 shadow-xl md:hidden animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <span className="font-bold text-lg text-surface-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-800 transition-colors"
            aria-label="Close menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors dark:text-surface-300 dark:hover:text-white dark:hover:bg-surface-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
