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
  const [isDark, setIsDark] = useState(false);

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

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

  const panelBg = isDark ? "#0f172a" : "#ffffff";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 md:hidden"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-72 shadow-xl md:hidden overflow-y-auto"
        style={{ backgroundColor: panelBg }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
          <span className="font-bold text-lg" style={{ color: textColor }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                  className="block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: isDark ? "#cbd5e1" : "#334155",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? "#1e293b" : "#f1f5f9";
                    e.currentTarget.style.color = isDark ? "#ffffff" : "#0f172a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isDark ? "#cbd5e1" : "#334155";
                  }}
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
