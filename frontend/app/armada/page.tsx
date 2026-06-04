"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FileText, Wind, UserCheck, Briefcase, Loader } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
type CategoryFilter = 'all' | 'passenger' | 'bus';

interface Car {
  id: number;
  nama: string;
  deskripsi: string;
  kapasitas: number;
  image: string;
  category?: CategoryFilter;
  kategori?: string;
  fotos?: { id: number; url: string }[];
}

export default function CarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/mobil`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const carsData: Car[] = Array.isArray(data.data) ? data.data : [];
        
        // Map API response to component Car interface
        const mappedCars = carsData.map((car: any) => {
          let category: CategoryFilter = 'passenger';
          
          // Map database kategori to filter category
          if (car.kategori === 'Bus') {
            category = 'bus';
          } else if (car.kategori === 'Minibus') {
            category = 'passenger';
          }
          
          return {
            id: car.id,
            nama: car.nama,
            deskripsi: car.deskripsi || "",
            kapasitas: car.kapasitas,
            image: car.fotos?.[0]?.url || "/placeholder-car.png",
            category,
            kategori: car.kategori,
            fotos: car.fotos || [],
          };
        });
        
        setCars(mappedCars);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data kendaraan');
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const categoryMatch = selectedCategory === 'all' || car.category === selectedCategory;
      return categoryMatch;
    });
  }, [selectedCategory, cars]);

  return (
    <div className="min-h-screen bg-background">
      <div className="cars-header-section bg-gradient-to-r from-primary to-primary/90 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
            Armada Kami
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Pilihan kendaraan lengkap untuk kebutuhan perjalanan bisnis dan keluarga Anda
          </p>
        </div>
      </div>

      <div className="cars-content-section max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 space-y-8">
          <div>
            <label className="block mb-4 text-sm text-muted-foreground uppercase tracking-wider">
              Kategori Kendaraan
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all' as const, label: 'Semua Kendaraan' },
                { value: 'passenger' as const, label: 'Minibus' },
                { value: 'bus' as const, label: 'Bus' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-lg text-sm transition-all tracking-wide ${
                    selectedCategory === category.value
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-card text-muted-foreground border border-border/50 hover:border-gold/30 hover:text-foreground'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground">
            Menampilkan{" "}
            <span className="text-foreground font-medium">
              {filteredCars.length}
            </span>{" "}
            kendaraan
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Memuat data kendaraan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg">
              Tidak ada kendaraan yang sesuai dengan filter Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-background overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      {(() => {
                        const img = car.image || "";
                        let src = "/placeholder-car.png";

                        if (img) {
                          if (img.startsWith("http")) src = img;
                          else if (img.startsWith("/")) src = `${API_URL}${img}`;
                          else src = `${API_URL}/${img}`;
                        }

                        return (
                          <img
                            src={src}
                            alt={car.nama}
                            className="w-full h-auto object-contain drop-shadow-lg"
                          />
                        );
                      })()}
                    </div>

                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent"></div>
                  </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg tracking-tight text-primary mb-2">
                      {car.nama}
                    </h3>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-sm line-clamp-2 leading-relaxed">
                        {car.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/50">
                    
                    <div className="flex flex-col items-center gap-1">
                      <Wind className="w-5 h-5 text-gold" />
                      <span className="text-xs text-muted-foreground">AC</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <UserCheck className="w-5 h-5 text-gold" />
                      <span className="text-xs text-muted-foreground">Sopir</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Briefcase className="w-5 h-5 text-gold" />
                      <span className="text-xs text-muted-foreground">Bagasi</span>
                    </div>
                  </div>

                  <Link
                    href={`/booking/${car.id}`}
                    className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-center text-sm tracking-wide"
                  >
                    Pilih Mobil
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border p-4 shadow-lg z-40">
        <a
          href="https://wa.me/6283138606502"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all tracking-wide"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}