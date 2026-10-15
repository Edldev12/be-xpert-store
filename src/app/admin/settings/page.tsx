"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Settings } from "lucide-react";

interface StoreSettings {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  description: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Edl-Store",
  email: "support@bexpert.com",
  phone: "+251 911 000 000",
  currency: "USD",
  description: "Your trusted online shopping destination.",
};

const SETTINGS_STORAGE_KEY = "be-xpert-store-settings";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400";

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<StoreSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let loadedSettings: StoreSettings = DEFAULT_SETTINGS;

      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

        if (storedSettings) {
          const parsed: unknown = JSON.parse(storedSettings);

          if (
            typeof parsed === "object" &&
            parsed !== null &&
            !Array.isArray(parsed)
          ) {
            const values = parsed as Partial<StoreSettings>;

            loadedSettings = {
              storeName:
                typeof values.storeName === "string"
                  ? values.storeName
                  : DEFAULT_SETTINGS.storeName,
              email:
                typeof values.email === "string"
                  ? values.email
                  : DEFAULT_SETTINGS.email,
              phone:
                typeof values.phone === "string"
                  ? values.phone
                  : DEFAULT_SETTINGS.phone,
              currency:
                typeof values.currency === "string" &&
                  ["USD", "ETB", "EUR", "GBP"].includes(values.currency)
                  ? values.currency
                  : DEFAULT_SETTINGS.currency,
              description:
                typeof values.description === "string"
                  ? values.description
                  : DEFAULT_SETTINGS.description,
            };
          }
        }
      } catch {
        console.error("Could not load saved store settings.");
      }

      setSettings(loadedSettings);
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleChange(field: keyof StoreSettings, value: string) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
      );
      setSaved(true);
    } catch {
      setSaved(false);
      alert("Unable to save settings in this browser.");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        Loading store settings...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Manage your basic store information.
            </p>
          </div>
        </div>

        {saved && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            Settings saved successfully in this browser.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div>
            <label
              htmlFor="storeName"
              className="mb-2 block text-sm font-medium"
            >
              Store Name
            </label>
            <input
              id="storeName"
              required
              value={settings.storeName}
              onChange={(event) =>
                handleChange("storeName", event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Support Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={settings.email}
              onChange={(event) =>
                handleChange("email", event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Contact Phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={settings.phone}
              onChange={(event) =>
                handleChange("phone", event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="mb-2 block text-sm font-medium"
            >
              Store Currency
            </label>
            <select
              id="currency"
              value={settings.currency}
              onChange={(event) =>
                handleChange("currency", event.target.value)
              }
              className={inputClass}
            >
              <option value="USD">USD — US Dollar</option>
              <option value="ETB">ETB — Ethiopian Birr</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Store Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={settings.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              className={`${inputClass} resize-y`}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Save className="h-5 w-5" />
            Save Settings
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          These settings are saved in this browser only. They are not yet
          synchronized with your database or other users.
        </p>
      </div>
    </main>
  );
}