"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export default function NewMobilPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  type FileWithPreview = { file: File; preview: string };
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <Sidebar
            currentPage="katalog"
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
                <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">
                  Tambah Mobil
                </h1>

                <p className="mt-1 text-sm text-[#64748b]">
                  Lengkapi data mobil dan unggah maksimal lima foto kendaraan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/catalog")}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee] transition-colors hover:bg-[#f8f9fb] sm:w-auto"
              >
                Kembali ke Katalog
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              {/* LEFT PANEL */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/60">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                    Foto Mobil
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#64748b]">
                    Unggah foto kendaraan yang akan ditampilkan pada katalog.
                    Maksimal 5 foto.
                  </p>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                      Upload Foto
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFiles}
                      className="block w-full rounded-xl border border-[#d8e1ee] bg-white px-3 py-2.5 text-sm text-[#64748b] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1e3a5f] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#27466f]"
                    />
                  </div>

                  {files.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-[#d8e1ee]/70"
                        >
                          <img
                            src={f.preview}
                            alt={f.file.name}
                            className="h-28 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute right-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                          >
                            Hapus
                          </button>

                          <div className="border-t border-[#e2e8f0] px-2 py-2">
                            <p className="truncate text-xs text-[#64748b]">
                              {f.file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-white text-sm text-[#94a3b8] ring-1 ring-[#d8e1ee]/70">
                      Belum ada foto dipilih
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-[#f8f9fb] p-4 ring-1 ring-[#d8e1ee]/60 sm:p-5">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-[#1e3a5f]">
                      Informasi Mobil
                    </h2>

                    <p className="mt-1 text-sm text-[#64748b]">
                      Data berikut akan digunakan pada halaman katalog kendaraan.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Nama Mobil */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                        Nama Mobil
                      </label>

                      <input
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        placeholder="Contoh: Innova Zenix"
                        className="w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm text-[#1e3a5f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#1e3a5f]"
                      />
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                        Deskripsi
                      </label>

                      <textarea
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        required
                        placeholder="Masukkan deskripsi singkat mobil"
                        className="min-h-[150px] w-full resize-none rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-sm leading-6 text-[#1e3a5f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#1e3a5f]"
                      />
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
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                        {error}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-5 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#27466f] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Menyimpan..." : "Simpan Mobil"}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/admin/catalog")}
                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-[#64748b] transition-colors hover:bg-white hover:text-[#1e3a5f] sm:ml-auto"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
