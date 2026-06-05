import type { Metadata } from "next";
import HomePageClient from "@/src/components/HomePageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const metadata: Metadata = {
  title:
    "Rental Mobil Depok & Jabodetabek untuk Perjalanan di Jawa | Trans Kudamas 88",
  description:
    "Trans Kudamas 88 melayani rental mobil dengan sopir dari Depok dan Jabodetabek untuk perjalanan bisnis, keluarga, bandara, hingga luar kota ke berbagai kota besar di Pulau Jawa.",
  alternates: {
    canonical: API_URL,
  },
  openGraph: {
    title:
      "Rental Mobil Depok & Jabodetabek untuk Perjalanan di Jawa | Trans Kudamas 88",
    description:
      "Layanan rental mobil dengan sopir dari Depok dan Jabodetabek untuk perjalanan bisnis, keluarga, bandara, dan luar kota ke berbagai kota besar di Pulau Jawa.",
    url: API_URL,
    siteName: "Trans Kudamas 88",
    type: "website",
  },
};

export default function Page() {
  return <HomePageClient />;
}