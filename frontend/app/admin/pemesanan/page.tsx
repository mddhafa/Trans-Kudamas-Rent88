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

  useEffect(() => {
    fetchPemesanan();
    const handleUpdate = () => fetchPemesanan();
    window.addEventListener("pemesanan-updated", handleUpdate);
    return () => window.removeEventListener("pemesanan-updated", handleUpdate);
  }, []);

  const fetchPemesanan = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${API_URL}/admin/pemesanan`, {
        headers: { Authorization: `Bearer ${token}` },
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
        const sorted = (body.data || []).sort((a: Pemesanan, b: Pemesanan) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setPemesanan(sorted);
      }
      setError(null);
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
      SELESAI: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={"pemesanan"} onNavigate={() => {}} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5 lg:pt-0">
          <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#1e3a5f]">Daftar Pemesanan</h1>
                <p className="text-sm text-[#64748b]">Kelola semua pemesanan mobil dari pelanggan</p>
              </div>
              <button
                onClick={() => fetchPemesanan()}
                className="rounded-lg bg-[#1e3a5f]/10 px-3 py-1 text-sm text-[#1e3a5f] hover:bg-[#1e3a5f]/20"
              >
                Refresh
              </button>
            </div>

            {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800 mb-4">{error}</div>}

            {loading ? (
              <div className="text-center py-8 text-[#64748b]">Memuat data...</div>
            ) : pemesanan.length === 0 ? (
              <div className="text-center py-8 text-[#64748b]">Belum ada pemesanan</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e6eef8] bg-[#f8fafc]">
                      <th className="px-4 py-3 text-left font-semibold">ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Nama</th>
                      <th className="px-4 py-3 text-left font-semibold">Mobil</th>
                      <th className="px-4 py-3 text-left font-semibold">Layanan</th>
                      <th className="px-4 py-3 text-left font-semibold">Tgl Mulai</th>
                      <th className="px-4 py-3 text-left font-semibold">Tgl Selesai</th>
                      <th className="px-4 py-3 text-left font-semibold">Penjemputan</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pemesanan.map((p) => (
                      <tr key={p.id} className="border-b border-[#e6eef8] hover:bg-[#f8fafc]/50">
                        <td className="px-4 py-3">#{p.id}</td>
                        <td className="px-4 py-3">{p.nama}</td>
                        <td className="px-4 py-3">{p.mobil?.nama || "-"}</td>
                        <td className="px-4 py-3">{p.Layanan}</td>
                        <td className="px-4 py-3">{formatDate(p.tanggalMulai)}</td>
                        <td className="px-4 py-3">{formatDate(p.tanggalSelesai)}</td>
                        <td className="px-4 py-3 text-xs">{p.lokasiPenjemputan}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/pemesanan/${p.id}`}
                            className="text-[#1e3a5f] hover:underline text-xs font-medium"
                          >
                            Lihat Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
