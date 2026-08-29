"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/client";

const defaultFooterLinks = {
  tools: [
    { href: "/pinterest-video-downloader", label: "Video Downloader" },
    { href: "/pinterest-image-downloader", label: "Image Downloader" },
    { href: "/pinterest-gif-downloader", label: "GIF Downloader" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const [footerLinks, setFooterLinks] = useState(defaultFooterLinks);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("navigation")
      .select("menu_name, label, url, sort_order")
      .eq("is_active", true)
      .in("menu_name", ["footer_tools", "footer_company", "footer_legal"])
      .order("sort_order")
      .then(({ data }: { data: any }) => {
        if (data && data.length > 0) {
          const grouped: typeof defaultFooterLinks = { tools: [], company: [], legal: [] };
          data.forEach((item: any) => {
            const key = item.menu_name.replace("footer_", "") as keyof typeof grouped;
            if (key in grouped) {
              grouped[key].push({ href: item.url, label: item.label });
            }
          });
          // Only update if we got data for each group
          if (grouped.tools.length > 0 || grouped.company.length > 0 || grouped.legal.length > 0) {
            setFooterLinks(grouped);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t bg-white dark:bg-surface-950 dark:border-surface-800">
      <Container>
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-bold text-xl text-surface-900 dark:text-white"
            >
              <span className="text-brand-600">Save</span>Pin
            </Link>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              Simple, fast Pinterest media tools. Download videos, images, and
              GIFs from public Pinterest content.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
              Tools
            </h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-surface-200 dark:border-surface-800">
          <p className="text-center text-sm text-surface-400 dark:text-surface-500">
            © {new Date().getFullYear()} SavePin. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
