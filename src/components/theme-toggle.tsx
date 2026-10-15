"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const buttonClass = (active: boolean) =>
    `rounded-lg p-2 transition ${active
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        title="Light theme"
        className={buttonClass(mounted && theme === "light")}
      >
        <Sun size={18} />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
        title="Dark theme"
        className={buttonClass(mounted && theme === "dark")}
      >
        <Moon size={18} />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="System theme"
        title="System theme"
        className={buttonClass(mounted && theme === "system")}
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}