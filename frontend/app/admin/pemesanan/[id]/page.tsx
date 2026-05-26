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

type StatusPemesanan =
  | "PENDING"
  | "DIKONFIRMASI"
  | "DITOLAK"
  | "DIBATALKAN"
  | "SELESAI";

export default function DetailPemesananPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pemesanan, setPemesanan] = useState<Pemesanan | null>(null);
  const [status, setStatus] = useState<StatusPemesanan>("PENDING");
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
      tanggalSelesai: pemesanan.tanggalSelesai
        ? pemesanan.tanggalSelesai.split("T")[0]
        : "",
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

      if (body.success) {
        setMobils(body.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPemesananDetail = async () => {
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

      const res = await fetch(`${API_URL}/admin/pemesanan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil detail pemesanan");
      }

      const body = await res.json();

      if (body.success) {
        setPemesanan(body.data);
        setStatus(body.data.status);
      }
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
      setSuccess(null);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("admin_token")
          : null;

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

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

      setSuccess("Status pemesanan berhasil diperbarui.");
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

  const handleUpdatePemesanan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pemesanan || !editData) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("admin_token")
          : null;

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

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

      if (!res.ok || !body.success) {
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      setSuccess("Pemesanan berhasil diperbarui.");
      setPemesanan(body.data);
      setEditMode(false);

      setTimeout(() => {
        router.push("/admin/pemesanan");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isHourlyRental = pemesanan?.Layanan === "SEWA_PER_JAM";

  const getStatusBadge = (s: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      DIKONFIRMASI: "bg-green-100 text-green-800",
      DITOLAK: "bg-red-100 text-red-800",
      DIBATALKAN: "bg-red-100 text-red-800",
      SELESAI: "bg-blue-100 text-blue-800",
    };

    return colors[s] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (s: string) => {
    const labels: Record<string, string> = {
      PENDING: "Menunggu Konfirmasi",
      DIKONFIRMASI: "Dikonfirmasi",
      DITOLAK: "Ditolak",
      DIBATALKAN: "Dibatalkan",
      SELESAI: "Selesai",
    };

    return labels[s] || s;
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

  const DetailCard = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
        {label}
      </label>

      <p className="mt-2 text-sm font-medium leading-6 text-[#1e3a5f] break-words">
        {value || "-"}
      </p>
    </div>
  );

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#1e3a5f]";

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <Sidebar currentPage={"pemesanan"} onNavigate={() => {}} />
        </aside>

        <div className="min-w-0 space-y-5 lg:ml-[17.5rem]">
          <Link
            href="/admin/pemesanan"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1e3a5f] hover:underline"
          >
            ← Kembali ke Daftar Pemesanan
          </Link>

          <div className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  Detail Pemesanan
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  ID Pemesanan: #{id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditMode((value) => !value)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] sm:w-auto"
              >
                {editMode ? "Batal Edit" : "Edit Pemesanan"}
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-700 ring-1 ring-green-200">
                {success}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Memuat data pemesanan...
              </div>
            ) : !pemesanan ? (
              <div className="rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Pemesanan tidak ditemukan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                {/* DETAIL LEFT */}
                <div className="space-y-5">
                  <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-[#1e3a5f]">
                          Informasi Pemesanan
                        </h2>

                        <p className="text-sm text-[#64748b]">
                          Detail kendaraan, layanan, dan jadwal perjalanan.
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                          pemesanan.status
                        )}`}
                      >
                        {getStatusLabel(pemesanan.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <DetailCard label="Nama Pemesan" value={pemesanan.nama} />
                      <DetailCard
                        label="Mobil"
                        value={
                          pemesanan.mobil?.nama || pemesanan.mobilNama || "-"
                        }
                      />
                      <DetailCard
                        label="Layanan"
                        value={getLayananLabel(pemesanan.Layanan)}
                      />
                      <DetailCard
                        label={isHourlyRental ? "Tanggal Sewa" : "Tanggal Mulai"}
                        value={formatDate(pemesanan.tanggalMulai)}
                      />
                      <DetailCard
                        label="Tanggal Selesai"
                        value={formatDate(pemesanan.tanggalSelesai)}
                      />
                      <DetailCard
                        label={isHourlyRental ? "Jam Mulai" : "Jam Penjemputan"}
                        value={pemesanan.jamMulai || "-"}
                      />

                      {pemesanan.jamSelesai && (
                        <DetailCard
                          label="Jam Selesai"
                          value={pemesanan.jamSelesai}
                        />
                      )}

                      <DetailCard
                        label="Dibuat Pada"
                        value={formatDate(pemesanan.createdAt)}
                      />

                      <div className="md:col-span-2">
                        <DetailCard
                          label="Lokasi Penjemputan"
                          value={pemesanan.lokasiPenjemputan}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <DetailCard label="Tujuan" value={pemesanan.tujuan} />
                      </div>
                    </div>
                  </div>

                  {editMode && editData && (
                    <form
                      onSubmit={handleUpdatePemesanan}
                      className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5"
                    >
                      <div className="mb-5">
                        <h2 className="text-lg font-semibold text-[#1e3a5f]">
                          Edit Pemesanan
                        </h2>

                        <p className="mt-1 text-sm text-[#64748b]">
                          Perbarui data pemesanan pelanggan.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Nama Pemesan
                          </label>

                          <input
                            className={inputClass}
                            value={editData.nama}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                nama: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Mobil
                          </label>

                          <select
                            className={inputClass}
                            value={editData.mobilId ?? ""}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                mobilId: e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              }))
                            }
                          >
                            <option value="">-- Pilih Mobil --</option>
                            {mobils.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.nama}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Layanan
                          </label>

                          <select
                            className={inputClass}
                            value={editData.Layanan}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                Layanan: e.target.value,
                              }))
                            }
                          >
                            <option value="SEWA_HARIAN">Sewa Harian</option>
                            <option value="SEWA_PER_JAM">Sewa Per Jam</option>
                            <option value="CITY_TOUR">City Tour</option>
                            <option value="DROP_OFF">Drop Off</option>
                            <option value="LAINNYA">Lainnya</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            No. WhatsApp
                          </label>

                          <input
                            className={inputClass}
                            value={editData.noWa}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                noWa: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Email
                          </label>

                          <input
                            className={inputClass}
                            value={editData.email}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Tanggal Mulai
                          </label>

                          <input
                            type="date"
                            className={inputClass}
                            value={editData.tanggalMulai}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                tanggalMulai: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Tanggal Selesai
                          </label>

                          <input
                            type="date"
                            className={inputClass}
                            value={editData.tanggalSelesai}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                tanggalSelesai: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Jam Mulai
                          </label>

                          <input
                            type="time"
                            className={inputClass}
                            value={editData.jamMulai}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                jamMulai: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Jam Selesai
                          </label>

                          <input
                            type="time"
                            className={inputClass}
                            value={editData.jamSelesai}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                jamSelesai: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Lokasi Penjemputan
                          </label>

                          <input
                            className={inputClass}
                            value={editData.lokasiPenjemputan}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                lokasiPenjemputan: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Tujuan
                          </label>

                          <input
                            className={inputClass}
                            value={editData.tujuan}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                tujuan: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-[#1e3a5f]">
                            Catatan
                          </label>

                          <textarea
                            className={`${inputClass} min-h-[110px] resize-none`}
                            value={editData.catatan}
                            onChange={(e) =>
                              setEditData((data: any) => ({
                                ...data,
                                catatan: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 border-t border-[#e2e8f0] pt-5 sm:flex-row sm:items-center sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-[#64748b] ring-1 ring-[#d8e1ee] transition-colors hover:bg-[#f8fafc] hover:text-[#1e3a5f]"
                        >
                          Batal
                        </button>

                        <button
                          type="submit"
                          disabled={updating}
                          className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updating ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* DETAIL RIGHT */}
                <div className="space-y-5">
                  <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5">
                    <h2 className="text-lg font-semibold text-[#1e3a5f]">
                      Kontak Pemesan
                    </h2>

                    <p className="mt-1 text-sm text-[#64748b]">
                      Informasi kontak dan catatan tambahan.
                    </p>

                    <div className="mt-4 space-y-4">
                      <DetailCard label="No. WhatsApp" value={pemesanan.noWa} />

                      <a
                        href={`https://wa.me/${pemesanan.noWa.replace(
                          /[^\d]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-[#c9a52f]"
                      >
                        Buka Chat WhatsApp
                      </a>

                      {pemesanan.email && (
                        <DetailCard label="Email" value={pemesanan.email} />
                      )}

                      {pemesanan.perusahaan && (
                        <DetailCard
                          label="Perusahaan"
                          value={pemesanan.perusahaan}
                        />
                      )}

                      {pemesanan.catatan && (
                        <DetailCard label="Catatan" value={pemesanan.catatan} />
                      )}

                      <DetailCard
                        label="Diperbarui Pada"
                        value={formatDate(pemesanan.updatedAt)}
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={handleUpdateStatus}
                    className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5"
                  >
                    <h2 className="text-lg font-semibold text-[#1e3a5f]">
                      Update Status
                    </h2>

                    <p className="mt-1 text-sm text-[#64748b]">
                      Atur status terbaru untuk pemesanan ini.
                    </p>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                        Status Pemesanan
                      </label>

                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors focus:border-[#1e3a5f]"
                      >
                        <option value="PENDING">Menunggu Konfirmasi</option>
                        <option value="DIKONFIRMASI">Dikonfirmasi</option>
                        <option value="DITOLAK">Ditolak</option>
                        <option value="DIBATALKAN">Dibatalkan</option>
                        <option value="SELESAI">Selesai</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updating ? "Menyimpan..." : "Simpan Status"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}