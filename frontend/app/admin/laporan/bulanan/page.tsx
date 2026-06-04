"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/src/components/SideBar";
import Link from "next/link";
import { BarChart, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  tanggalSelesai: string | null;
  lokasiPenjemputan: string;
  tujuan: string;
  noWa: string;
  status: "PENDING" | "DIKONFIRMASI" | "DITOLAK" | "SELESAI";
  createdAt: string;
};

type Rekap = {
  total: number;
  pending: number;
  dikonfirmasi: number;
  ditolak: number;
  selesai: number;
};

export default function LaporanBulananPage() {
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [rekap, setRekap] = useState<Rekap | null>(null);
  const [pemesanan, setPemesanan] = useState<Pemesanan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bulanNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    fetchLaporan();
  }, [bulan, tahun]);

  const fetchLaporan = async () => {
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

      const res = await fetch(
        `${API_URL}/admin/bulanan?bulan=${bulan}&tahun=${tahun}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil laporan");
      }

      const body = await res.json();

      if (body.success) {
        setRekap(body.rekap);
        setPemesanan(body.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="rounded-2xl bg-white/92 p-4 shadow-sm ring-1 ring-[#d8e1ee]/70">
      <p className="mb-1 text-sm text-[#64748b]">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      DIKONFIRMASI: "bg-blue-100 text-blue-800",
      DITOLAK: "bg-red-100 text-red-800",
      SELESAI: "bg-green-100 text-green-800",
    };

    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pending",
      DIKONFIRMASI: "Dikonfirmasi",
      DITOLAK: "Ditolak",
      SELESAI: "Selesai",
    };

    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
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
          <Sidebar
            currentPage="laporan"
            onNavigate={() => {}}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </aside>

        <div className={`min-w-0 space-y-5 transition-all duration-300 ease-out ${sidebarOpen ? "lg:ml-[17.5rem]" : "lg:ml-0"}`}>
          <div className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  <BarChart size={28} className="text-[#d4af37]" />
                  Laporan Bulanan
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  Rekap pemesanan berdasarkan bulan dan tahun.
                </p>
              </div>

              <Link
                href="/admin/laporan/tahunan"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] sm:w-auto"
              >
                Laporan Tahunan
              </Link>
            </div>

            {/* FILTER */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                  Bulan
                </label>

                <select
                  value={bulan}
                  onChange={(e) => setBulan(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors focus:border-[#1e3a5f]"
                >
                  {bulanNames.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                  Tahun
                </label>

                <select
                  value={tahun}
                  onChange={(e) => setTahun(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors focus:border-[#1e3a5f]"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Memuat laporan...
              </div>
            ) : rekap ? (
              <>
                {/* SUMMARY CARDS */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  <StatCard
                    label="Total"
                    value={rekap.total}
                    color="text-[#1e3a5f]"
                  />

                  <StatCard
                    label="Pending"
                    value={rekap.pending}
                    color="text-yellow-600"
                  />

                  <StatCard
                    label="Dikonfirmasi"
                    value={rekap.dikonfirmasi}
                    color="text-blue-600"
                  />

                  <StatCard
                    label="Ditolak"
                    value={rekap.ditolak}
                    color="text-red-600"
                  />

                  <StatCard
                    label="Selesai"
                    value={rekap.selesai}
                    color="text-green-600"
                  />
                </div>

                {/* PERIODE INFO */}
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10">
                    <Calendar className="text-[#d4af37]" size={24} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#1e3a5f]">
                      Periode Laporan
                    </p>

                    <p className="text-sm text-[#64748b]">
                      {bulanNames[bulan - 1]} {tahun}
                    </p>
                  </div>
                </div>

                {/* DETAIL PEMESANAN */}
                <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e3a5f]">
                        Detail Pemesanan
                      </h3>

                      <p className="text-sm text-[#64748b]">
                        Data pemesanan pada periode yang dipilih.
                      </p>
                    </div>
                  </div>

                  {pemesanan.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center text-sm text-[#64748b] ring-1 ring-[#e6eef8]">
                      Tidak ada pemesanan di bulan ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#e6eef8]">
                      <table className="w-full min-w-[720px] text-sm">
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
                              Tanggal
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

                              <td className="px-4 py-3 font-medium text-[#1e3a5f]">
                                {item.nama}
                              </td>

                              <td className="px-4 py-3 text-[#64748b]">
                                {item.mobil?.nama || "-"}
                              </td>

                              <td className="px-4 py-3 text-xs text-[#64748b]">
                                {formatDate(item.tanggalMulai)}
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
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
                                  Lihat
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Tidak ada data laporan yang ditampilkan.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}