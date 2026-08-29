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
    default: "SavePin — Pinterest Video, Image & GIF Downloader",
    template: "%s | SavePin",
  },
  description:
    "Download Pinterest videos, images, and GIFs. Free, simple, and fast Pinterest media downloader — no account required.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SavePin",
  },
  twitter: {
    card: "summary_large_image",
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
