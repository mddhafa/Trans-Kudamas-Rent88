"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./FleetSection";
import { Navbar } from "@/src/components/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className={isAdminRoute ? "min-h-full flex flex-col" : "min-h-full flex flex-col pt-20"}>
        {children}
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}
