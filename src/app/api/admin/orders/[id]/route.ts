
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const allowedStatuses = [
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
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

    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return Response.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      typeof body.status !== "string" ||
      !allowedStatuses.includes(body.status as OrderStatus)
    ) {
      return Response.json(
        { error: "A valid order status is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: body.status })
      .eq("id", orderId)
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error("Failed to update order status:", error);
      return Response.json(
        { error: "Could not update order status." },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return Response.json({ order: data });
  } catch (error) {
    console.error("Order status update failed:", error);
    return Response.json(
      { error: "Could not update order status." },
      { status: 500 }
    );
  }
}
