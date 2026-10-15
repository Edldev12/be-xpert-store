"use client";

import {
  BarChart3,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Categories", icon: BarChart3, href: "/admin/categories" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Analytics", icon: TrendingUp, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentPage =
    navigation.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href ||
        pathname.startsWith(`${item.href}/`),
    )?.label ?? "Dashboard";

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-x-hidden bg-slate-950 text-white transition-all duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "w-20" : "w-64"
          } lg:translate-x-0`}
      >
        <div
          className={`flex h-20 shrink-0 items-center border-b border-white/10 ${sidebarCollapsed
            ? "justify-center px-2"
            : "justify-between px-5"
            }`}
        >
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-wide">
                BE-XPERT<span className="text-indigo-400">.</span>
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Administration
              </p>
            </div>
          )}

          {sidebarCollapsed && (
            <span className="text-2xl font-bold text-indigo-400">
              B
            </span>
          )}

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`flex shrink-0 px-3 pt-3 ${sidebarCollapsed ? "justify-center" : "justify-end"
            }`}
        >
          <button
            onClick={() =>
              setSidebarCollapsed((collapsed) => !collapsed)
            }
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="hidden rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:block"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        </div>

        <nav
          className={`flex-1 space-y-1 overflow-y-auto py-5 ${sidebarCollapsed ? "px-2" : "px-4"
            }`}
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                onClick={() => setSidebarOpen(false)}
                className={`flex min-h-11 w-full items-center rounded-xl py-3 text-sm font-medium transition ${sidebarCollapsed
                  ? "justify-center px-2"
                  : "gap-3 px-3"
                  } ${active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon size={20} className="shrink-0" />

                {!sidebarCollapsed && (
                  <span className="flex-1">{item.label}</span>
                )}

                {active && !sidebarCollapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={`shrink-0 border-t border-white/10 ${sidebarCollapsed ? "p-2" : "p-4"
            }`}
        >
          <div
            className={`flex items-center rounded-xl bg-white/5 p-3 ${sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold">
              A
            </div>

            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    Administrator
                  </p>
                  <p className="text-xs text-slate-400">
                    Store management
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className="shrink-0 text-slate-400"
                />
              </>
            )}
          </div>
        </div>
      </aside>

      <div
        className={`min-h-screen w-full transition-[padding] duration-200 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
      >
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Workspace / Admin
              </p>
              <h2 className="truncate text-lg font-bold">
                {currentPage}
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-50"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </header>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
