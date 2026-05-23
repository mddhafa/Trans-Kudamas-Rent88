"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Sidebar } from "@/src/components/SideBar";
import {
  ArrowLeft,
  Calendar,
  Car,
  LogOut,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  DEFAULT_CONTACT_SETTINGS,
  fetchContactSettings,
  saveContactSettings,
  type ContactSettings,
} from "@/src/lib/contactSettings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type AdminProfile = {
  id: number;
  username?: string;
};

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
};

type BookingItem = {
  id: number;
  customer: string;
  car: string;
  dateRange: string;
  status: string;
};

type ReviewItem = {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
};

type FeaturedCar = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
};

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

interface Pemesanan {
  id: number;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  lokasiPenjemputan: string;
  tujuan: string;
  Layanan?: string;
  jamMulai?: string | null;
  jamSelesai?: string | null;
  noWa: string;
  email?: string | null;
  perusahaan?: string | null;
  catatan?: string | null;
  status?: string;
  createdAt?: string;
  mobil?: {
    id: number;
    nama: string;
  } | null;
}

const bookingData = [
  { id: "jan-2026", month: "Jan", bookings: 45 },
  { id: "feb-2026", month: "Feb", bookings: 52 },
  { id: "mar-2026", month: "Mar", bookings: 61 },
  { id: "apr-2026", month: "Apr", bookings: 58 },
  { id: "mei-2026", month: "Mei", bookings: 67 },
  { id: "jun-2026", month: "Jun", bookings: 73 },
];

const recentReviews: ReviewItem[] = [
  {
    id: 1,
    customer: "Dewi Lestari",
    rating: 5,
    comment: "Pelayanan sangat memuaskan, mobil bersih dan nyaman",
    date: "2026-05-06",
  },
  {
    id: 2,
    customer: "Andi Wijaya",
    rating: 5,
    comment: "Recommended! Prosesnya cepat dan profesional",
    date: "2026-05-05",
  },
];

function StatCard({ title, value, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ color: iconColor, backgroundColor: `${iconColor}15` }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-[#64748b]">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-[#1e3a5f]">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobilList, setMobilList] = useState<FeaturedCar[]>([]);
  const [mobilLoading, setMobilLoading] = useState(true);
  const [pemesananList, setPemesananList] = useState<Pemesanan[]>([]);
  const [pemesananLoading, setPemesananLoading] = useState(true);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactNotice, setContactNotice] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("admin_token");

    if (!storedToken) {
      router.replace("/admin/login");
      return;
    }

    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          window.localStorage.removeItem("admin_token");
          router.replace("/admin/login");
          return;
        }

        setProfile(result.data);
      } catch (error) {
        console.error(error);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, token]);

  useEffect(() => {
    const fetchMobilList = async () => {
      try {
        const response = await fetch(`${API_URL}/mobil`);
        const result = await response.json();

        if (!response.ok || !result?.success) {
          return;
        }

        const catalog = (result.data || []).map((item: Mobil) => ({
          id: item.id,
          name: item.nama,
          description: item.deskripsi,
          imageUrl: item.fotos?.[0]?.url,
        }));

        setMobilList(catalog);
      } catch (error) {
        console.error(error);
      } finally {
        setMobilLoading(false);
      }
    };

    fetchMobilList();

    
  }, []);

  useEffect(() => {
  const fetchPemesananList = async () => {
    if (!token) return;

    setPemesananLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/pemesanan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        return;
      }

      const items = (result.data || []) as Pemesanan[];

      items.sort((left, right) => {
        const leftDate = new Date(
          left.createdAt || left.tanggalMulai
        ).getTime();

        const rightDate = new Date(
          right.createdAt || right.tanggalMulai
        ).getTime();

        return rightDate - leftDate;
      });

      setPemesananList(items);
    } catch (error) {
      console.error(error);
    } finally {
      setPemesananLoading(false);
    }
  };

  fetchPemesananList();
}, [token]);

  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const settings = await fetchContactSettings();
        setContactSettings(settings);
      } catch (error) {
        console.error(error);
      }
    };

    loadContactSettings();
  }, []);

  const maxBookings = Math.max(...bookingData.map((item) => item.bookings));

  const handleLogout = () => {
    window.localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);

    if (page === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(page);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollCatalog = (direction: "left" | "right") => {
    const container = catalogRef.current;

    if (!container) return;

    const scrollAmount = Math.min(container.clientWidth * 0.8, 520);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const recentBookingItems = pemesananList.slice(0, 3).map((item) => {
    const nama = item.nama || (item.email ? item.email.split("@")[0] : "Customer");
    const mulai = item.tanggalMulai ? new Date(item.tanggalMulai) : null;
    const selesai = item.tanggalSelesai ? new Date(item.tanggalSelesai) : null;
    const formatDate = (d: Date | null) =>
      d && !Number.isNaN(d.getTime())
        ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : null;

    const dateRange = `${formatDate(mulai) || "-"}${
      formatDate(selesai) ? ` — ${formatDate(selesai)}` : ""
    }`;

    return {
      id: item.id,
      customer: nama,
      car: item.mobil?.nama || "Mobil tidak tersedia",
      dateRange,
      status: item.status || "PENDING",
      phone: item.noWa || "-",
      pickup: item.lokasiPenjemputan || "-",
    } as unknown as BookingItem & { phone?: string; pickup?: string };
  });

  const statusLabel = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "Selesai";
      case "DIKONFIRMASI":
        return "Dikonfirmasi";
      case "DITOLAK":
        return "Ditolak";
      case "DIBATALKAN":
        return "Dibatalkan";
      case "PENDING":
      default:
        return "Menunggu Konfirmasi";
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "bg-green-100 text-green-700";
      case "DIKONFIRMASI":
        return "bg-blue-100 text-blue-700";
      case "DITOLAK":
      case "DIBATALKAN":
        return "bg-red-100 text-red-700";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const handleContactChange = (field: keyof ContactSettings, value: string) => {
    setContactSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveContactSettings = async () => {
    if (!token) return;

    setContactSaving(true);
    setContactNotice(null);

    try {
      const saved = await saveContactSettings(contactSettings, token);
      setContactSettings(saved);
      setContactNotice("Pengaturan kontak berhasil disimpan.");
    } catch (error) {
      console.error(error);
      setContactNotice("Gagal menyimpan pengaturan kontak.");
    } finally {
      setContactSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5 lg:pt-0">
          <motion.header
            id="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#1e3a5f]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin dashboard
                </div>
                <h1 className="text-3xl font-semibold text-[#1e3a5f] sm:text-4xl">
                  Dashboard Overview
                </h1>
                <p className="text-sm leading-6 text-[#64748b]">
                  {loading
                    ? "Memuat profil admin..."
                    : `Selamat datang kembali, ${profile?.username || "admin"}.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.header>

          <section id="overview" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Total Booking" value={pemesananLoading ? "..." : String(pemesananList.length)} icon={Calendar} iconColor="#1e3a5f" />
            <StatCard title="Total Mobil" value={mobilLoading ? "..." : String(mobilList.length)} icon={Car} iconColor="#d4af37" />
            <StatCard title="Total Ulasan" value="156" icon={MessageSquare} iconColor="#3b82f6" />
          </section>

          <section id="katalog" className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1e3a5f]">Katalog Mobil</h2>
                <p className="text-sm text-[#64748b]">
                  {mobilLoading ? "Memuat data mobil..." : `${mobilList.length} mobil dari database`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCatalog("left")}
                  className="rounded-full border border-[#d8e1ee] bg-white px-4 py-2 text-sm text-[#1e3a5f] transition-colors hover:bg-[#f4f7fb]"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => scrollCatalog("right")}
                  className="rounded-full border border-[#d8e1ee] bg-white px-4 py-2 text-sm text-[#1e3a5f] transition-colors hover:bg-[#f4f7fb]"
                >
                  Next
                </button>
              </div>
            </div>

            <div
              ref={catalogRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            >
              {mobilLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="min-w-[180px] flex-1 snap-start overflow-hidden rounded-2xl bg-[#f8f9fb] ring-1 ring-[#d8e1ee]/60 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px]"
                  >
                    <div className="h-28 bg-[#dbe6f3] md:h-32">
                      <div className="h-full w-full animate-pulse bg-gradient-to-br from-[#dbe6f3] via-[#e8eef6] to-[#dbe6f3]" />
                    </div>

                    <div className="p-4">
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e3a5f] text-white">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="h-5 w-2/3 animate-pulse rounded bg-[#dbe6f3]" />
                      <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#e8eef6]" />
                      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-[#e8eef6]" />
                    </div>
                  </div>
                ))
              ) : (
                mobilList.map((car) => (
                  <div
                    key={car.id}
                    className="min-w-[180px] flex-1 snap-start overflow-hidden rounded-2xl bg-[#f8f9fb] ring-1 ring-[#d8e1ee]/60 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px]"
                  >
                    <div className="h-28 bg-[#dbe6f3] md:h-32">
                      <img
                        src={car.imageUrl ? `${API_URL}/${car.imageUrl}` : "/file.svg"}
                        alt={car.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e3a5f] text-white">
                        <Car className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#1e3a5f]">
                        {car.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#64748b]">
                        {car.description}
                      </p>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </section>

          <section id="booking" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
              <h2 className="mb-4 text-xl font-semibold text-[#1e3a5f]">
                Aktivitas Booking
              </h2>
              <div className="flex h-[250px] items-end gap-3 rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/50">
                {bookingData.map((item) => {
                  const height = Math.max((item.bookings / maxBookings) * 100, 18);

                  return (
                    <div key={item.id} className="flex-1">
                      <div className="flex h-[190px] items-end justify-center">
                        <div
                          className="w-full max-w-[44px] rounded-t-xl bg-[#1e3a5f] shadow-sm transition-transform duration-300 hover:scale-y-105"
                          style={{ height: `${height}%` }}
                          title={`${item.month}: ${item.bookings} booking`}
                        />
                      </div>
                      <p className="mt-3 text-center text-xs text-[#64748b]">
                        {item.month}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
              <h2 className="mb-4 text-xl font-semibold text-[#1e3a5f]">
                Booking Terbaru
              </h2>
              <p className="mb-3 text-sm text-[#64748b]">
                {pemesananLoading ? "Memuat data pemesanan..." : `${pemesananList.length} pemesanan dari database`}
              </p>
              <div className="space-y-3">
                {recentBookingItems.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-2 rounded-2xl bg-[#f8f9fb] p-3 ring-1 ring-[#d8e1ee]/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-[#1e3a5f] truncate font-medium">{booking.customer}</p>
                      <p className="text-sm text-[#64748b] truncate">{booking.car}</p>
                      <p className="mt-1 text-xs text-[#94a3b8]">{booking.dateRange}</p>
                      <p className="mt-1 text-xs text-[#64748b]">{booking.pickup} • {booking.phone}</p>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-right sm:mt-0">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs ${statusClass(booking.status)}`}
                      >
                        {statusLabel(booking.status)}
                      </span>

                      <Link
                        href={`/admin/pemesanan/${booking.id}`}
                        className="rounded-lg bg-white/90 px-3 py-1 text-sm text-[#1e3a5f] ring-1 ring-[#d8e1ee]/60 hover:bg-white"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                ))}
                {!pemesananLoading && pemesananList.length === 0 ? (
                  <div className="rounded-2xl bg-[#f8f9fb] p-4 text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/50">
                    Belum ada data pemesanan di database.
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section id="ulasan" className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <h2 className="mb-4 text-xl font-semibold text-[#1e3a5f]">
              Ulasan Terbaru
            </h2>

            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/50">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-[#1e3a5f]">{review.customer}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span
                          key={`review-${review.id}-star-${i}`}
                          className="text-[#d4af37]"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#64748b]">{review.comment}</p>
                  <p className="mt-2 text-xs text-[#94a3b8]">{review.date}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="pengaturan" className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <h2 className="mb-4 text-xl font-semibold text-[#1e3a5f]">Pengaturan</h2>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 rounded-2xl bg-[#f8f9fb] p-5 ring-1 ring-[#d8e1ee]/50">
                <div>
                  <p className="font-medium text-[#1e3a5f]">Akun admin aktif</p>
                  <p className="text-sm text-[#64748b]">
                    {loading ? "Memuat data akun..." : profile?.username || "admin"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              <div className="space-y-4 rounded-2xl bg-[#f8f9fb] p-5 ring-1 ring-[#d8e1ee]/50">
                <div>
                  <p className="font-medium text-[#1e3a5f]">Kontak Publik</p>
                  <p className="text-sm text-[#64748b]">Nomor ini dipakai di footer dan halaman kontak.</p>
                </div>

                <label className="block text-sm text-[#526176]">
                  Telepon
                  <input
                    type="text"
                    value={contactSettings.phone}
                    onChange={(event) => handleContactChange("phone", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-[#1e3a5f] outline-none ring-0 focus:border-[#1e3a5f]"
                  />
                </label>

                <label className="block text-sm text-[#526176]">
                  WhatsApp
                  <input
                    type="text"
                    value={contactSettings.whatsappNumber}
                    onChange={(event) => handleContactChange("whatsappNumber", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-[#1e3a5f] outline-none ring-0 focus:border-[#1e3a5f]"
                  />
                </label>

                <label className="block text-sm text-[#526176]">
                  Email
                  <input
                    type="email"
                    value={contactSettings.email}
                    onChange={(event) => handleContactChange("email", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-[#1e3a5f] outline-none ring-0 focus:border-[#1e3a5f]"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleSaveContactSettings}
                    disabled={contactSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-[#c9a52f] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {contactSaving ? "Menyimpan..." : "Simpan Kontak"}
                  </button>
                  {contactNotice ? (
                    <p className="text-sm text-[#526176]">{contactNotice}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
