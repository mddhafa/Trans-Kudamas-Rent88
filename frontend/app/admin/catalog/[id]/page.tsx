"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={"katalog"} onNavigate={() => {}} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5 lg:pt-0">
          <div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#1e3a5f]">Detail Mobil</h1>
                <p className="text-sm text-[#64748b]">Lihat, edit, atau hapus data mobil.</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/admin/catalog" className="rounded-xl bg-white/90 px-3 py-2 text-sm text-[#1e3a5f] ring-1 ring-[#d8e1ee]/60 hover:bg-white">
                  Kembali ke Katalog
                </Link>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-[#64748b]">Memuat...</p>
            ) : mobil ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <div className="rounded-xl overflow-hidden bg-[#f8f9fb] ring-1 ring-[#d8e1ee]/60">
                      {mobil.fotos && mobil.fotos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 p-2">
                          {mobil.fotos.map((f) => (
                            <div key={f.id} className="relative">
                              <img src={`${API_URL}/${f.url}`} alt={mobil.nama} className="w-full h-28 object-cover rounded" />
                              <button onClick={() => handleDeletePhoto(f.id)} className="absolute top-1 right-1 rounded bg-red-600 px-2 py-1 text-xs text-white">Hapus</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-56 flex items-center justify-center text-[#9ca3af]">Tidak ada foto</div>
                      )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-[#64748b]"><strong>ID:</strong> {mobil.id}</p>
                    <p className="text-sm text-[#64748b]"><strong>Nama:</strong> {mobil.nama}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Tambah Foto</label>
                      <input type="file" accept="image/*" multiple onChange={(e) => {
                        const list = Array.from(e.target.files || []);
                        setFiles(list);
                      }} />

                      {previews.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-auto">
                          {previews.map((p, i) => (
                            <img key={i} src={p} className="h-20 w-28 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Nama</label>
                      <input value={nama} onChange={(e) => setNama(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                      {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Deskripsi</label>
                      <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full rounded-lg border px-3 py-2" rows={6} />
                      {errors.deskripsi && <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>}
                    </div>
                    
                    <div>
                      <label className="mb-1 block text-sm text-[#1e3a5f]">Kategori Mobil</label>
                      <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm">
                        <option value="">-- Pilih Kategori --</option>
                        <option value="Minibus">Minibus</option>
                        <option value="Bus">Bus</option>
                      </select>
                      {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="submit" disabled={saving} className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>

                      <button type="button" onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
                        {deleting ? "Menghapus..." : "Hapus Mobil"}
                      </button>

                      <Link href="/admin/catalog" className="ml-auto text-sm text-[#64748b] hover:underline">Batal</Link>
                    </div>
                  </form>

                  {message && <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">{message}</div>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-600">Mobil tidak ditemukan.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
