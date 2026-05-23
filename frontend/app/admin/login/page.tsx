"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        setErrorMessage(result?.message || "Login gagal. Cek email dan password.");
        return;
      }

      if (result?.data?.token) {
        window.localStorage.setItem("admin_token", result.data.token);
      }

      router.replace("/admin/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Tidak bisa terhubung ke server login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(201,166,104,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_28%),linear-gradient(180deg,_#0F1722_0%,_#121A28_55%,_#0B111B_100%)] text-[var(--white)]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10 lg:p-12"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,166,104,0.12),transparent_35%,rgba(255,255,255,0.04))]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-12">
              <div className="space-y-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--gold)]/40 hover:text-[var(--white)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke beranda
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,166,104,0.25)] bg-[rgba(201,166,104,0.1)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Admin access
                </div>

                <div className="max-w-xl space-y-4">
                  <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[var(--white)] sm:text-5xl lg:text-6xl">
                    Masuk ke panel admin dengan aman dan cepat.
                  </h1>
                  <p className="max-w-lg text-base leading-8 text-[var(--muted)] sm:text-lg">
                    Kelola armada, pemesanan, dan laporan operasional dari satu
                    dashboard yang fokus pada kecepatan kerja.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Terkoneksi",
                    desc: "Akses cepat ke data operasional",
                  },
                  {
                    title: "Terlindungi",
                    desc: "Lapisan autentikasi admin",
                  },
                  {
                    title: "Terstruktur",
                    desc: "Navigasi panel yang jelas",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/8 bg-black/15 p-4"
                  >
                    <p className="text-sm font-semibold text-[var(--white)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="rounded-[2rem] border border-white/10 bg-[rgba(26,36,51,0.92)] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div className="mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--gold-light)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin login
              </div>
              <h2 className="font-[var(--font-display)] text-3xl text-[var(--white)]">
                Selamat datang kembali
              </h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Gunakan kredensial admin untuk melanjutkan ke dashboard.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
                {errorMessage}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--white)]">
                  Email admin
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition-colors focus-within:border-[var(--gold)]/50">
                  <User className="h-5 w-5 text-[var(--gold-light)]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@agilrent.com"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent text-sm text-[var(--white)] outline-none placeholder:text-[color:rgba(167,176,190,0.75)]"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--white)]">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition-colors focus-within:border-[var(--gold)]/50">
                  <Lock className="h-5 w-5 text-[var(--gold-light)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent text-sm text-[var(--white)] outline-none placeholder:text-[color:rgba(167,176,190,0.75)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-[var(--muted)] transition-colors hover:text-[var(--white)]"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-[var(--gold)] focus:ring-[var(--gold)]"
                  />
                  Ingat saya
                </label>

                <a
                  href="#"
                  className="text-[var(--gold-light)] transition-colors hover:text-[var(--gold)]"
                >
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--gold)] px-5 py-3.5 text-sm font-semibold text-[#0F1722] transition-all hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Memproses..." : "Masuk ke dashboard"}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-[var(--muted)]">
              Pastikan hanya staf yang berwenang yang memiliki akses ke halaman
              ini.
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}