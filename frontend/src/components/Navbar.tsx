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

      if (pathname === "/") {
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
        }
      }

      if (pathname === "/armada") {
        const carsHeader = document.querySelector(
          ".cars-header-section"
        ) as HTMLElement;

        isDark = !!(carsHeader && scrollY < carsHeader.offsetHeight);
      }

      if (pathname.startsWith("/booking/")) {
        const bookingHeader = document.querySelector(
          ".booking-header-section"
        ) as HTMLElement;

        isDark = !!(bookingHeader && scrollY < bookingHeader.offsetHeight);
      }

      if (pathname === "/tentang") {
        const aboutHeader = document.querySelector(
          ".about-header-section"
        ) as HTMLElement;

        isDark = !!(aboutHeader && scrollY < aboutHeader.offsetHeight);
      }

      if (pathname === "/kontak") {
        const contactHeader = document.querySelector(
          ".contact-header-section"
        ) as HTMLElement;

        isDark = !!(contactHeader && scrollY < contactHeader.offsetHeight);
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
          ? "bg-primary/20 backdrop-blur-lg border-b border-white/10 shadow-lg"
          : "bg-transparent",
        text: "text-white/90 hover:text-gold",
        active: "text-gold",
        logoShadow: true,
        mobileButton: "text-white",
        mobileMenu:
          "bg-primary/20 backdrop-blur-xl border border-white/10 shadow-lg",
        mobileText: "text-white/85 hover:bg-white/10 hover:text-gold",
        mobileActive: "bg-gold/15 text-gold",
      };
    }

    if (isScrolled) {
      return {
        bg: "bg-white/20 backdrop-blur-lg border-b border-border/20 shadow-sm",
        text: "text-foreground/70 hover:text-gold",
        active: "text-gold",
        logoShadow: false,
        mobileButton: "text-foreground",
        mobileMenu:
          "bg-white/80 backdrop-blur-xl border border-border/20 shadow-lg",
        mobileText: "text-foreground/70 hover:bg-black/5 hover:text-gold",
        mobileActive: "bg-gold/10 text-gold",
      };
    }

    return {
      bg: "bg-transparent",
      text: "text-foreground/70 hover:text-gold",
      active: "text-gold",
      logoShadow: false,
      mobileButton: "text-foreground",
      mobileMenu:
        "bg-white/80 backdrop-blur-xl border border-border/20 shadow-lg",
      mobileText: "text-foreground/70 hover:bg-black/5 hover:text-gold",
      mobileActive: "bg-gold/10 text-gold",
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
                  ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
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
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden transition-colors duration-300 ${navStyles.mobileButton}`}
            aria-label="Toggle menu"
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
          <div
            className={`flex flex-col gap-2 pt-4 rounded-2xl p-3 ${navStyles.mobileMenu}`}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  isActive(item.path)
                    ? navStyles.mobileActive
                    : navStyles.mobileText
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