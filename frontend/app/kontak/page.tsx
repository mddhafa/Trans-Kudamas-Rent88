"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import {
  DEFAULT_CONTACT_SETTINGS,
  fetchContactSettings,
  type ContactSettings,
} from "@/src/lib/contactSettings";

export default function ContactPage() {
  const [contact, setContact] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nomorTelepon: '',
    pesan: ''
  });

  useEffect(() => {
    let isMounted = true;

    const loadContactSettings = async () => {
      const settings = await fetchContactSettings();

      if (isMounted) {
        setContact(settings);
      }
    };

    loadContactSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = `Halo, saya ingin menghubungi Anda:

Nama: ${formData.nama}
Email: ${formData.email}
Nomor Telepon: ${formData.nomorTelepon}

Pesan:
${formData.pesan}`;

    const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="contact-header-section bg-gradient-to-r from-primary to-primary/90 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
  
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">Kontak Kami</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Hubungi kami untuk informasi dan pemesanan
          </p>
        </div>
      </div>

      <div className="contact-content-section max-w-7xl mx-auto px-6 py-16">
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white rounded-xl border border-[#d7e0ec] p-8 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#f7f1e3] rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl tracking-tight text-[#1e3a5f]">Alamat</h2>
              <div className="space-y-4 text-sm text-[#526176]">
                <div>
                  <p>Jl. Raya Gas Alam No.60, RT.03/RW.04,</p>
                  <p>Sukatani, Kec. Tapos, Kota Depok, Jawa Barat 16461</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl border border-[#d7e0ec] p-8 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#f7f1e3] rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl tracking-tight text-[#1e3a5f]">Info Kontak</h2>
              <div className="space-y-3 text-sm text-[#526176]">
                <div>
                  <p className="font-medium text-[#1e293b] mb-1">Telepon</p>
                  <a href={`tel:${contact.phone}`} className="text-[#334155] hover:text-gold transition-colors">
                    {contact.phone}
                  </a>
                </div>
                <div>
                  <p className="font-medium text-[#1e293b] mb-1">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-[#334155] hover:text-gold transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl border border-[#d7e0ec] p-8 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#f7f1e3] rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl tracking-tight text-[#1e3a5f]">Sosial Media</h2>
              <div className="flex items-center justify-center gap-4 pt-2">

              <a
                href="https://www.tiktok.com/@dedycn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/steam88gasalam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="purple"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="green"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="w-full h-px bg-[#d5dee9] mb-16"></div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-3 text-primary">Isi Form Berikut</h2>
            <p className="text-[#526176]">
              Kirimkan pesan Anda dan kami akan merespons sesegera mungkin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#d7e0ec] p-8 shadow-sm space-y-6">
            <div>
              <label className="block mb-2 text-sm text-[#475569] uppercase tracking-wider">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                required
                className="w-full px-4 py-3.5 text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#94a3b8]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#475569] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com"
                required
                className="w-full px-4 py-3.5 text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#94a3b8]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#475569] uppercase tracking-wider">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="nomorTelepon"
                value={formData.nomorTelepon}
                onChange={handleChange}
                placeholder="08123456789"
                required
                className="w-full px-4 py-3.5 text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#94a3b8]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#475569] uppercase tracking-wider">
                Pesan
              </label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                placeholder="Tulis pesan Anda di sini"
                rows={6}
                required
                className="w-full px-4 py-3.5 text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-[#94a3b8]"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gold text-white rounded-lg hover:bg-gold/90 transition-all hover:shadow-lg tracking-wide font-medium"
            >
              Kirim Pesan
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
