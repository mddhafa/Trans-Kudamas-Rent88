"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NewMobilPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  type FileWithPreview = { file: File; preview: string };
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;

    const newFiles = Array.from(list).map((f) => ({ file: f, preview: URL.createObjectURL(f) }));

    // enforce max 5 files
    const combined = [...files, ...newFiles].slice(0, 5);
    // revoke previews for dropped files beyond limit
    if (files.length + newFiles.length > 5) {
      newFiles.slice(5 - files.length).forEach((f) => URL.revokeObjectURL(f.preview));
      setError("Maksimal 5 foto diizinkan");
    } else {
      setError(null);
    }

    setFiles(combined);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const next = prev.slice();
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
      if (!token) throw new Error("Token admin tidak ditemukan. Silakan login ulang.");

      const fd = new FormData();
      fd.append("nama", nama);
      fd.append("deskripsi", deskripsi);
      fd.append("kategori", kategori);
      files.forEach((f) => fd.append("fotos", f.file));

      const res = await fetch(`${API_URL}/admin/tambah-mobil`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const body = await res.json();

      if (!res.ok || !body?.success) {
        throw new Error(body?.message || `HTTP ${res.status}`);
      }

      window.dispatchEvent(new Event("mobil-updated"));
      window.localStorage.setItem("mobil_updated_at", String(Date.now()));
      window.location.assign(`/admin/catalog?r=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || "Gagal menambah mobil");
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-semibold text-[#1e3a5f]">Tambah Mobil</h1>
                <p className="text-sm text-[#64748b]">Lengkapi data mobil dan unggah minimal satu foto.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#1e3a5f]">Nama Mobil</label>
                <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#1e3a5f]">Deskripsi</label>
                <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm h-28" />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#1e3a5f]">Kategori Mobil</label>
                <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full rounded-lg border border-[#e6eef8] bg-white px-3 py-2 text-sm">
                  <option value="">-- Pilih Kategori --</option>
                  <option value="Minibus">Minibus</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#1e3a5f]">Foto (maks 5)</label>
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-sm" />
                <div className="mt-2 flex gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="inline-block rounded-md border p-1 text-xs text-[#64748b]">{f.file.name}</div>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center gap-3">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#27466f]">
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>

                <button type="button" onClick={() => router.push('/admin/catalog')} className="rounded-lg bg-white/90 px-3 py-1 text-sm text-[#1e3a5f] ring-1 ring-[#d8e1ee]/60 hover:bg-white">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
