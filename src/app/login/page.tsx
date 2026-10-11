"use client";

import { Suspense } from "react";
import LoginFormContent from "./LoginFormContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
          <p className="w-full text-center text-muted-foreground">
            Loading login page...
          </p>
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}