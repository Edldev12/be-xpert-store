"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && <SiteHeader />}

      <main
        className={`flex - 1 ${isAdminPage ? "" : "pb-20 md:pb-0"
          } `}
      >
        {children}
      </main>

      {!isAdminPage && <SiteFooter />}
    </div>
  );
}
