"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroCarousel } from "@/src/components/HeroSection";
import { MobilCarouselAPI } from "@/src/components/mobilSection";

import {
  Shield,
  Award,
  Clock,
  Briefcase,
  Users,
  Calendar,
  Route,
  Plane,
} from "lucide-react";

export default function HomePageClient() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="hero-carousel-section relative w-full max-w-full overflow-hidden">
        <HeroCarousel />
      </section>

      {/* TENTANG */}
      <section
        id="tentang"
        className="py-14 md:py-20 px-4 sm:px-6 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
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
                  alt="Rental mobil Trans Kudamas 88 dengan sopir dari Depok dan Jabodetabek"
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
                  Rental Mobil Depok & Jabodetabek untuk Perjalanan di Pulau Jawa
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Trans Kudamas 88 melayani rental mobil dengan sopir dari Depok
                  dan Jabodetabek untuk perjalanan bisnis, keluarga, bandara,
                  hingga perjalanan luar kota ke berbagai kota besar di Pulau
                  Jawa. Dengan armada terawat dan sopir berpengalaman, kami
                  mendukung perjalanan Anda secara aman, nyaman, dan profesional.
                </p>

                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white rounded-lg hover:bg-gold/90 transition-all hover:shadow-xl tracking-wide"
                >
                  Lihat Selengkapnya
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOPIR */}
      <section className="sopir-section relative overflow-hidden py-14 md:py-20 px-4 sm:px-6 bg-gray-50">
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
                  Setiap perjalanan rental mobil Trans Kudamas 88 dilayani oleh
                  sopir berpengalaman untuk kebutuhan perjalanan harian, bandara,
                  bisnis, keluarga, dan luar kota dari Depok atau Jabodetabek.
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
                      Sopir profesional dengan standar pelayanan dan sertifikasi
                      resmi.
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
                      Menguasai berbagai rute perjalanan dengan pelayanan yang
                      ramah dan profesional.
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
                      Seluruh layanan disertai sopir untuk memastikan
                      kenyamanan dan keamanan perjalanan.
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[260px] h-[260px] md:w-[500px] md:h-[500px] rounded-full bg-gold/10 blur-3xl" />
              </div>

              <div className="relative z-10 w-full max-w-[560px] overflow-visible pt-4 md:pt-6 pb-10 md:pb-16">
                <div className="absolute inset-x-0 top-14 bottom-10 rounded-[40px] border border-border/50 bg-gradient-to-br from-[#F8F8F8] to-[#ECECEC] shadow-[0_25px_70px_rgba(0,0,0,0.08)]" />

                <div className="absolute top-6 right-10 w-24 h-24 rounded-full border border-gold/10" />

                <div className="relative z-20 flex justify-center">
                  <motion.img
                    src="/imports/gambardriver.png"
                    alt="Sopir profesional Trans Kudamas 88 untuk rental mobil dengan sopir"
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

                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 bottom-0 md:bottom-5 z-30 rounded-[28px] md:rounded-[34px] bg-white px-5 md:px-6 py-4 md:py-5 shadow-[0_20px_45px_rgba(0,0,0,0.12)] w-[calc(100%-2rem)] max-w-[360px] md:w-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                  }}
                >
                  <p className="text-sm text-gold mb-1">Sopir Profesional</p>

                  <p className="text-3xl md:text-3xl leading-[1.2] font-semibold tracking-tight text-primary">
                    Pelayanan Aman & Nyaman
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MOBIL */}
      <section className="fleet-section relative py-14 px-6 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

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
              Pilihan Kendaraan Lengkap Sesuai Kebutuhan Perjalanan Anda
            </motion.h2>
          </div>

          <MobilCarouselAPI />
        </div>
      </section>

      {/* LAYANAN KAMI */}
      <section className="services-section py-14 md:py-20 px-4 sm:px-6 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 text-primary">
              Layanan Kami
            </h2>

            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Layanan rental mobil dengan sopir untuk kebutuhan perjalanan dari
              Depok dan Jabodetabek ke berbagai kota besar di Pulau Jawa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Briefcase,
                title: "Perjalanan Bisnis",
                desc: "Transportasi untuk meeting, kunjungan kerja, dan kebutuhan operasional perusahaan.",
              },
              {
                icon: Users,
                title: "Perjalanan Keluarga",
                desc: "Layanan untuk liburan keluarga, acara pribadi, dan kebutuhan mobilitas harian.",
              },
              {
                icon: Calendar,
                title: "Transportasi Acara",
                desc: "Armada untuk pernikahan, gathering, seminar, dan perjalanan rombongan.",
              },
              {
                icon: Plane,
                title: "Antar-Jemput Bandara",
                desc: "Penjemputan dan pengantaran bandara dengan jadwal yang lebih terencana.",
              },
              {
                icon: Clock,
                title: "Sewa Harian",
                desc: "Layanan kendaraan dengan sopir untuk kebutuhan transportasi dalam satu hari.",
              },
              {
                icon: Route,
                title: "Perjalanan Luar Kota",
                desc: "Perjalanan antar kota di Pulau Jawa dengan sopir berpengalaman dan armada nyaman.",
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(201, 166, 104, 0.15)",
                }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm group"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-gold" />
                </div>

                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 tracking-tight">
                  {service.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}