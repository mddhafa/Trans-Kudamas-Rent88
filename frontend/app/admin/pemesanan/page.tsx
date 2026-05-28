"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/SideBar";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type Mobil = {
  id: number;
  nama: string;
};

type Pemesanan = {
  id: number;
  nama: string;
  mobilId: number;
  mobil: Mobil;
  tanggalMulai: string;
  tanggalSelesai?: string | null;
  lokasiPenjemputan: string;
  tujuan: string;
  Layanan: string;
  jamMulai?: string | null;
  jamSelesai?: string | null;
  noWa: string;
  email?: string;
  perusahaan?: string;
  catatan?: string;
  status: "PENDING" | "DIKONFIRMASI" | "DITOLAK" | "DIBATALKAN" | "SELESAI";
  createdAt: string;
  updatedAt: string;
};

export default function PemesananPage() {
  const router = useRouter();
  const [pemesanan, setPemesanan] = useState<Pemesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPemesanan();

    const handleUpdate = () => fetchPemesanan();

    window.addEventListener("pemesanan-updated", handleUpdate);

    return () => {
      window.removeEventListener("pemesanan-updated", handleUpdate);
    };
  }, []);

  const fetchPemesanan = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("admin_token")
          : null;

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const res = await fetch(`${API_URL}/admin/pemesanan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          window.localStorage.removeItem("admin_token");
          router.replace("/admin/login");
        }

        throw new Error(body.message || "Gagal mengambil data pemesanan");
      }

      if (body.success) {
        const sorted = (body.data || []).sort(
          (a: Pemesanan, b: Pemesanan) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        );

        setPemesanan(sorted);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      DIKONFIRMASI: "bg-green-100 text-green-800",
      DITOLAK: "bg-red-100 text-red-800",
      DIBATALKAN: "bg-red-100 text-red-800",
      SELESAI: "bg-blue-100 text-blue-800",
    };

    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Menunggu",
      DIKONFIRMASI: "Dikonfirmasi",
      DITOLAK: "Ditolak",
      DIBATALKAN: "Dibatalkan",
      SELESAI: "Selesai",
    };

    return labels[status] || status;
  };

  const getLayananLabel = (layanan: string) => {
    const labels: Record<string, string> = {
      SEWA_HARIAN: "Sewa Harian",
      SEWA_PER_JAM: "Sewa Per Jam",
      CITY_TOUR: "City Tour",
      LUAR_KOTA: "Luar Kota",
      DROP_OFF: "Drop Off",
      LAINNYA: "Lainnya",
    };

    return labels[layanan] || layanan;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <aside>
            <Sidebar
              currentPage="pemesanan"
              onNavigate={() => {}}
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
            />
          </aside>
        </aside>

        <div className={`min-w-0 space-y-5 transition-all duration-300 ease-out ${sidebarOpen ? "lg:ml-[17.5rem]" : "lg:ml-0"}`}>
          <div className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  Daftar Pemesanan
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  Kelola semua pemesanan kendaraan yang masuk dari pelanggan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchPemesanan()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] sm:w-auto"
              >
                Refresh Data
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            {/* CONTENT */}
            {loading ? (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Memuat data pemesanan...
              </div>
            ) : pemesanan.length === 0 ? (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Belum ada data pemesanan.
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1e3a5f]">
                      Data Pemesanan
                    </h2>

                    <p className="text-sm text-[#64748b]">
                      Total {pemesanan.length} pemesanan ditemukan.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#e6eef8]">
                  <table className="w-full min-w-[1080px] text-sm">
                    <thead>
                      <tr className="border-b border-[#e6eef8] bg-[#f8fafc]">
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Mobil
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Layanan
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Tgl Mulai
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Tgl Selesai
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Penjemputan
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pemesanan.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#e6eef8] transition-colors last:border-b-0 hover:bg-[#f8fafc]"
                        >
                          <td className="px-4 py-3 text-[#64748b]">
                            #{item.id}
                          </td>

                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-[#1e3a5f]">
                                {item.nama}
                              </p>

                              <p className="mt-1 text-xs text-[#94a3b8]">
                                {item.noWa}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-[#64748b]">
                            {item.mobil?.nama || "-"}
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-[#1e3a5f]/10 px-3 py-1 text-xs font-medium text-[#1e3a5f]">
                              {getLayananLabel(item.Layanan)}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-xs text-[#64748b]">
                            {formatDate(item.tanggalMulai)}
                          </td>

                          <td className="px-4 py-3 text-xs text-[#64748b]">
                            {formatDate(item.tanggalSelesai)}
                          </td>

                          <td className="max-w-[220px] px-4 py-3 text-xs leading-5 text-[#64748b]">
                            <span className="line-clamp-2">
                              {item.lokasiPenjemputan || "-"}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                                item.status
                              )}`}
                            >
                              {getStatusLabel(item.status)}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <Link
                              href={`/admin/pemesanan/${item.id}`}
                              className="inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee] transition-colors hover:bg-[#f8fafc]"
                            >
                              Lihat Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}