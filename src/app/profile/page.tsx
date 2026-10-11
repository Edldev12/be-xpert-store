"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Pencil,
  RotateCcw,
  LogOut,
  ShoppingBag,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.escuelajs.co/api/v1";

const DEFAULT_AVATAR = "/images/avatar.jpg";

type UserProfile = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [savedAvatar, setSavedAvatar] = useState(DEFAULT_AVATAR);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const token = sessionStorage.getItem("be-xpert-access-token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("be-xpert-access-token");
            sessionStorage.removeItem("be-xpert-refresh-token");
            router.replace("/login");
            return;
          }

          throw new Error("Could not load your profile.");
        }

        const user: UserProfile = await response.json();
        setProfile(user);

        const storageKey = `be-xpert-avatar-url:${user.id ?? user.email ?? "customer"
          }`;

        const browserAvatar = localStorage.getItem(storageKey);
        const initialAvatar = browserAvatar || DEFAULT_AVATAR;

        setAvatarUrl(initialAvatar);
        setSavedAvatar(initialAvatar);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function getStorageKey() {
    if (!profile) return null;

    return `be-xpert-avatar-url:${profile.id ?? profile.email ?? "customer"
      }`;
  }

  function isValidImageAddress(value: string) {
    const trimmed = value.trim();

    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      return true;
    }

    try {
      const url = new URL(trimmed);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  function saveAvatar() {
    const trimmedUrl = avatarUrl.trim();
    const storageKey = getStorageKey();

    setMessage("");

    if (!storageKey) {
      setMessage("Your profile has not loaded yet.");
      return;
    }

    if (!isValidImageAddress(trimmedUrl)) {
      setMessage(
        "Please enter a valid local image path or HTTP/HTTPS image URL."
      );
      return;
    }

    if (previewError) {
      setMessage("The image could not be loaded. Please check the URL.");
      return;
    }

    setSaving(true);

    try {
      localStorage.setItem(storageKey, trimmedUrl);

      setSavedAvatar(trimmedUrl);
      setAvatarUrl(trimmedUrl);
      setPreviewError(false);
      setMessage("Avatar saved successfully in this browser!");
      setIsEditingAvatar(false);

      window.dispatchEvent(new Event("auth-change"));
    } catch {
      setMessage("Could not save your avatar in this browser.");
    } finally {
      setSaving(false);
    }
  }

  function resetAvatar() {
    const storageKey = getStorageKey();

    if (!storageKey) {
      setMessage("Your profile has not loaded yet.");
      return;
    }

    try {
      localStorage.removeItem(storageKey);

      setAvatarUrl(DEFAULT_AVATAR);
      setSavedAvatar(DEFAULT_AVATAR);
      setPreviewError(false);
      setMessage("Avatar reset to your default profile image.");
      setIsEditingAvatar(false);

      window.dispatchEvent(new Event("auth-change"));
    } catch {
      setMessage("Could not reset your avatar.");
    }
  }

  function cancelAvatarEdit() {
    setAvatarUrl(savedAvatar);
    setPreviewError(false);
    setMessage("");
    setIsEditingAvatar(false);
  }

  function logout() {
    sessionStorage.removeItem("be-xpert-access-token");
    sessionStorage.removeItem("be-xpert-refresh-token");

    window.dispatchEvent(new Event("auth-change"));
    router.replace("/login");
  }

  const isErrorMessage =
    message.toLowerCase().includes("could not") ||
    message.toLowerCase().includes("valid") ||
    message.toLowerCase().includes("error") ||
    message.toLowerCase().includes("unable") ||
    message.toLowerCase().includes("check the url");

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p role="status">
          {message || "Unable to load your profile."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">My Account</h1>

      <section className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="relative h-28 w-28 shrink-0">
            <Image
              key={savedAvatar}
              src={savedAvatar}
              alt="Customer avatar"
              width={112}
              height={112}
              priority
              unoptimized
              onError={() => {
                if (savedAvatar !== DEFAULT_AVATAR) {
                  setSavedAvatar(DEFAULT_AVATAR);
                }
              }}
              className="h-28 w-28 rounded-full border border-gray-300 object-cover"
            />

            <button
              type="button"
              onClick={() => {
                if (isEditingAvatar) {
                  cancelAvatarEdit();
                } else {
                  setAvatarUrl(savedAvatar);
                  setMessage("");
                  setPreviewError(false);
                  setIsEditingAvatar(true);
                }
              }}
              aria-label={
                isEditingAvatar
                  ? "Close avatar editor"
                  : "Edit profile picture"
              }
              title={
                isEditingAvatar
                  ? "Close avatar editor"
                  : "Edit profile picture"
              }
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
            >
              {isEditingAvatar ? <X size={17} /> : <Pencil size={17} />}
            </button>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">
              {profile.name || "Customer"}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-500">
              {profile.email || "No email available"}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Manage your account and profile picture.
            </p>
          </div>
        </div>

        {isEditingAvatar && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h2 className="mb-2 text-xl font-semibold">
              Change Profile Picture
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              Enter a local image path or paste an image URL.
            </p>

            <label
              htmlFor="avatar-url"
              className="mb-2 block text-sm font-medium"
            >
              Avatar URL
            </label>

            <input
              id="avatar-url"
              type="text"
              value={avatarUrl}
              onChange={(event) => {
                setAvatarUrl(event.target.value);
                setPreviewError(false);
                setMessage("");
              }}
              placeholder="https://example.com/avatar.jpg"
              autoComplete="url"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            {avatarUrl.trim() && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Preview</p>

                {!previewError ? (
                  <Image
                    key={avatarUrl.trim()}
                    src={avatarUrl.trim()}
                    alt="New avatar preview"
                    width={80}
                    height={80}
                    unoptimized
                    onError={() => setPreviewError(true)}
                    onLoad={() => setPreviewError(false)}
                    className="h-20 w-20 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <p className="text-sm text-red-500">
                    This image could not be loaded. Check the URL or choose
                    another image.
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveAvatar}
                disabled={
                  saving ||
                  previewError ||
                  !avatarUrl.trim() ||
                  !isValidImageAddress(avatarUrl)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil size={16} />
                {saving ? "Saving..." : "Save Avatar"}
              </button>

              <button
                type="button"
                onClick={resetAvatar}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                <RotateCcw size={16} />
                Reset Avatar
              </button>

              <button
                type="button"
                onClick={cancelAvatarEdit}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>

            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm ${isErrorMessage ? "text-red-500" : "text-green-600"
                }`}
            >
              {message}
            </p>

            <p className="mt-5 text-xs text-gray-500">
              Avatar changes are saved in this browser only. They do not
              update your server-side profile or sync to other devices.
            </p>
          </div>
        )}

        {!isEditingAvatar && message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm ${isErrorMessage ? "text-red-500" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <ShoppingBag size={18} />
          Browse Products
        </button>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </main>
  );
}