"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, User, LogOut, ArrowLeft, Camera, Calendar, ShieldCheck } from "lucide-react";
import { Sidebar } from "@/src/components/SideBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    type: "success",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("admin_token");
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
    setSnackbar({ show: true, type, message });
    setTimeout(() => {
      setSnackbar({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
        <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
          <aside className="w-full shrink-0 lg:w-auto">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          </aside>

          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-[#d4af37] rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-[#1e3a5f]">Loading profile...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
      <div className="flex min-h-screen w-full flex-col gap-4 px-3 py-3 lg:flex-row lg:px-4 lg:py-4">
        <aside className="w-full shrink-0 lg:w-auto">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          {/* Snackbar */}
          {snackbar.show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl p-4 shadow-lg ${
                snackbar.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {snackbar.message}
            </motion.div>
          )}

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-[#edf2f8] transition-colors"
                >
                  <ArrowLeft size={24} className="text-[#1e3a5f]" />
                </button>
                <h1 className="text-3xl font-bold text-[#1e3a5f]">My Profile</h1>
              </div>
            </div>
          </motion.header>

          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] p-8 shadow-[0_12px_40px_rgba(30,58,95,0.18)] ring-1 ring-white/10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#d4af37] flex items-center justify-center">
                  <User size={48} className="text-[#1e3a5f]" />
                </div>
                {/* <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[#d4af37] hover:bg-[#e6c547] transition-colors shadow-lg">
                  <Camera size={16} className="text-[#1e3a5f]" />
                </button> */}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">{admin?.username}</h2>
                <p className="text-white/40 text-xs mt-2">Administrator</p>
                <p className="text-white/60 text-xs mt-3">
                  Bergabung: {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString("id-ID") : "-"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-white/92 p-8 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-6">Informasi Profile</h3>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    <User size={16} className="inline mr-2" />
                    Username
                  </label>
                  <div className="px-4 py-3 rounded-2xl bg-[#f5f8fc] border-2 border-[#d8e1ee] text-[#1e3a5f]">
                    {admin?.username || "-"}
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Bergabung Sejak
                  </label>
                  <div className="px-4 py-3 rounded-2xl bg-[#f5f8fc] border-2 border-[#d8e1ee] text-[#1e3a5f]">
                    {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString("id-ID", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    }) : "-"}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    <ShieldCheck size={16} className="inline mr-2" />
                    Role
                  </label>
                  <div className="px-4 py-3 rounded-2xl bg-[#f5f8fc] border-2 border-[#d8e1ee] text-[#1e3a5f]">
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={handleLogout}
            className="w-full rounded-3xl bg-red-600 hover:bg-red-700 text-white p-4 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_12px_40px_rgba(220,38,38,0.15)]"
          >
            <LogOut size={20} />
            Logout
          </motion.button>

          {/* Bottom Spacing */}
          <div className="pb-8" />
        </div>
      </div>
    </main>
  );
}
