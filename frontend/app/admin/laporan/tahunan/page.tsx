"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/src/components/SideBar";
import Link from "next/link";
import { LineChart, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RekapBulan = {
  bulan: string;
  total: number;
  pending: number;
  dikonfirmasi: number;
  ditolak: number;
  selesai: number;
};

type Rekap = {
  total: number;
  pending: number;
  dikonfirmasi: number;
  ditolak: number;
  selesai: number;
};

export default function LaporanTahunanPage() {
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [rekap, setRekap] = useState<Rekap | null>(null);
  const [rekapPerBulan, setRekapPerBulan] = useState<RekapBulan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, [tahun]);

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

      const res = await fetch(`${API_URL}/admin/tahunan?tahun=${tahun}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil laporan");
      }

      const body = await res.json();

      if (body.success) {
        setRekap(body.rekap);
        setRekapPerBulan(body.rekapPerBulan || []);
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

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <aside>
            <Sidebar
              currentPage="laporan"
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
                <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  <LineChart size={28} className="text-[#d4af37]" />
                  Laporan Tahunan
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  Rekap pemesanan berdasarkan tahun.
                </p>
              </div>

              <Link
                href="/admin/laporan/bulanan"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] sm:w-auto"
              >
                Laporan Bulanan
              </Link>
            </div>

            {/* FILTER */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:grid-cols-2">
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

              <div className="flex items-end">
                <Link
                  href="/admin/laporan/bulanan"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f]/10 px-4 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f]/20"
                >
                  Lihat Laporan Bulanan
                </Link>
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
                      Tahun {tahun}
                    </p>
                  </div>
                </div>

                {/* REKAP PER BULAN */}
                <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e3a5f]">
                        Rekap Per Bulan
                      </h3>

                      <p className="text-sm text-[#64748b]">
                        Ringkasan jumlah pemesanan dari Januari hingga Desember.
                      </p>
                    </div>
                  </div>

                  {rekapPerBulan.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center text-sm text-[#64748b] ring-1 ring-[#e6eef8]">
                      Tidak ada data laporan tahunan.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#e6eef8]">
                      <table className="w-full min-w-[860px] text-sm">
                        <thead>
                          <tr className="border-b border-[#e6eef8] bg-[#f8fafc]">
                            <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                              Bulan
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                              Total
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                              Pending
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                              Dikonfirmasi
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                              Ditolak
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                              Selesai
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#1e3a5f]">
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {rekapPerBulan.map((item, index) => (
                            <tr
                              key={item.bulan}
                              className="border-b border-[#e6eef8] transition-colors last:border-b-0 hover:bg-[#f8fafc]"
                            >
                              <td className="px-4 py-3 font-medium text-[#1e3a5f]">
                                {item.bulan}
                              </td>

                              <td className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">
                                {item.total}
                              </td>

                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                  {item.pending}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                  {item.dikonfirmasi}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                                  {item.ditolak}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                  {item.selesai}
                                </span>
                              </td>

                              <td className="px-4 py-3">
                                {item.total === 0 ? (
                                  <span className="text-xs text-[#94a3b8]">
                                    Tidak ada data
                                  </span>
                                ) : (
                                  <Link
                                    href={`/admin/laporan/bulanan?bulan=${
                                      index + 1
                                    }&tahun=${tahun}`}
                                    className="inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee] transition-colors hover:bg-[#f8fafc]"
                                  >
                                    Detail
                                  </Link>
                                )}
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