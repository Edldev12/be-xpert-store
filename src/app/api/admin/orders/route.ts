
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  await connection();
  try {

    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return Response.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL ??
      "https://api.escuelajs.co/api/v1"
    ).replace(/\/+$/, "");

    // Verify the user's access token.
    const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return Response.json(
        { error: "Your session is invalid. Please log in again." },
        { status: 401 }
      );
    }

    const profile = await profileResponse.json();

    if (profile.role !== "admin") {
      return Response.json(
        { error: "Administrator access required." },
        { status: 403 }
      );
    }

    // Retrieve orders from Supabase.
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, customer_name, email, status, total, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error);

      return Response.json(
        { error: "Could not load orders." },
        { status: 500 }
      );
    }

    return Response.json({ orders: data });
  } catch (error) {
    console.error("Admin orders request failed:", error);

    return Response.json(
      { error: "Could not load orders." },
      { status: 500 }
    );
  }
}
