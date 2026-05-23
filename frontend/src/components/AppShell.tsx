"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./FleetSection";
import { Navbar } from "@/src/components/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen bg-background">
      
      {/* Navbar */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content */}
      <main className="relative flex min-h-screen flex-col">
        {children}
      </main>

      {/* Footer */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}