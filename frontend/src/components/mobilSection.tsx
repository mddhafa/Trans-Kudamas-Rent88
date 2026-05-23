"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Users, Wind, UserCheck, Briefcase } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Foto {
  id: string | number;
  url: string;
}

interface Mobil {
  id: string | number;
  nama: string;
  deskripsi: string;
  fotos?: Foto[];
  kapasitas?: number;
}

export function MobilCarouselAPI() {
  const [mobilList, setMobilList] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const getMobilImageSrc = (mobil: Mobil) => {
    const foto = mobil.fotos?.[0]?.url;

    if (!foto) {
      return "/file.svg";
    }

    if (foto.startsWith("http://") || foto.startsWith("https://")) {
      return foto;
    }

    return `${API_URL}/${foto}`;
  };

  useEffect(() => {
    const fetchMobil = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/mobil`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setMobilList(data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMobil();

    const handleMobilUpdated = () => {
      fetchMobil();
    };

    window.addEventListener("mobil-updated", handleMobilUpdated);

    return () => {
      window.removeEventListener("mobil-updated", handleMobilUpdated);
    };
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading catalog...
      </div>
    );
  }

  return (
    <div className="relative">

      {/* NAV */}
      <div className="flex gap-3 mb-8">
        <button onClick={scrollPrev} className="text-primary">
          ◀
        </button>
        <button onClick={scrollNext} className="text-primary">
          ▶
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {mobilList.map((mobil, index) => {
            return (
              <motion.div
                key={mobil.id}
                className="min-w-[340px] max-w-[340px]"
              >
                <div className="bg-card border border-border/50 rounded-[28px] overflow-hidden hover:border-gold/40 transition-all">

                  {/* IMAGE */}
                  <div className="aspect-[4/3] relative bg-muted">
                    <img
                      src={getMobilImageSrc(mobil)}
                      alt={mobil.nama}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/file.svg";
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 space-y-4">

                    <h3 className="text-xl text-primary">
                      {mobil.nama}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mobil.deskripsi}
                    </p>

                    {/* FEATURES */}
                    <div className="grid grid-cols-3 text-center border-y py-4">

                      {/* <div>
                        <Users className="mx-auto w-4 h-4 text-gold" />
                        <p className="text-xs mt-1">
                          4-7
                        </p>
                      </div> */}

                      <div>
                        <Wind className="mx-auto w-4 h-4 text-gold" />
                        <p className="text-xs text-muted-foreground">AC</p>
                      </div>

                      <div>
                        <UserCheck className="mx-auto w-4 h-4 text-gold" />
                        <p className="text-xs text-muted-foreground">Driver</p>
                      </div>

                      <div>
                        <Briefcase className="mx-auto w-4 h-4 text-gold" />
                        <p className="text-xs text-muted-foreground">Bagasi</p>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <Link
                      href={`/booking/${mobil.id}`}
                      className="block w-full rounded-xl border border-border/60 px-6 py-3 text-center text-sm tracking-wide text-primary hover:border-gold/40 hover:bg-gold/5 transition-all duration-300"
                    >
                      Pesan Sekarang
                    </Link>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-8 gap-2">
        {mobilList.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex
                ? "w-8 bg-gold"
                : "w-2 bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}