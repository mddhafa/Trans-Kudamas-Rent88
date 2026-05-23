"use client";

import Link from "next/link";
import { Shield, Award, Clock, Users, CheckCircle, Car } from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="about-header-section relative py-24 px-6 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
              Tentang Kami
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Layanan transportasi profesional dengan komitmen pada kenyamanan, keamanan, dan kepuasan pelanggan
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="about-content-section py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div {...fadeInUp}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/imports/sekilaskami1.png"
                  alt="Professional Transportation Service"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl tracking-tight text-primary leading-tight">
                Mitra Perjalanan Terpercaya Anda
              </h2>
          
              <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  Trans Kudamas 88 adalah penyedia layanan rental mobil profesional yang
                  berkomitmen memberikan pengalaman perjalanan terbaik untuk kebutuhan
                  bisnis dan keluarga Anda. Dengan armada kendaraan premium yang
                  terawat dan sopir profesional berpengalaman, kami hadir sebagai solusi
                  transportasi terpercaya di berbagai kota besar seluruh Pulau Jawa.
                </p>
          
                <p>
                  Kami menyediakan berbagai pilihan kendaraan mulai dari mobil
                  penumpang hingga bus besar dengan fasilitas modern dan kondisi
                  kendaraan yang selalu prima untuk kenyamanan perjalanan Anda.
                </p>
              </div>
          
              <div className="pt-2">
                <Link
                  href="/armada"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gold text-primary rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-wide font-medium"
                >
                  Booking Sekarang
          
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
            </div>
          </motion.div>
          </div>

          {/* Vision & Mission */}
          <motion.div className="grid md:grid-cols-2 gap-8 mb-32" {...fadeInUp}>
            <div className="bg-card rounded-xl border border-border/50 p-8 shadow-lg">
              <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl tracking-tight text-primary mb-4">Visi Kami</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi penyedia layanan transportasi rental yang profesional, terpercaya, dan menjadi pilihan utama bagi masyarakat untuk kebutuhan perjalanan bisnis maupun keluarga.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-8 shadow-lg">
              <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl tracking-tight text-primary mb-4">Misi Kami</h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Menyediakan armada kendaraan premium yang terawat dengan baik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Menjaga kualitas pelayanan dengan standar profesional tinggi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Mengutamakan kenyamanan, keamanan, dan kepuasan pelanggan</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Service Advantages */}
          <motion.div className="mb-32" {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl tracking-tight text-primary mb-4">
                Keunggulan Layanan Kami
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Mengapa memilih AGIL RENT sebagai mitra perjalanan Anda
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: Award, title: "Armada Terawat", desc: "Perawatan rutin dan inspeksi berkala" },
                { icon: Shield, title: "Sopir Profesional", desc: "Berlisensi dan berpengalaman" },
                { icon: Clock, title: "Tepat Waktu", desc: "Komitmen ketepatan waktu" },
                { icon: Users, title: "Corporate & Family", desc: "Melayani bisnis dan keluarga" },
                { icon: Car, title: "Pilihan Lengkap", desc: "Beragam tipe kendaraan" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-xl border border-border/50 p-6 text-center hover:shadow-lg transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h4 className="font-medium text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>

              ))}
            </div>
          </motion.div>
          {/* Coverage Area Section */}
<motion.div
  className="mb-24 md:mb-32"
  {...fadeInUp}
>
  <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-border/50 bg-gradient-to-br from-primary via-primary/95 to-primary/90 px-5 py-10 sm:px-8 sm:py-14 md:p-16 shadow-2xl">

    {/* Background Accent */}
    <div className="absolute top-0 right-0 w-52 sm:w-72 h-52 sm:h-72 bg-gold/10 rounded-full blur-3xl"></div>

    <div className="absolute bottom-0 left-0 w-40 sm:w-56 h-40 sm:h-56 bg-gold/5 rounded-full blur-2xl"></div>

    <div className="relative z-10 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">

      {/* Left Content */}
      <div className="space-y-6 text-white">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] md:leading-tight">
          Jaringan Rental Mencakup Seluruh Pulau Jawa
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
          AGIL RENT melayani kebutuhan transportasi profesional untuk perjalanan bisnis, wisata, dan kebutuhan operasional di berbagai kota besar seluruh Pulau Jawa dengan armada premium dan sopir profesional.
        </p>

        {/* Coverage Cities */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4">
          {[
            "Jabodetabek",
            "Bandung",
            "Semarang",
            "Yogyakarta",
            "Surabaya",
            "Dan Lain-lain",
          ].map((city, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-3 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>

              <span className="text-xs sm:text-sm text-white/90">
                {city}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div className="relative mt-4 lg:mt-0">

        {/* Main Image */}
        <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl border border-white/10">
          <img
            src="/imports/mobill.jpeg"
            alt="Rental Coverage Area"
            className="w-full h-[280px] sm:h-[380px] md:h-[480px] object-cover"
          />
        </div>

        {/* Floating Card */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[-20px] bottom-[-24px] w-[90%] sm:w-auto bg-background border border-border/50 rounded-2xl px-5 sm:px-6 py-4 shadow-[0_20px_45px_rgba(0,0,0,0.18)]">
          
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
            Area Operasional
          </p>

          <h4 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
            Seluruh Pulau Jawa
          </h4>
        </div>
      </div>
    </div>
  </div>
</motion.div>
        </div>
      </section>
    </div>
  );
}
