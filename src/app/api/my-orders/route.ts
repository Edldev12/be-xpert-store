
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to view your orders." },
        { status: 401 }
      );
    }

    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Your session is invalid. Please sign in again." },
        { status: 401 }
      );
    }

    const profile: unknown = await profileResponse.json();

    if (
      !profile ||
      typeof profile !== "object" ||
      !("id" in profile) ||
      typeof profile.id !== "number" ||
      !Number.isSafeInteger(profile.id) ||
      profile.id <= 0
    ) {
      return NextResponse.json(
        { error: "Could not verify your customer account." },
        { status: 502 }
      );
    }

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, external_user_id, customer_name, email, status, total, created_at"
      )
      .eq("external_user_id", profile.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Could not load customer orders:", ordersError);

      return NextResponse.json(
        { error: "Could not load your orders." },
        { status: 500 }
      );
    }

    const orderIds = (orders ?? []).map((order) => order.id);

    let items: {
      order_id: number;
      product_id: string;
      product_title: string;
      unit_price: number;
      quantity: number;
    }[] = [];

    if (orderIds.length > 0) {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from("order_items")
        .select("order_id, product_id, product_title, unit_price, quantity")
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("Could not load order items:", itemsError);

        return NextResponse.json(
          { error: "Could not load your order details." },
          { status: 500 }
        );
      }

      items = orderItems ?? [];
    }

    const result = (orders ?? []).map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error("My orders request failed:", error);

    return NextResponse.json(
      { error: "Could not load your orders." },
      { status: 500 }
    );
  }
}
