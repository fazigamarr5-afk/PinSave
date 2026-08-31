import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pinterest Downloader — Download Videos, Images & GIFs Free | SavePin",
    template: "%s | SavePin",
  },
  description: "Free Pinterest downloader — save videos, images, and GIFs in HD. No watermark, no login. Works on iPhone, Android, and PC. Download now.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SavePin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SavePin — Pinterest Video, Image & GIF Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msvalidate.01" content="6CD1E87042E9108DADB9E9310EB31FF3" />
        <meta name="google-site-verification" content="EbCriVqK5qRlkviTmEPfu1eVhFKTpD1Qhml6hrGfOoM" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
