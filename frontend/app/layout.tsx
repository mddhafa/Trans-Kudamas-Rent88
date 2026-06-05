import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AppShell } from "@/src/components/AppShell";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = "https://www.transkudamas88.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rental Mobil di Kota Besar Pulau Jawa | Trans Kudamas 88",
    template: "%s | Trans Kudamas 88",
  },

  description:
    "Trans Kudamas 88 melayani rental mobil di berbagai kota besar Pulau Jawa, termasuk Jabodetabek, Bandung, Cirebon, Semarang, Yogyakarta, Solo, Surabaya, Malang, hingga Banyuwangi. Dengan armada terawat dan pelayanan profesional, kami mendukung perjalanan bisnis, keluarga, bandara, hingga kebutuhan luar kota secara aman dan nyaman.",

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      {
        url: "/imports/logofix.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/imports/logofix.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/imports/logofix.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Rental Mobil di Kota Besar Pulau Jawa | Trans Kudamas 88",
    description:
      "Trans Kudamas 88 melayani rental mobil di berbagai kota besar Pulau Jawa, termasuk Jabodetabek, Bandung, Cirebon, Semarang, Yogyakarta, Solo, Surabaya, Malang, hingga Banyuwangi.",
    url: SITE_URL,
    siteName: "Trans Kudamas 88",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/imports/logofix.png`,
        width: 512,
        height: 512,
        alt: "Logo Trans Kudamas 88",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Rental Mobil di Kota Besar Pulau Jawa | Trans Kudamas 88",
    description:
      "Trans Kudamas 88 melayani rental mobil di berbagai kota besar Pulau Jawa, termasuk Jabodetabek, Bandung, Cirebon, Semarang, Yogyakarta, Solo, Surabaya, Malang, hingga Banyuwangi.",
    images: [`${SITE_URL}/imports/logofix.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}