"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeroCarousel } from "@/src/components/HeroSection";
import { MobilCarouselAPI } from "@/src/components/mobilSection";
import Link from "next/link";

import {
  Shield,
  Award,
  Clock,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

interface Foto {
  id: number;
  url: string;
}

interface Mobil {
  id: number;
  nama: string;
  deskripsi: string;
  fotos: Foto[];
}

export default function HomePage() {
  const [mobilList, setMobilList] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMobil = async () => {
      try {
        const res = await fetch(`${API_URL}/mobil?t=${Date.now()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setMobilList(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMobil();
  }, []);

  // const testimonials = [
  //   {
  //     name: "Budi Santoso",
  //     role: "CEO PT Maju Jaya",
  //     content:
  //       "Pelayanan sangat profesional dan armada bersih.",
  //   },
  //   {
  //     name: "Siti Rahma",
  //     role: "Traveler",
  //     content:
  //       "Nyaman untuk perjalanan keluarga dan sopir ramah.",
  //   },
  //   {
  //     name: "Ahmad Rizki",
  //     role: "Event Organizer",
  //     content:
  //       "Selalu tepat waktu untuk kebutuhan event kami.",
  //   },
  // ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="hero-carousel-section relative w-full overflow-hidden">
      <HeroCarousel />
      </section>

      <section
        id="tentang"
        className="py-20 px-6 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/imports/sekilaskami1.png"
                  alt="AGIL RENT - Professional Transportation Service"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl tracking-tight leading-tight mb-6 text-primary">
                  Mitra Perjalanan Terpercaya Anda
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Trans Kudamas 88 adalah penyedia layanan
                  rental mobil profesional dengan armada premium
                  yang terawat dan sopir berpengalaman. Kami
                  hadir sebagai solusi transportasi terpercaya
                  untuk kebutuhan bisnis dan keluarga Anda di
                  berbagai Kota Besar di Pulau Jawa.
                </p>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white rounded-lg hover:bg-gold/90 transition-all hover:shadow-xl tracking-wide"
                >
                  Lihat Selengkapnya
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="sopir-section py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl tracking-tight leading-tight mb-6 text-primary">
                  Pelayanan Prima
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Setiap perjalanan dilayani oleh sopir
                  berpengalaman dan berlisensi untuk kenyamanan
                  dan keamanan Anda
                </p>
              </div>

             <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background p-4 md:p-5 shadow-sm">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>

                  <div>
                    <h3 className="font-medium mb-1 text-primary">
                      Berlisensi & Terlatih
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sopir profesional dengan standar pelayanan
                      dan sertifikasi resmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background p-4 md:p-5 shadow-sm">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-gold" />
                  </div>

                  <div>
                    <h3 className="font-medium mb-1 text-primary">
                      Berpengalaman
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Menguasai berbagai rute perjalanan dengan
                      pelayanan yang ramah dan profesional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background p-4 md:p-5 shadow-sm">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>

                  <div>
                    <h3 className="font-medium mb-1 text-primary">
                      Tidak Lepas Kunci
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Seluruh layanan disertai sopir untuk
                      memastikan kenyamanan dan keamanan
                      perjalanan.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl" />
              </div>

              {/* Main Wrapper */}
              <div className="relative z-10 w-full max-w-[560px] pt-4 md:pt-6 pb-10 md:pb-16">
                {/* Background Card */}
                <div className="absolute inset-x-0 top-14 bottom-10 rounded-[40px] border border-border/50 bg-gradient-to-br from-[#F8F8F8] to-[#ECECEC] shadow-[0_25px_70px_rgba(0,0,0,0.08)]" />

                {/* Decorative Accent */}
                <div className="absolute top-6 right-10 w-24 h-24 rounded-full border border-gold/10" />

                {/* Driver Image */}
                <div className="relative z-20 flex justify-center">
                  <motion.img
                    src="imports/gambardriver.png"
                    alt="Sopir Profesional"
                    className="w-full max-w-[430px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.14)]"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {/* Floating Card */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 bottom-0 md:bottom-5 z-30 rounded-[28px] md:rounded-[34px] bg-white px-5 md:px-6 py-4 md:py-5 shadow-[0_20px_45px_rgba(0,0,0,0.12)] w-[90%] md:w-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                  }}
                >
                  <p className="text-sm text-gold mb-1">
                    Sopir Profesional
                  </p>

                  <p className="text-2xl md:text-3xl leading-[1.2] font-semibold tracking-tight text-primary">
                    Pelayanan Aman & Nyaman
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Sopir Profesional",
              desc: "Berlisensi dan berpengalaman",
            },
            {
              icon: Award,
              title: "Armada Premium",
              desc: "Selalu terawat dan bersih",
            },
            {
              icon: Clock,
              title: "Tepat Waktu",
              desc: "Siap melayani 24 jam",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <item.icon className="w-10 h-10 text-yellow-500 mb-6" />

              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MOBIL */}

      <section className="fleet-section relative py-14 px-6 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <motion.div
              className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm text-gold uppercase tracking-widest">
                Tipe Mobil
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl tracking-tight leading-none text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Pilihan Kendaraan Lengkap Sesuai Dengan Kebutuhan Anda
            </motion.h2>
          </div>

          <MobilCarouselAPI />
        </div>
      </section>

      {/* <section
        id="mobil"
        className="py-24 px-6 bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 border border-yellow-500/30 rounded-full mb-4">
              <span className="text-yellow-500 text-sm uppercase tracking-[0.2em]">
                Armada Kami
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Pilih Kendaraan Anda
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto">
              Semua kendaraan kami dalam kondisi prima
              dan siap digunakan kapan saja.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-zinc-800" />
                  <div className="p-6">
                    <div className="h-6 bg-zinc-800 rounded mb-4" />
                    <div className="h-4 bg-zinc-800 rounded mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {mobilList.map((mobil) => (
                <motion.div
                  key={mobil.id}
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        mobil.fotos?.[0]
                          ? `${API_URL}/${mobil.fotos[0].url}`
                          : "https://placehold.co/600x400"
                      }
                      alt={mobil.nama}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3">
                      {mobil.nama}
                    </h3>

                    <p className="text-zinc-400 mb-6 line-clamp-2">
                      {mobil.deskripsi}
                    </p>

                    <a
                      href={`/pesan?mobilId=${mobil.id}`}
                      className="inline-flex items-center gap-2 text-yellow-500 hover:gap-4 transition-all"
                    >
                      Pesan Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section> */}



      {/* TESTIMONIAL */}
      {/* <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 border border-yellow-500/30 rounded-full mb-4">
              <span className="text-yellow-500 text-sm uppercase tracking-[0.2em]">
                Testimoni
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Apa Kata Mereka
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm relative"
              >
                <Quote className="absolute top-6 right-6 text-yellow-500/10 w-12 h-12" />

                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-6">
                  "{item.content}"
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    {item.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      
    </div>
  );
}