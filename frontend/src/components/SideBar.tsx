'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Car, Calendar, MessageSquare, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type AdminProfile = {
  id: number;
  username: string;
  createdAt: string;
};

export function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if screen is desktop size
    const isLgScreen = window.innerWidth >= 1024;
    setIsDesktop(isLgScreen);
    setIsOpen(isLgScreen); // Open on desktop, close on mobile

    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      setIsOpen(newIsDesktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'katalog', label: 'Katalog Mobil', icon: Car },
    { id: 'pemesanan', label: 'Pemesanan', icon: Calendar },
    { id: 'laporan', label: 'Laporan', icon: LayoutDashboard },
    // { id: 'ulasan', label: 'Ulasan', icon: MessageSquare },
    // { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);

    if (!isDesktop) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button - Visible on mobile */}
      <div className="sticky top-4 left-4 z-50 flex items-center lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] transition-colors shadow-lg"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => {
            if (!isDesktop) {
              setIsOpen(false);
            }
          }}
        />
      )}

      {/* Floating chevron to open sidebar when collapsed (desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed left-0 top-1/2 z-50 -translate-y-1/2 p-2 rounded-r-lg bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] transition-colors shadow-lg"
          aria-label="Open sidebar"
        >
          <ChevronRight size={18} className="text-[#d4af37]" />
        </button>
      )}

      {/* Desktop toggle moved inside sidebar header for better layout */}

      {/* Sidebar */}
      <div
      className={`flex flex-col overflow-hidden bg-[#1e3a5f] shadow-[0_12px_40px_rgba(30,58,95,0.18)] ring-1 ring-white/10 transition-all duration-300 ease-out

      fixed left-0 top-0 bottom-0 z-40 w-64 min-h-screen rounded-none

      lg:fixed lg:left-4 lg:top-4 lg:bottom-4 lg:h-[calc(100vh-2rem)] lg:min-h-0 lg:rounded-3xl ${
        isOpen
          ? "translate-x-0 lg:w-64"
          : "-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:pointer-events-none"
      }`}
    >
      <div className="border-b border-[#2d4a6f] p-5 lg:p-6 mt-16 lg:mt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#d4af37] tracking-wide">Premium Car Rental</h1>
            <p className="text-white/60 text-sm mt-1">Admin Dashboard</p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:inline-flex items-center justify-center p-2 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] transition-colors shadow"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={18} className="text-[#d4af37]" /> : <ChevronRight size={18} className="text-[#d4af37]" />}
          </button>
        </div>
      </div>

      <Link
      href="/admin/profile"
      onClick={() => {
        if (!isDesktop) {
          setIsOpen(false);
        }
      }}
      className="border-b border-[#2d4a6f] p-4 lg:p-5 hover:bg-[#2d4a6f]/50 transition-colors cursor-pointer"
    >
        <div className="flex items-center gap-3">
          <User size={48} className="text-[#d4af37]" />
          <div>
            <p className="text-white">{admin?.username || 'Admin'}</p>
            <p className="text-white/60 text-xs">Administrator</p>
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          const hrefFor = (id: string) => {
            if (id === 'katalog') return '/admin/catalog';
            if (id === 'pemesanan') return '/admin/pemesanan';
            if (id === 'laporan') return '/admin/laporan/bulanan';
            return '/admin/dashboard';
          };

          // common classes for links/buttons
          const baseClass = `mb-2 relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all text-white/80 hover:bg-[#2d4a6f] hover:text-white`;
          const activeClass = `mb-2 relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all bg-white text-[#1e3a5f]`;

          if (item.id === 'katalog' || item.id === 'dashboard' || item.id === 'pemesanan' || item.id === 'laporan') {
            const href = hrefFor(item.id);

            return (
              <Link
                href={href}
                key={item.id}
                onClick={() => {
                  if (!isDesktop) {
                    setIsOpen(false);
                  }
                }}
                className={isActive ? activeClass : baseClass}
              >
                <span className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${isActive ? 'bg-[#d4af37]' : 'bg-transparent'}`} />
                <Icon size={18} className={isActive ? 'text-[#d4af37]' : undefined} />
                <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={isActive ? activeClass : baseClass}
            >
              <span className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${isActive ? 'bg-[#d4af37]' : 'bg-transparent'}`} />
              <Icon size={18} className={isActive ? 'text-[#d4af37]' : undefined} />
              <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[#2d4a6f] p-3 lg:p-4">
        <button
          onClick={() => {
            localStorage.removeItem('admin_token');
            router.push('/admin/login');
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/80 transition-all hover:bg-red-600/30 hover:text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}
