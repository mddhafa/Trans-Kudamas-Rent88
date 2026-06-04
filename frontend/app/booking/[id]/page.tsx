"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, User, Mail, Phone, Building2, MessageSquare, Car as CarIcon, Shield } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const layananOptions = [
  {
    value: "SEWA_HARIAN",
    label: "Sewa Harian",
    description: "*Tanggal mulai, tanggal selesai, dan jam penjemputan",
  },
  {
    value: "SEWA_PER_JAM",
    label: "Sewa Per Jam",
    description: "*Tanggal sewa, jam mulai, dan jam selesai",
  },
  { value: "CITY_TOUR", 
    label: "City Tour", 
    description: "*Tanggal mulai, tanggal selesai, dan jam penjemputan" 
  },
  { value: "DROP_OFF",
    label: "Drop Off",
    description: "*Tanggal mulai, tanggal selesai, dan jam penjemputan"
  },
  { value: "LAINNYA", 
    label: "Lainnya", 
    description: "*Kebutuhan kustom seperti pernikahan, acara khusus, dll, harap jelaskan pada kolom catatan" 
  }
] as const;

const layananLabels: Record<string, string> = {
  SEWA_HARIAN: "Sewa Harian",
  SEWA_PER_JAM: "Sewa Per Jam",
  CITY_TOUR: "City Tour",
  LUAR_KOTA: "Luar Kota",
  DROP_OFF: "Drop Off",
  LAINNYA: "Lainnya",
};
const formatJamIndonesia = (value?: string | null) => {
  if (!value) return "-";

  const [hour, minute] = value.split(":");

  if (!hour || !minute) return "-";

  return `${hour.padStart(2, "0")}.${minute.padStart(2, "0")} WIB`;
};


const formatTanggalIndonesia = (date?: string | null) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

type Foto = {
  id: number;
  url: string;
};

type Mobil = {
  id: number;
  nama: string;
  deskripsi: string;
  fotos: Foto[];
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const mobilId = parseInt(params.id as string);

  const [mobil, setMobil] = useState<Mobil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Layanan: "LAINNYA",
    tanggalMulai: "",
    tanggalSelesai: "",
    lokasiPenjemputan: "",
    jamMulai: "",
    jamSelesai: "",
    tujuan: "",
    nama: "",
    noWa: "",
    email: "",
    perusahaan: "",
    catatan: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMobil();
  }, []);

  const fetchMobil = async () => {
    try {
      const response = await fetch(`${API_URL}/mobil/mobil/${mobilId}`);
      const result = await response.json();

      if (result.success) {
        setMobil(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isHourlyRental = formData.Layanan === "SEWA_PER_JAM";
  const isDailyRental = formData.Layanan === "SEWA_HARIAN";

  const duration = useMemo(() => {
    if (isHourlyRental) return null;
    if (!formData.tanggalMulai || !formData.tanggalSelesai) return null;
    const start = new Date(formData.tanggalMulai);
    const end = new Date(formData.tanggalSelesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, [formData.tanggalMulai, formData.tanggalSelesai, isHourlyRental]);

  const getImageSrc = (url: string) => {
    if (!url) return "/file.svg";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${API_URL}/${url}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.Layanan) {
      newErrors.Layanan = "Pilih jenis layanan";
    }

    if (!formData.tanggalMulai) {
      newErrors.tanggalMulai = "Tanggal mulai harus dipilih";
    }

    if (isHourlyRental) {
      if (!formData.jamMulai.trim()) {
        newErrors.jamMulai = "Jam mulai harus dipilih";
      }

      if (!formData.jamSelesai.trim()) {
        newErrors.jamSelesai = "Jam selesai harus dipilih";
      }

      if (
        formData.jamMulai &&
        formData.jamSelesai &&
        formData.jamSelesai <= formData.jamMulai
      ) {
        newErrors.jamSelesai = "Jam selesai harus lebih besar dari jam mulai";
      }
    } else {
      if (!formData.tanggalSelesai) {
        newErrors.tanggalSelesai = "Tanggal selesai harus dipilih";
      } else if (new Date(formData.tanggalSelesai) <= new Date(formData.tanggalMulai)) {
        newErrors.tanggalSelesai = "Tanggal selesai harus lebih besar dari tanggal mulai";
      }

      if (!formData.jamMulai.trim()) {
        newErrors.jamMulai = "Jam penjemputan tidak boleh kosong";
      }
    }

    if (!formData.lokasiPenjemputan.trim()) {
      newErrors.lokasiPenjemputan = "Lokasi penjemputan tidak boleh kosong";
    }

    if (!formData.tujuan.trim()) {
      newErrors.tujuan = "Tujuan tidak boleh kosong";
    }

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
    }

    if (!formData.noWa.trim()) {
      newErrors.noWa = "Nomor WhatsApp tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "Layanan") {
        if (value === "SEWA_PER_JAM") {
          next.tanggalSelesai = "";
        }

        if (value === "SEWA_HARIAN") {
          next.jamSelesai = "";
        }
      }

      return next;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/pemesanan/pesan-mobil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          mobilId,
          Layanan: formData.Layanan,
          tanggalMulai: formData.tanggalMulai,
          tanggalSelesai: isHourlyRental ? null : formData.tanggalSelesai,
          lokasiPenjemputan: formData.lokasiPenjemputan,
          tujuan: formData.tujuan,
          jamMulai: formData.jamMulai,
          jamSelesai: isHourlyRental ? formData.jamSelesai : null,
          noWa: formData.noWa,
          email: formData.email,
          perusahaan: formData.perusahaan,
          catatan: formData.catatan,
        }),
      });

      const result = await response.json();

      if (result.success && result.waUrl) {
        setTimeout(() => {
          window.open(result.waUrl, "_blank");
        }, 500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.Layanan &&
    formData.nama &&
    formData.noWa &&
    formData.tanggalMulai &&
    formData.lokasiPenjemputan &&
    formData.tujuan &&
    formData.jamMulai &&
    (isHourlyRental ? formData.jamSelesai : formData.tanggalSelesai);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#edf2f8]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-[#d4af37] rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-[#1e3a5f] font-medium">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!mobil) {
    return (
      <main className="min-h-screen bg-[#edf2f8]">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[#1e3a5f] font-medium">Mobil tidak ditemukan</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="booking-header-section bg-gradient-to-r from-primary to-primary/90 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
            Form Pemesanan
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Lengkapi informasi perjalanan Anda untuk melanjutkan proses pemesanan kendaraan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Detail Pemesanan Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl tracking-tight mb-8 text-[#1e3a5f] font-bold">
                  Detail Pemesanan
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Layanan */}
                  <div className="md:col-span-2">
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <CarIcon className="w-4 h-4" />
                        Jenis Layanan
                      </span>
                    </label>
                    <select
                      name="Layanan"
                      value={formData.Layanan}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                        errors.Layanan ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {layananOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.Layanan && (
                      <p className="text-red-600 text-sm mt-1">{errors.Layanan}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 ">
                      {layananOptions.find((option) => option.value === formData.Layanan)?.description}
                    </p>
                  </div>

                  {isHourlyRental ? (
                    <>
                      {/* Tanggal Sewa */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Tanggal Sewa
                          </span>
                        </label>
                        <input
                          type="date"
                          name="tanggalMulai"
                          value={formData.tanggalMulai}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.tanggalMulai
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.tanggalMulai && (
                          <p className="text-red-600 text-sm mt-1">{errors.tanggalMulai}</p>
                        )}
                      </div>

                      {/* Jam Mulai */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Jam Mulai
                          </span>
                        </label>
                        <input
                          type="text"
                          name="jamMulai"
                          value={formData.jamMulai}
                          onChange={handleChange}
                          placeholder="Contoh: 08:00"
                          inputMode="numeric"
                          maxLength={5}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.jamMulai ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.jamMulai && (
                          <p className="text-red-600 text-sm mt-1">{errors.jamMulai}</p>
                        )}
                      </div>

                      {/* Jam Selesai */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Jam Selesai
                          </span>
                        </label>
                        <input
                          type="text"
                          name="jamSelesai"
                          value={formData.jamSelesai}
                          onChange={handleChange}
                          placeholder="Contoh: 17:00"
                          inputMode="numeric"
                          maxLength={5}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.jamSelesai ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.jamSelesai && (
                          <p className="text-red-600 text-sm mt-1">{errors.jamSelesai}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Tanggal Mulai */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Tanggal Mulai
                          </span>
                        </label>
                        <input
                          type="date"
                          name="tanggalMulai"
                          value={formData.tanggalMulai}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.tanggalMulai
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.tanggalMulai && (
                          <p className="text-red-600 text-sm mt-1">{errors.tanggalMulai}</p>
                        )}
                      </div>

                      {/* Tanggal Selesai */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Tanggal Selesai
                          </span>
                        </label>
                        <input
                          type="date"
                          name="tanggalSelesai"
                          value={formData.tanggalSelesai}
                          onChange={handleChange}
                          min={formData.tanggalMulai || new Date().toISOString().split("T")[0]}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.tanggalSelesai
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.tanggalSelesai && (
                          <p className="text-red-600 text-sm mt-1">{errors.tanggalSelesai}</p>
                        )}
                      </div>

                      {/* Jam Penjemputan */}
                      <div>
                        <label className="block mb-3">
                          <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                            <Calendar className="w-4 h-4" />
                            Jam Penjemputan
                          </span>
                        </label>
                        <input
                          type="text"
                          name="jamMulai"
                          value={formData.jamMulai}
                          onChange={handleChange}
                          placeholder="Contoh: 08:00"
                          inputMode="numeric"
                          maxLength={5}
                          required
                          className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all ${
                            errors.jamMulai ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {errors.jamMulai && (
                          <p className="text-red-600 text-sm mt-1">{errors.jamMulai}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Lokasi Penjemputan */}
                  <div>
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <MapPin className="w-4 h-4" />
                        Lokasi Penjemputan
                      </span>
                    </label>
                    <input
                      type="text"
                      name="lokasiPenjemputan"
                      value={formData.lokasiPenjemputan}
                      onChange={handleChange}
                      placeholder="Contoh: Bandara Soekarno-Hatta"
                      required
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400 ${
                        errors.lokasiPenjemputan
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {errors.lokasiPenjemputan && (
                      <p className="text-red-600 text-sm mt-1">{errors.lokasiPenjemputan}</p>
                    )}
                  </div>

                  {/* Tujuan */}
                  <div>
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <MapPin className="w-4 h-4" />
                        Tujuan
                      </span>
                    </label>
                    <input
                      type="text"
                      name="tujuan"
                      value={formData.tujuan}
                      onChange={handleChange}
                      placeholder="Contoh: Jakarta Pusat"
                      required
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400 ${
                        errors.tujuan ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {errors.tujuan && (
                      <p className="text-red-600 text-sm mt-1">{errors.tujuan}</p>
                    )}
                  </div>

                  {/* Notice */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 p-4 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg">
                      <Shield className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {isHourlyRental
                          ? "Sewa per jam menampilkan tanggal sewa, jam mulai, dan jam selesai."
                          : "Sewa harian menampilkan tanggal mulai, tanggal selesai, dan jam penjemputan."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Pemesan Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl tracking-tight mb-8 text-[#1e3a5f] font-bold">
                  Data Pemesan
                </h2>

                <div className="space-y-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <User className="w-4 h-4" />
                        Nama Lengkap
                      </span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap Anda"
                      required
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400 ${
                        errors.nama ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {errors.nama && (
                      <p className="text-red-600 text-sm mt-1">{errors.nama}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="block mb-3">
                        <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                          <Phone className="w-4 h-4" />
                          Nomor WhatsApp
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="noWa"
                        value={formData.noWa}
                        onChange={handleChange}
                        placeholder="08123456789"
                        required
                        className={`w-full px-4 py-3.5 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400 ${
                          errors.noWa ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                      {errors.noWa && (
                        <p className="text-red-600 text-sm mt-1">{errors.noWa}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-3">
                        <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                          <Mail className="w-4 h-4" />
                          Email
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Perusahaan */}
                  <div>
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <Building2 className="w-4 h-4" />
                        Perusahaan <span className="normal-case text-gray-500">(Opsional)</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="perusahaan"
                      value={formData.perusahaan}
                      onChange={handleChange}
                      placeholder="Nama perusahaan Anda"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block mb-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wider mb-2 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Catatan Tambahan <span className="normal-case text-gray-500">(Opsional)</span>
                      </span>
                    </label>
                    <textarea
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleChange}
                      placeholder="Permintaan khusus atau informasi tambahan"
                      rows={4}
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all resize-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="hidden lg:flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#d4af37] text-[#1e3a5f] rounded-lg hover:bg-[#e6c547] hover:scale-[1.02] transition-all hover:shadow-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100 font-bold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Pesan Sekarang via WhatsApp
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-8 sticky top-24 shadow-sm">
              <h2 className="text-lg tracking-tight mb-6 text-[#1e3a5f] font-bold">
                Ringkasan
              </h2>

              {/* Car Image */}
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                {mobil.fotos && mobil.fotos.length > 0 ? (
                  <img
                    src={getImageSrc(mobil.fotos[0].url)}
                    alt={mobil.nama}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400">Tidak ada foto</div>
                )}
              </div>

              <div className="space-y-6">
                {/* Car Name */}
                <div>
                  <div className="flex items-start gap-3 mb-1">
                    <CarIcon className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium tracking-tight text-[#1e3a5f]">
                        {mobil.nama}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Layanan</span>
                    <span className="font-medium text-[#1e3a5f]">
                      {layananLabels[formData.Layanan] || formData.Layanan}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {isHourlyRental ? "Tanggal Sewa" : "Tanggal Mulai"}
                    </span>
                    <span className="font-medium text-[#1e3a5f]">
                      {formatTanggalIndonesia(formData.tanggalMulai)}
                    </span>
                  </div>

                  {isHourlyRental ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Jam Mulai</span>
                        <span className="font-medium text-[#1e3a5f]">
                          {formatJamIndonesia(formData.jamMulai)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Jam Selesai</span>
                        <span className="font-medium text-[#1e3a5f]">
                          {formatJamIndonesia(formData.jamSelesai)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tanggal Selesai</span>
                        <span className="font-medium text-[#1e3a5f]">
                          {formatTanggalIndonesia(formData.tanggalSelesai)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Jam Penjemputan</span>
                        <span className="font-medium text-[#1e3a5f]">
                          {formData.jamMulai || "-"}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Durasi</span>
                    <span className="font-medium text-[#1e3a5f]">
                      {isHourlyRental ? "Per jam" : `${duration || 0} hari`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isFormValid) {
              const form = document.querySelector("form") as HTMLFormElement;
              form.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
              );
            }
          }}
          disabled={!isFormValid || isSubmitting}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#d4af37] text-[#1e3a5f] rounded-lg hover:bg-[#e6c547] transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}
