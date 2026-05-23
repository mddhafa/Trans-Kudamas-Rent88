"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/SideBar";
import Link from "next/link";
import { LineChart, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  const router = useRouter();
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [rekap, setRekap] = useState<Rekap | null>(null);
  const [rekapPerBulan, setRekapPerBulan] = useState<RekapBulan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLaporan();
  }, [tahun]);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${API_URL}/admin/tahunan?tahun=${tahun}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil laporan");

      const body = await res.json();
      if (body.success) {
        setRekap(body.rekap);
        setRekapPerBulan(body.rekapPerBulan || []);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="rounded-2xl bg-white/92 p-4 ring-1 ring-[#d8e1ee]/70 shadow-sm">
      <p className="text-sm text-[#64748b] mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={"laporan"} onNavigate={() => {}} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5 lg:pt-0">
          <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-[#1e3a5f] flex items-center gap-2">
                  <LineChart size={28} className="text-[#d4af37]" />
                  Laporan Tahunan
                </h1>
                <p className="text-sm text-[#64748b] mt-1">Rekap pemesanan per tahun</p>
              </div>
            </div>

            {/* Filter Tahun */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">Tahun</label>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">Aksi</label>
                <Link
                  href="/admin/laporan/bulanan"
                  className="block w-full rounded-lg bg-[#1e3a5f]/10 px-3 py-2 text-sm text-[#1e3a5f] hover:bg-[#1e3a5f]/20 text-center"
                >
                  Laporan Bulanan
                </Link>
              </div>
            </div>

            {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800 mb-4">{error}</div>}

            {loading ? (
              <div className="text-center py-8 text-[#64748b]">Memuat laporan...</div>
            ) : rekap ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-5">
                  <StatCard label="Total" value={rekap.total} color="text-[#1e3a5f]" />
                  <StatCard label="Pending" value={rekap.pending} color="text-yellow-600" />
                  <StatCard label="Dikonfirmasi" value={rekap.dikonfirmasi} color="text-blue-600" />
                  <StatCard label="Ditolak" value={rekap.ditolak} color="text-red-600" />
                  <StatCard label="Selesai" value={rekap.selesai} color="text-green-600" />
                </div>

                {/* Periode Info */}
                <div className="mb-6 rounded-lg bg-[#f8fafc] p-4 flex items-center gap-3">
                  <Calendar className="text-[#d4af37]" size={24} />
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">Periode Laporan</p>
                    <p className="text-sm text-[#64748b]">Tahun {tahun}</p>
                  </div>
                </div>

                {/* Rekap Per Bulan */}
                <div className="rounded-2xl bg-[#f8fafc] p-4 border border-[#e6eef8]">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Rekap Per Bulan</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#e6eef8] bg-white">
                          <th className="px-4 py-3 text-left font-semibold">Bulan</th>
                          <th className="px-4 py-3 text-center font-semibold">Total</th>
                          <th className="px-4 py-3 text-center font-semibold">Pending</th>
                          <th className="px-4 py-3 text-center font-semibold">Dikonfirmasi</th>
                          <th className="px-4 py-3 text-center font-semibold">Ditolak</th>
                          <th className="px-4 py-3 text-center font-semibold">Selesai</th>
                          <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekapPerBulan.map((bulan, index) => (
                          <tr key={bulan.bulan} className="border-b border-[#e6eef8] hover:bg-white/50">
                            <td className="px-4 py-3 font-medium">{bulan.bulan}</td>
                            <td className="px-4 py-3 text-center font-semibold text-[#1e3a5f]">{bulan.total}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                                {bulan.pending}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                {bulan.dikonfirmasi}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
                                {bulan.ditolak}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                                {bulan.selesai}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {bulan.total === 0 ? (
                                <span className="text-xs text-[#64748b]">Tidak ada data</span>
                              ) : (
                                <Link
                                  href={`/admin/laporan/bulanan?bulan=${index + 1}&tahun=${tahun}`}
                                  className="text-[#1e3a5f] hover:underline text-xs font-medium"
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
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
