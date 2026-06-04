"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  ArrowLeft,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminProfile = {
  id: number;
  username: string;
  createdAt: string;
};

type SnackbarState = {
  show: boolean;
  type: "success" | "error";
  message: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("profile");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data profile");
      }

      const result = await response.json();
      setAdmin(result.data);
    } catch (error) {
      showSnackbar("error", "Gagal memuat profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (type: "success" | "error", message: string) => {
    setSnackbar({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setSnackbar({
        show: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
        <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
          <aside>
            <Sidebar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
            />
          </aside>

          <div
            className={`min-w-0 space-y-5 transition-all duration-300 ease-out ${
              sidebarOpen ? "lg:ml-[17.5rem]" : "lg:ml-0"
            }`}
          >
            <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#1e3a5f] border-t-[#d4af37]" />

                <p className="mt-4 text-sm font-medium text-[#1e3a5f]">
                  Loading profile...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
        <aside>
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </aside>

        <div
          className={`min-w-0 space-y-5 transition-all duration-300 ease-out ${
            sidebarOpen ? "lg:ml-[17.5rem]" : "lg:ml-0"
          }`}
        >
          {/* Snackbar */}
          {snackbar.show && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className={`rounded-2xl p-4 text-sm shadow-lg ring-1 ${
                snackbar.type === "success"
                  ? "bg-green-50 text-green-700 ring-green-200"
                  : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              {snackbar.message}
            </motion.div>
          )}

          {/* Header */}
          <motion.header
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6"
          >
            <div className="flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc] text-[#1e3a5f] ring-1 ring-[#d8e1ee] transition-colors hover:bg-white"
                  aria-label="Kembali"
                >
                  <ArrowLeft size={20} />
                </button>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f] sm:text-3xl">
                    Profile Admin
                  </h1>

                  <p className="mt-1 text-sm text-[#64748b]">
                    Informasi akun administrator yang sedang aktif.
                  </p>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Profile Hero Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] p-5 shadow-[0_12px_40px_rgba(30,58,95,0.18)] ring-1 ring-white/10 sm:p-8"
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#d4af37] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <User size={48} className="text-[#1e3a5f]" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#d4af37] ring-1 ring-white/10">
                  Administrator
                </p>

                <h2 className="text-2xl font-bold text-white">
                  {admin?.username || "Admin"}
                </h2>

                <p className="mt-3 text-sm text-white/70">
                  Bergabung sejak{" "}
                  {admin?.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6"
          >
            <div className="mb-6 border-b border-[#e2e8f0] pb-5">
              <h3 className="text-lg font-semibold text-[#1e3a5f]">
                Informasi Profile
              </h3>

              <p className="mt-1 text-sm text-[#64748b]">
                Data akun admin yang digunakan untuk mengakses dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Username */}
              <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                <label className="flex items-center gap-2 text-sm font-medium text-[#1e3a5f]">
                  <User size={16} className="text-[#d4af37]" />
                  Username
                </label>

                <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee]">
                  {admin?.username || "-"}
                </div>
              </div>

              {/* Member Since */}
              <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                <label className="flex items-center gap-2 text-sm font-medium text-[#1e3a5f]">
                  <Calendar size={16} className="text-[#d4af37]" />
                  Bergabung Sejak
                </label>

                <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-medium leading-6 text-[#1e3a5f] ring-1 ring-[#d8e1ee]">
                  {formatDate(admin?.createdAt)}
                </div>
              </div>

              {/* Role */}
              <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e1ee]/60">
                <label className="flex items-center gap-2 text-sm font-medium text-[#1e3a5f]">
                  <ShieldCheck size={16} className="text-[#d4af37]" />
                  Role
                </label>

                <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#1e3a5f] ring-1 ring-[#d8e1ee]">
                  Administrator
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="rounded-3xl bg-white/92 p-4 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a5f]">
                  Keluar dari Dashboard
                </h3>

                <p className="mt-1 text-sm text-[#64748b]">
                  Akhiri sesi admin dan kembali ke halaman login.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.15)] transition-colors hover:bg-red-700 sm:w-auto"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>

          <div className="pb-8" />
        </div>
      </div>
    </main>
  );
}