import type { Metadata } from "next";
import HomePageClient from "@/src/components/HomePageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const metadata: Metadata = {
  title:
    "Rental Mobil di Kota Besar Pulau Jawa | Trans Kudamas 88",
  description:
    "Trans Kudamas 88 melayani rental mobil dengan sopir di berbagai kota besar Pulau Jawa, Jabodetabek, Bandung, Cirebon, Semarang, Yogyakarta, Solo, Surabaya, Malang, hingga Banyuwangi. Dengan armada terawat dan sopir berpengalaman, kami mendukung perjalanan bisnis, keluarga, bandara, hingga kebutuhan luar kota secara aman dan nyaman.",
  alternates: {
    canonical: API_URL,
  },
  openGraph: {
    title:
      "Rental Mobil di Kota Besar Pulau Jawa | Trans Kudamas 88",
    description:
      "Trans Kudamas 88 melayani rental mobil dengan sopir di berbagai kota besar Pulau Jawa, Jabodetabek, Bandung, Cirebon, Semarang, Yogyakarta, Solo, Surabaya, Malang, hingga Banyuwangi. Dengan armada terawat dan sopir berpengalaman, kami mendukung perjalanan bisnis, keluarga, bandara, hingga kebutuhan luar kota secara aman dan nyaman.",
    url: API_URL,
    siteName: "Trans Kudamas 88",
    type: "website",
  },
};

export default function Page() {
  return <HomePageClient />;
}