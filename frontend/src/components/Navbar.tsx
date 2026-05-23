"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navbarHeight = 80;

      setIsScrolled(scrollY > 20);

      let isDark = false;

      if (pathname === "/" || pathname.startsWith("/")) {
        const heroSection = document.querySelector(
          ".hero-carousel-section"
        ) as HTMLElement;

        const fleetSection = document.querySelector(
          ".fleet-section"
        ) as HTMLElement;

        if (heroSection && scrollY < heroSection.offsetHeight) {
          isDark = true;
        } else if (
          fleetSection &&
          scrollY >= fleetSection.offsetTop - navbarHeight &&
          scrollY <
            fleetSection.offsetTop +
              fleetSection.offsetHeight -
              navbarHeight
        ) {
          isDark = true;
        } else {
          isDark = false;
        }
      }

      const headerSection = document.querySelector(
        ".booking-header-section"
      ) as HTMLElement;
      if (headerSection && scrollY < headerSection.offsetHeight) {
        isDark = true;
      }

      const carsHeaderSection = document.querySelector(
        ".cars-header-section"
      ) as HTMLElement;
      if (carsHeaderSection && scrollY < carsHeaderSection.offsetHeight) {
        isDark = true;
      }

      const contactHeaderSection = document.querySelector(
        ".contact-header-section"
      ) as HTMLElement;
      if (contactHeaderSection && scrollY < contactHeaderSection.offsetHeight) {
        isDark = true;
      }

      const aboutHeaderSection = document.querySelector(
        ".about-header-section"
      ) as HTMLElement;
      if (aboutHeaderSection && scrollY < aboutHeaderSection.offsetHeight) {
        isDark = true;
      }

      setIsDarkSection(isDark);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const getNavbarStyles = () => {
    if (isDarkSection) {
      return {
        bg: isScrolled
          ? "bg-[#1e3a5f]/20 backdrop-blur-lg border-b border-white/10 shadow-lg"
          : "bg-transparent",
        text: "text-white/90 hover:text-[#d4af37]",
        active: "text-[#d4af37]",
      };
    }

    if (isScrolled) {
      return {
        bg: "bg-white/20 backdrop-blur-lg border-b border-gray-200/20 shadow-sm",
        text: "text-gray-700/70 hover:text-[#d4af37]",
        active: "text-[#d4af37]",
      };
    }

    return {
      bg: "bg-transparent",
      text: "text-gray-700/70 hover:text-[#d4af37]",
      active: "text-[#d4af37]",
    };
  };

  const navStyles = getNavbarStyles();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${navStyles.bg}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Navbar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center"
          >
            <img
              src="imports/logofix.png"
              alt="AGIL RENT"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className={`text-sm relative group pb-1 transition-colors ${
                isActive("/") ? navStyles.active : navStyles.text
              }`}
            >
              Beranda
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#d4af37] transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>


            <Link
              href="/armada"
              className={`text-sm relative group pb-1 transition-colors ${
                isActive("/armada") ? navStyles.active : navStyles.text
              }`}
            >
              Armada
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#d4af37] transition-all duration-300 w-0 group-hover:w-full`}
              />
            </Link>

            <Link
              href="/tentang"
              className={`text-sm relative group pb-1 transition-colors ${
                isActive("/tentang") ? navStyles.active : navStyles.text
              }`}
            >
              Tentang Kami
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#d4af37] transition-all duration-300 w-0 group-hover:w-full`}
              />
            </Link>

            <Link
              href="/kontak"
              className={`text-sm relative group pb-1 transition-colors ${
                isActive("/kontak") ? navStyles.active : navStyles.text
              }`}
            >
              Kontak
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#d4af37] transition-all duration-300 w-0 group-hover:w-full`}
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden transition-colors ${
              isDarkSection ? "text-white" : "text-gray-700"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 z-[9999] pointer-events-auto">
            <Link
              href="/"
              className={`block px-4 py-2 rounded-lg transition-colors pointer-events-auto ${ navStyles.text } ${
                isActive("/")
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-gray-700 hover:bg-gray-100/20"
                }`}
            >
              Beranda
            </Link>

            <Link
              href="/armada"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors pointer-events-auto ${navStyles.text} ${
                isActive("/armada")
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-gray-700 hover:bg-gray-100/20"
                }`}
            >
              Armada
            </Link>

            <Link
              href="/tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors pointer-events-auto ${navStyles.text} ${
                isActive("/tentang")
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-gray-700 hover:bg-gray-100/20"
                }`}
            >
              Tentang Kami
            </Link>

            <Link
              href="/kontak"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors pointer-events-auto ${navStyles.text} ${
                isActive("/kontak")
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-gray-700 hover:bg-gray-100/20"
                }`}
            >
              Kontak
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
