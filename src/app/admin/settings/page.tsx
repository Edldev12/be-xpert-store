
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

  function handleChange(
    field: keyof StoreSettings,
    value: string,
  ) {
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
    return <p className="p-6">Loading store settings...</p>;
  }
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <p className="mt-2 text-gray-500">
              Manage your basic store information.
            </p>
          </div>
        </div>

        {saved && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            Settings saved successfully in this browser.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            Save Settings
          </button>
        </form>
      </div>
    </main>
  );
}
