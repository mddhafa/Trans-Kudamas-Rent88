"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Foto = { id: number; url: string };
type Mobil = { id: number; nama: string; deskripsi: string; kategori?: string; fotos?: Foto[] };

export default function MobilDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [mobil, setMobil] = useState<Mobil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [errors, setErrors] = useState<{ nama?: string; deskripsi?: string; kategori?: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function showSnackbar(msg: string, type: 'success' | 'error' = 'success') {
    setSnackbar({ open: true, message: msg, type });
    setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 1800);
  }

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch(`${API_URL}/mobil/mobil/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        const data: Mobil = body.data || body;
        setMobil(data);
        setNama(data.nama || "");
        setDeskripsi(data.deskripsi || "");
        setKategori(data.kategori || "");
      } catch (err: any) {
        setMessage("Gagal memuat data mobil: " + (err.message || err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // helper to reload mobil after changes
  async function reloadMobil() {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/mobil/mobil/${id}`);
      const body = await res.json();
      const data: Mobil = body.data || body;
      setMobil(data);
      setNama(data.nama || "");
      setDeskripsi(data.deskripsi || "");
      setKategori(data.kategori || "");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // generate previews
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function validate() {
    const e: typeof errors = {};
    if (!nama || nama.trim().length === 0) e.nama = "Nama wajib diisi";
    if (!deskripsi || deskripsi.trim().length < 3) e.deskripsi = "Deskripsi minimal 3 karakter";
    if (!kategori || kategori.trim().length === 0) e.kategori = "Kategori wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!validate()) return;
    const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
    if (!token) {
      setMessage("Token admin tidak ditemukan. Silakan login ulang.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      let res;
      if (files && files.length > 0) {
        const fd = new FormData();
        fd.append('nama', nama.trim());
        fd.append('deskripsi', deskripsi.trim());
        fd.append('kategori', kategori);
        files.forEach((f) => fd.append('fotos', f));

        res = await fetch(`${API_URL}/admin/mobil${id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        res = await fetch(`${API_URL}/admin/mobil${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nama: nama.trim(), deskripsi: deskripsi.trim(), kategori: kategori }),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const body = await res.json().catch(() => ({}));
      setMessage("Perubahan tersimpan.");
      // refresh data and clear selected files
      await reloadMobil();
      setFiles([]);
      showSnackbar('Perubahan tersimpan', 'success');
      // redirect shortly after showing snackbar
      setTimeout(() => router.push('/admin/catalog'), 1200);
    } catch (err: any) {
      setMessage("Gagal menyimpan: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    const ok = window.confirm("Hapus mobil ini? Tindakan tidak bisa dibatalkan.");
    if (!ok) return;
    const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
    if (!token) {
      setMessage("Token admin tidak ditemukan. Silakan login ulang.");
      return;
    }

    // require typing the exact car name to confirm deletion
    // if (mobil && mobil.nama) {
    //   const typed = window.prompt(`Ketik nama mobil "${mobil.nama}" untuk konfirmasi penghapusan:`);
    //   if (typed !== mobil.nama) {
    //     setMessage('Konfirmasi salah — penghapusan dibatalkan.');
    //     setTimeout(() => setMessage(null), 2500);
    //     return;
    //   }
    // }

    setDeleting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/admin/mobil${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      setMessage("Mobil berhasil dihapus.");
      showSnackbar('Mobil berhasil dihapus', 'success');
      setTimeout(() => router.push('/admin/catalog'), 1000);
    } catch (err: any) {
      setMessage("Gagal menghapus: " + (err.message || err));
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeletePhoto(photoId: number) {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
    if (!token) {
      setMessage('Token admin tidak ditemukan.');
      return;
    }

    if (!confirm('Hapus foto ini?')) return;

    try {
      const res = await fetch(`${API_URL}/admin/mobil/foto/${photoId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Gagal menghapus foto');
      showSnackbar('Foto dihapus', 'success');
      await reloadMobil();
    } catch (err: any) {
      setMessage('Gagal menghapus foto: ' + (err.message || err));
    }
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <Sidebar
            currentPage="katalog"
            onNavigate={() => {}}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </aside>

        <div
          className={`min-w-0 space-y-5 transition-all duration-300 ease-out ${
            sidebarOpen ? "lg:ml-[17.5rem]" : "lg:ml-0"
          }`}
        >
          <div className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  Detail Mobil
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  Lihat, edit, atau hapus data mobil.
                </p>
              </div>

              <Link
                href="/admin/catalog"
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee] transition-colors hover:bg-[#f8f9fb] sm:w-auto"
              >
                Kembali ke Katalog
              </Link>
            </div>

            {loading ? (
              <div className="rounded-2xl bg-[#f8f9fb] p-6 text-sm text-[#64748b] ring-1 ring-[#d8e1ee]/60">
                Memuat data mobil...
              </div>
            ) : mobil ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT CONTENT */}
                <div className="lg:col-span-1">
                  <div className="overflow-hidden rounded-2xl bg-[#f8f9fb] ring-1 ring-[#d8e1ee]/60">
                    <div className="border-b border-[#e2e8f0] px-4 py-3">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                        Foto Mobil
                      </h2>
                    </div>

                    {mobil.fotos && mobil.fotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 p-3">
                        {mobil.fotos.map((f) => (
                          <div
                            key={f.id}
                            className="group relative overflow-hidden rounded-xl bg-[#dbe6f3] ring-1 ring-[#d8e1ee]/70"
                          >
                            <img
                              src={`${API_URL}/${f.url}`}
                              alt={mobil.nama}
                              className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(f.id)}
                              className="absolute right-2 top-2 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                            >
                              Hapus
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm text-[#9ca3af]">
                        Tidak ada foto
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/60">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                      Informasi Mobil
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#64748b]">ID</span>
                        <span className="font-medium text-[#1e3a5f]">
                          {mobil.id}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#64748b]">Nama</span>
                        <span className="text-right font-medium text-[#1e3a5f]">
                          {mobil.nama}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#64748b]">Kategori</span>
                        <span className="rounded-full bg-[#1e3a5f]/10 px-3 py-1 text-xs font-medium text-[#1e3a5f]">
                          {mobil.kategori || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:col-span-2">
                  <form
                    onSubmit={handleSave}
                    className="rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5"
                  >
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-[#1e3a5f]">
                        Edit Data Mobil
                      </h2>

                      <p className="mt-1 text-sm text-[#64748b]">
                        Perbarui informasi katalog mobil yang akan tampil pada sistem.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Upload Foto */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                          Tambah Foto
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const list = Array.from(e.target.files || []);
                            setFiles(list);
                          }}
                          className="block w-full rounded-xl border border-[#d8e1ee] bg-white px-3 py-2.5 text-sm text-[#64748b] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#27466f]"
                        />

                        {previews.length > 0 && (
                          <div className="mt-3 flex gap-3 overflow-auto rounded-xl bg-white p-3 ring-1 ring-[#d8e1ee]/60">
                            {previews.map((p, i) => (
                              <img
                                key={i}
                                src={p}
                                alt={`Preview ${i + 1}`}
                                className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Nama */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                          Nama Mobil
                        </label>

                        <input
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#1e3a5f]"
                          placeholder="Masukkan nama mobil"
                        />

                        {errors.nama && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.nama}
                          </p>
                        )}
                      </div>

                      {/* Deskripsi */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                          Deskripsi
                        </label>

                        <textarea
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                          className="min-h-[160px] w-full resize-none rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm leading-6 text-[#1e3a5f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#1e3a5f]"
                          placeholder="Masukkan deskripsi mobil"
                        />

                        {errors.deskripsi && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.deskripsi}
                          </p>
                        )}
                      </div>

                      {/* Kategori */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                          Kategori Mobil
                        </label>

                        <select
                          value={kategori}
                          onChange={(e) => setKategori(e.target.value)}
                          required
                          className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors focus:border-[#1e3a5f]"
                        >
                          <option value="">-- Pilih Kategori --</option>
                          <option value="Minibus">Minibus</option>
                          <option value="Bus">Bus</option>
                        </select>

                        {errors.kategori && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.kategori}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-5 sm:flex-row sm:items-center">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>

                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={deleting}
                          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleting ? "Menghapus..." : "Hapus Mobil"}
                        </button>

                        <Link
                          href="/admin/catalog"
                          className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-[#64748b] transition-colors hover:bg-white hover:text-[#1e3a5f] sm:ml-auto"
                        >
                          Batal
                        </Link>
                      </div>
                    </div>
                  </form>

                  {message && (
                    <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 ring-1 ring-yellow-200">
                      {message}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700 ring-1 ring-red-200">
                Mobil tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
