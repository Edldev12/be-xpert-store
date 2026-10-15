
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

export async function POST(request: Request) {
  await connection();

  try {
    // Verify administrator access.
    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Your session is invalid. Please log in again." },
        { status: 401 }
      );
    }

    const profile: unknown = await profileResponse.json();

    if (
      !profile ||
      typeof profile !== "object" ||
      !("role" in profile) ||
      profile.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      );
    }

    // Validate the requested existing account ID.
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("external_user_id" in body) ||
      typeof body.external_user_id !== "number" ||
      !Number.isSafeInteger(body.external_user_id) ||
      body.external_user_id <= 0
    ) {
      return NextResponse.json(
        { error: "Provide a valid external_user_id." },
        { status: 400 }
      );
    }

    const userId = body.external_user_id;

    // Fetch the existing account from EscuelaJS.
    const userResponse = await fetch(`${API_URL}/users/${userId}`, {
      cache: "no-store",
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Could not find that account in EscuelaJS." },
        { status: 404 }
      );
    }

    const user: unknown = await userResponse.json();

    if (
      !user ||
      typeof user !== "object" ||
      !("id" in user) ||
      user.id !== userId ||
      !("name" in user) ||
      typeof user.name !== "string" ||
      !("email" in user) ||
      typeof user.email !== "string"
    ) {
      return NextResponse.json(
        { error: "The account profile is invalid." },
        { status: 502 }
      );
    }

    // Do not overwrite an existing customer with a conflicting ID or email.
    const { data: byId, error: idError } = await supabaseAdmin
      .from("customers")
      .select("id, external_user_id, email, role, status")
      .eq("external_user_id", userId)
      .maybeSingle();

    if (idError) {
      throw idError;
    }

    const normalizedEmail = user.email.toLowerCase();

    const { data: byEmail, error: emailError } = await supabaseAdmin
      .from("customers")
      .select("id, external_user_id, email, role, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (emailError) {
      throw emailError;
    }

    if (
      byEmail &&
      byEmail.external_user_id !== null &&
      byEmail.external_user_id !== userId
    ) {
      return NextResponse.json(
        {
          error:
            "This email belongs to a different customer ID in Supabase. Resolve the conflict before syncing.",
        },
        { status: 409 }
      );
    }

    const phone =
      "phone" in user && typeof user.phone === "string"
        ? user.phone
        : "";

    const customerData = {
      external_user_id: userId,
      name: user.name,
      email: normalizedEmail,
      phone,
    };

    let result;

    if (byId) {
      // Preserve the existing role and status.
      result = await supabaseAdmin
        .from("customers")
        .update(customerData)
        .eq("external_user_id", userId);
    } else if (byEmail) {
      // Attach the external ID without changing role or status.
      result = await supabaseAdmin
        .from("customers")
        .update({ ...customerData })
        .eq("email", normalizedEmail);
    } else {
      // Create a new customer record.
      result = await supabaseAdmin
        .from("customers")
        .insert({
          ...customerData,
          role: "customer",
          status: "Active",
        });
    }

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({
      message: "Customer synchronized successfully.",
      external_user_id: userId,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Customer sync failed:", error);

    return NextResponse.json(
      { error: "Could not synchronize the customer record." },
      { status: 500 }
    );
  }
}
