
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

interface EscuelaUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

function isEscuelaUser(value: unknown): value is EscuelaUser {
  if (!value || typeof value !== "object") return false;

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.email === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const name =
      typeof data.name === "string" ? data.name.trim() : "";
    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";
    const password =
      typeof data.password === "string" ? data.password : "";

    if (
      !name ||
      name.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 6 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, and password." },
        { status: 400 }
      );
    }

    // Check whether the email already exists in EscuelaJS.
    const checkResponse = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: "Could not verify email availability. Try again." },
        { status: 502 }
      );
    }

    const existingUsers: unknown = await checkResponse.json();

    if (!Array.isArray(existingUsers)) {
      return NextResponse.json(
        { error: "Unexpected response from the registration provider." },
        { status: 502 }
      );
    }

    const emailExists = existingUsers.some(
      (user: unknown) =>
        !!user &&
        typeof user === "object" &&
        "email" in user &&
        typeof user.email === "string" &&
        user.email.trim().toLowerCase() === email
    );


    if (emailExists) {
      return NextResponse.json(
        {
          error:
            "This email already exists in EscuelaJS. The customer record in Supabase must be synchronized separately.",
        },
        { status: 409 }
      );
    }


    // Create the account with EscuelaJS.
    const registrationResponse = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: data.phone && typeof data.phone === "string" ? data.phone.trim() : "",
        password,
        avatar: "https://i.imgur.com/4ZQZ4WR.jpeg",
      }),
      cache: "no-store",
    });

    const registrationData: unknown = await registrationResponse
      .json()
      .catch(() => null);

    if (!registrationResponse.ok) {
      const message =
        registrationData &&
          typeof registrationData === "object" &&
          "message" in registrationData
          ? registrationData.message
          : null;

      return NextResponse.json(
        {
          error:
            typeof message === "string"
              ? message
              : "Registration failed. Please try again.",
        },
        { status: registrationResponse.status }
      );
    }

    if (!isEscuelaUser(registrationData)) {
      return NextResponse.json(
        {
          error:
            "The account may have been created, but its customer record could not be verified. Contact support before retrying.",
        },
        { status: 502 }
      );
    }

    // Save only non-sensitive customer details in Supabase.

    const phone =
      typeof registrationData.phone === "string" &&
        registrationData.phone.trim()
        ? registrationData.phone.trim()
        : typeof data.phone === "string"
          ? data.phone.trim()
          : "";

    const { error: databaseError } = await supabaseAdmin
      .from("customers")
      .upsert(
        {
          external_user_id: registrationData.id,
          name: registrationData.name,
          email: registrationData.email.toLowerCase(),
          phone,
          role: "customer",
          status: "Active",
        },
        { onConflict: "external_user_id" }
      );
    if (databaseError) {
      console.error("Customer record sync failed:", databaseError);

      return NextResponse.json(
        {
          error:
            "Your account was created, but saving your customer profile failed. Please contact support.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful.",
        user: {
          id: registrationData.id,
          name: registrationData.name,
          email: registrationData.email,
          phone:
            typeof registrationData.phone === "string"
              ? registrationData.phone
              : typeof data.phone === "string"
                ? data.phone.trim()
                : "",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
