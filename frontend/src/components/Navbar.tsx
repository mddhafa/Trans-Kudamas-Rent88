"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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

      const heroSection = document.querySelector(
        ".hero-carousel-section"
      ) as HTMLElement;

      const fleetSection = document.querySelector(
        ".fleet-section"
      ) as HTMLElement;

      const bookingHeader = document.querySelector(
        ".booking-header-section"
      ) as HTMLElement;

      const carsHeader = document.querySelector(
        ".cars-header-section"
      ) as HTMLElement;

      const aboutHeader = document.querySelector(
        ".about-header-section"
      ) as HTMLElement;

      const contactHeader = document.querySelector(
        ".contact-header-section"
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
      }

      if (
        (bookingHeader &&
          scrollY < bookingHeader.offsetHeight) ||
        (carsHeader &&
          scrollY < carsHeader.offsetHeight) ||
        (aboutHeader &&
          scrollY < aboutHeader.offsetHeight) ||
        (contactHeader &&
          scrollY < contactHeader.offsetHeight)
      ) {
        isDark = true;
      }

      setIsDarkSection(isDark);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path;

  const getNavbarStyles = () => {
    if (isDarkSection) {
      return {
        bg: isScrolled
          ? "bg-[#0f172acc] backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent",
        text: "text-white/85 hover:text-[#d4af37]",
        active: "text-[#d4af37]",
        logoShadow: true,
      };
    }

    if (isScrolled) {
      return {
        bg: "bg-white/75 backdrop-blur-xl border-b border-black/5 shadow-sm",
        text: "text-gray-700 hover:text-[#d4af37]",
        active: "text-[#d4af37]",
        logoShadow: false,
      };
    }

    return {
      bg: "bg-transparent",
      text: "text-gray-700 hover:text-[#d4af37]",
      active: "text-[#d4af37]",
      logoShadow: false,
    };
  };

  const navStyles = getNavbarStyles();

  const navItems = [
    {
      name: "Beranda",
      path: "/",
    },
    {
      name: "Armada",
      path: "/armada",
    },
    {
      name: "Tentang Kami",
      path: "/tentang",
    },
    {
      name: "Kontak",
      path: "/kontak",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${navStyles.bg}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

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
              src="/imports/logofix.png"
              alt="AGIL RENT"
              className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 ${
                navStyles.logoShadow
                  ? "drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                  : ""
              }`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">

            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-sm pb-1 transition-all duration-300 group ${
                  isActive(item.path)
                    ? navStyles.active
                    : navStyles.text
                }`}
              >
                {item.name}

                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#d4af37] transition-all duration-300 ${
                    isActive(item.path)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() =>
              setIsMobileMenuOpen(
                !isMobileMenuOpen
              )
            }
            className={`md:hidden transition-colors duration-300 ${
              isDarkSection
                ? "text-white"
                : "text-gray-700"
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
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen
              ? "max-h-[400px] opacity-100 pb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2 pt-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-3">

            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-[#d4af37]/15 text-[#d4af37]"
                    : isDarkSection
                    ? "text-white/80 hover:bg-white/10"
                    : "text-gray-700 hover:bg-black/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}