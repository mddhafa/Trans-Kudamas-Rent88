"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  mobilId?: number | null;
  mobil?: Mobil | null;
  mobilNama?: string | null;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  lokasiPenjemputan: string;
  tujuan: string;
  Layanan: string;
  jamMulai: string | null;
  jamSelesai: string | null;
  noWa: string;
  email?: string;
  perusahaan?: string;
  catatan?: string;
  status: "PENDING" | "DIKONFIRMASI" | "DITOLAK" | "DIBATALKAN" | "SELESAI";
  createdAt: string;
  updatedAt: string;
};

export default function DetailPemesananPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pemesanan, setPemesanan] = useState<Pemesanan | null>(null);
  const [status, setStatus] = useState<"PENDING" | "DIKONFIRMASI" | "DITOLAK" | "DIBATALKAN" | "SELESAI">("PENDING");
  const [editMode, setEditMode] = useState(false);
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPemesananDetail();
    fetchMobils();
  }, [id]);

  useEffect(() => {
    if (!pemesanan) return;
    setEditData({
      nama: pemesanan.nama,
      mobilId: pemesanan.mobilId ?? null,
      Layanan: pemesanan.Layanan,
      tanggalMulai: pemesanan.tanggalMulai?.split("T")[0] ?? "",
      tanggalSelesai: pemesanan.tanggalSelesai ? pemesanan.tanggalSelesai.split("T")[0] : "",
      jamMulai: pemesanan.jamMulai || "",
      jamSelesai: pemesanan.jamSelesai || "",
      lokasiPenjemputan: pemesanan.lokasiPenjemputan,
      tujuan: pemesanan.tujuan,
      noWa: pemesanan.noWa,
      email: pemesanan.email || "",
      perusahaan: pemesanan.perusahaan || "",
      catatan: pemesanan.catatan || "",
    });
  }, [pemesanan]);

  const fetchMobils = async () => {
    try {
      const res = await fetch(`${API_URL}/mobil`);
      const body = await res.json();
      if (body.success) setMobils(body.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPemesananDetail = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${API_URL}/admin/pemesanan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil detail pemesanan");

      const body = await res.json();
      if (body.success) {
        setPemesanan(body.data);
        setStatus(body.data.status);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pemesanan) return;

    try {
      setUpdating(true);
      setError(null);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${API_URL}/admin/pemesanan/${pemesanan.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const body = await res.json();

      if (!res.ok || !body.success) {
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      setSuccess("Status pemesanan berhasil diperbarui");
      setPemesanan({ ...pemesanan, status });
      setTimeout(() => {
        router.push("/admin/pemesanan");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate status");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const isHourlyRental = pemesanan?.Layanan === "SEWA_PER_JAM";

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      PENDING: "text-yellow-700",
      DIKONFIRMASI: "text-green-700",
      DITOLAK: "text-red-700",
      DIBATALKAN: "text-red-700",
      SELESAI: "text-blue-700"
    };
    return colors[s] || "text-gray-700";
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={"pemesanan"} onNavigate={() => {}} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5 lg:pt-0">
          <Link
            href="/admin/pemesanan"
            className="inline-flex items-center gap-2 text-sm text-[#1e3a5f] hover:underline"
          >
            ← Kembali
          </Link>

          <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#1e3a5f]">Detail Pemesanan</h1>
              <p className="text-sm text-[#64748b]">ID: #{id}</p>
            </div>
            <div>
              <button onClick={() => setEditMode((v) => !v)} className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27466f] disabled:opacity-50">
                {editMode ? "Batal Edit" : "Edit Pemesanan"}
               </button>
            </div>

            {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800 mb-4">{error}</div>}
            {success && <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800 mb-4">{success}</div>}

            {loading ? (
              <div className="text-center py-8 text-[#64748b]">Memuat data...</div>
            ) : !pemesanan ? (
              <div className="text-center py-8 text-[#64748b]">Pemesanan tidak ditemukan</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">Nama Pemesan</label>
                    <p className="text-lg font-medium mt-1">{pemesanan.nama}</p>
                  </div>

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <label className="text-xs font-semibold text-[#64748b] uppercase">Mobil</label>
                        <p className="text-lg font-medium mt-1">{pemesanan.mobil?.nama || pemesanan.mobilNama || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">Layanan</label>
                    <p className="text-lg font-medium mt-1">{pemesanan.Layanan}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">
                        {isHourlyRental ? "Tanggal Sewa" : "Tanggal Mulai"}
                      </label>
                      <p className="text-sm font-medium mt-1">{formatDate(pemesanan.tanggalMulai)}</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">Tanggal Selesai</label>
                      <p className="text-sm font-medium mt-1">{formatDate(pemesanan.tanggalSelesai)}</p>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">
                      {isHourlyRental ? "Jam Mulai" : "Jam Penjemputan"}
                    </label>
                    <p className="text-lg font-medium mt-1">{pemesanan.jamMulai || "-"}</p>
                  </div>

                  {pemesanan.jamSelesai && (
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">Jam Selesai</label>
                      <p className="text-lg font-medium mt-1">{pemesanan.jamSelesai}</p>
                    </div>
                  )}

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">Lokasi Penjemputan</label>
                    <p className="text-sm font-medium mt-1">{pemesanan.lokasiPenjemputan}</p>
                  </div>

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">Tujuan</label>
                    <p className="text-sm font-medium mt-1">{pemesanan.tujuan}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">No. WhatsApp</label>
                    <p className="text-lg font-medium mt-1 break-all">{pemesanan.noWa}</p>
                    <a
                      href={`https://wa.me/${pemesanan.noWa.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-[#1e3a5f] hover:underline"
                    >
                      Buka Chat WhatsApp →
                    </a>
                  </div>

                  {pemesanan.email && (
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">Email</label>
                      <p className="text-sm font-medium mt-1 break-all">{pemesanan.email}</p>
                    </div>
                  )}

                  {pemesanan.perusahaan && (
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">Perusahaan</label>
                      <p className="text-sm font-medium mt-1">{pemesanan.perusahaan}</p>
                    </div>
                  )}

                  {pemesanan.catatan && (
                    <div className="bg-[#f8fafc] rounded-lg p-4">
                      <label className="text-xs font-semibold text-[#64748b] uppercase">Catatan</label>
                      <p className="text-sm font-medium mt-1">{pemesanan.catatan}</p>
                    </div>
                  )}

                  <div className="bg-[#f8fafc] rounded-lg p-4">
                    <label className="text-xs font-semibold text-[#64748b] uppercase">Dibuat Pada</label>
                    <p className="text-sm font-medium mt-1">{formatDate(pemesanan.createdAt)}</p>
                  </div>

                  <form onSubmit={handleUpdateStatus} className="bg-[#f8fafc] rounded-lg p-4 border-2 border-[#e6eef8]">
                    <label className="text-xs font-semibold text-[#64748b] uppercase block mb-2">Update Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm mb-3"
                    >
                      <option value="PENDING">Menunggu Konfirmasi</option>
                      <option value="DIKONFIRMASI">Dikonfirmasi</option>
                      <option value="DITOLAK">Ditolak</option>
                      <option value="DIBATALKAN">Dibatalkan</option>
                      <option value="SELESAI">Selesai</option>
                    </select>
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27466f] disabled:opacity-50"
                    >
                      {updating ? "Menyimpan..." : "Simpan Status"}
                    </button>
                  </form>
                  {editMode && editData && (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setUpdating(true);
                        setError(null);
                        const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
                        if (!token) throw new Error("Token tidak ditemukan");

                        const payload: any = {
                          nama: editData.nama,
                          mobilId: editData.mobilId,
                          Layanan: editData.Layanan,
                          tanggalMulai: editData.tanggalMulai || undefined,
                          tanggalSelesai: editData.tanggalSelesai || undefined,
                          jamMulai: editData.jamMulai || undefined,
                          jamSelesai: editData.jamSelesai || undefined,
                          lokasiPenjemputan: editData.lokasiPenjemputan,
                          tujuan: editData.tujuan,
                          noWa: editData.noWa,
                          email: editData.email || undefined,
                          perusahaan: editData.perusahaan || undefined,
                          catatan: editData.catatan || undefined,
                        };

                        const res = await fetch(`${API_URL}/admin/pemesanan/${pemesanan.id}`, {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(payload),
                        });

                        const body = await res.json();
                        if (!res.ok || !body.success) throw new Error(body.message || `HTTP ${res.status}`);

                        setSuccess("Pemesanan berhasil diperbarui");
                        setPemesanan(body.data);
                        setEditMode(false);
                        setTimeout(() => router.push('/admin/pemesanan'), 1200);
                      } catch (err: any) {
                        setError(err.message || "Gagal menyimpan perubahan");
                      } finally {
                        setUpdating(false);
                      }
                    }} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base font-semibold mb-4">Edit Pemesanan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Nama Pemesan</label>
                          <input className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.nama} onChange={(e) => setEditData((d: any) => ({ ...d, nama: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Mobil</label>
                          <select className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.mobilId ?? ""} onChange={(e) => setEditData((d: any) => ({ ...d, mobilId: e.target.value ? parseInt(e.target.value) : null }))}>
                            <option value="">-- Pilih Mobil --</option>
                            {mobils.map((m) => (
                              <option key={m.id} value={m.id}>{m.nama}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Layanan</label>
                          <select className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.Layanan} onChange={(e) => setEditData((d: any) => ({ ...d, Layanan: e.target.value }))}>
                            <option value="SEWA_HARIAN">Sewa Harian</option>
                            <option value="SEWA_PER_JAM">Sewa Per Jam</option>
                            <option value="CITY_TOUR">City Tour</option>
                            <option value="DROP_OFF">Drop Off</option>
                            <option value="LAINNYA">Lainnya</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">No. WhatsApp</label>
                          <input className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.noWa} onChange={(e) => setEditData((d: any) => ({ ...d, noWa: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                          <input className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.email} onChange={(e) => setEditData((d: any) => ({ ...d, email: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Tanggal Mulai</label>
                          <input type="date" className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.tanggalMulai} onChange={(e) => setEditData((d: any) => ({ ...d, tanggalMulai: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Tanggal Selesai</label>
                          <input type="date" className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.tanggalSelesai} onChange={(e) => setEditData((d: any) => ({ ...d, tanggalSelesai: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Jam Mulai</label>
                          <input type="time" className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.jamMulai} onChange={(e) => setEditData((d: any) => ({ ...d, jamMulai: e.target.value }))} />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Jam Selesai</label>
                          <input type="time" className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.jamSelesai} onChange={(e) => setEditData((d: any) => ({ ...d, jamSelesai: e.target.value }))} />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600 uppercase">Lokasi Penjemputan</label>
                          <input className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.lokasiPenjemputan} onChange={(e) => setEditData((d: any) => ({ ...d, lokasiPenjemputan: e.target.value }))} />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600 uppercase">Tujuan</label>
                          <input className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.tujuan} onChange={(e) => setEditData((d: any) => ({ ...d, tujuan: e.target.value }))} />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600 uppercase">Catatan</label>
                          <textarea className="mt-1 w-full px-3 py-2 border rounded-md" value={editData.catatan} onChange={(e) => setEditData((d: any) => ({ ...d, catatan: e.target.value }))} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 border rounded-md bg-white">Batal</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-[#1e3a5f] text-white">{updating ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
