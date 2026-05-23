import { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router"; 
import useEmblaCarousel from "embla-carousel-react";

// import carousel1 from "src/imports/carousel1.png";
// import carousel2  from "src/imports/carousel2.jpeg";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const slides = [
  {
    title: "Perjalanan Bisnis di Jabodetabek",
    description:
      "Solusi transportasi profesional untuk meeting, airport transfer, dan keperluan korporat Anda",
    image:
      // "src/imports/carousel1.png",
      "/imports/carousel1.png",
    tag: "Corporate Travel",
    accent: "#C9A668",
  },
  {
    title: "Wisata & Liburan Keluarga di Yogyakarta",
    description:
      "Nikmati kenyamanan berwisata bersama keluarga dengan armada premium dan sopir berpengalaman",
    image:
      "/imports/carousel2.jpeg",
    tag: "Family Trip",
    accent: "#8A9BB0",
  },
  {
    title: "Armada Premium untuk Setiap Kebutuhan",
    description:
      "Dari MPV hingga minibus, pilihan kendaraan berkualitas untuk perjalanan Anda",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&auto=format&fit=crop&q=80",
    tag: "Premium Fleet",
    accent: "#5C7A6E",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="group/carousel relative overflow-hidden bg-white">
      {/* Accent Line */}
      <div
        className="absolute left-0 right-0 top-0 z-40 h-[2px] transition-all duration-500"
        style={{
          background: slides[selectedIndex].accent,
        }}
      />

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              <div className="relative h-[100svh] min-h-[700px]">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.58) 100%)",
                  }}
                />

                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Content */}
                <div className="relative z-20 flex h-full items-end">
                  <div className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8 lg:pb-28">
                    <div className="max-w-2xl">
                      {/* Tag */}
                      <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1"
                        style={{
                          borderColor: `${slide.accent}66`,
                          background: `${slide.accent}18`,
                        }}
                      >
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: slide.accent,
                          }}
                        />

                        <span
                          className="text-[11px] uppercase tracking-[0.2em]"
                          style={{
                            color: slide.accent,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {slide.tag}
                        </span>
                      </div>

                      {/* Heading */}
                      <h1
                        className="mb-5 leading-[0.95] text-white"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(3rem, 7vw, 6rem)",
                          fontWeight: 500,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {slide.title}
                      </h1>

                      {/* Description */}
                      <p
                        className="mb-10 max-w-xl"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "1rem",
                          lineHeight: 1.9,
                          color: "rgba(255,255,255,0.68)",
                        }}
                      >
                        {slide.description}
                      </p>

                      {/* CTA */}
                      <div className="flex flex-wrap items-center gap-4">
                        <a
                          href="/kontak"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            background: slide.accent,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Hubungi Kami
                          <ArrowRight size={15} />
                        </a>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 right-145 z-30 flex items-center gap-4">
        {/* Counter */}
        <span
          className="text-xs"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.4)",
          }}
        >
        </span>

        {/* Dots */}
        <div className="flex gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className="transition-all duration-300"
              style={{
                width: index === selectedIndex ? 28 : 6,
                height: 6,
                borderRadius: 999,
                background:
                  index === selectedIndex
                    ? slide.accent
                    : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}