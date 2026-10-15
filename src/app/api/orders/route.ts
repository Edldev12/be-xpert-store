
import { supabaseAdmin } from "@/lib/supabase-server";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

type OrderRequest = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: {
    productId: string | number;
    quantity: number;
  }[];
};

type CustomerProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function isCustomerProfile(value: unknown): value is CustomerProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.id === "number" &&
    Number.isSafeInteger(profile.id) &&
    profile.id > 0 &&
    typeof profile.name === "string" &&
    typeof profile.email === "string" &&
    typeof profile.role === "string"
  );
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return Response.json(
        { error: "Please sign in before placing an order." },
        { status: 401 }
      );
    }

    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return Response.json(
        { error: "Your session is invalid. Please sign in again." },
        { status: 401 }
      );
    }

    const profileData: unknown = await profileResponse.json();

    if (!isCustomerProfile(profileData)) {
      return Response.json(
        { error: "Could not verify your customer account." },
        { status: 502 }
      );
    }

    const { data: customerRecord, error: customerError } =
      await supabaseAdmin
        .from("customers")
        .select("external_user_id")
        .eq("external_user_id", profileData.id)
        .maybeSingle();

    if (customerError) {
      console.error("Customer lookup failed:", customerError);

      return Response.json(
        { error: "Could not verify your customer record." },
        { status: 500 }
      );
    }

    if (!customerRecord) {
      return Response.json(
        {
          error:
            "Your customer profile is not synchronized. Please contact support.",
        },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return Response.json(
        { error: "Invalid order request." },
        { status: 400 }
      );
    }

    const { customer, items } = body as OrderRequest;

    if (
      !customer ||
      ![
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
      ].every(
        (value) => typeof value === "string" && value.trim().length > 0
      )
    ) {
      return Response.json(
        { error: "Please provide all customer details." },
        { status: 400 }
      );
    }

    // Use the verified account's email, not a browser-supplied email.
    if (
      customer.email.trim().toLowerCase() !==
      profileData.email.trim().toLowerCase()
    ) {
      return Response.json(
        { error: "Your checkout email must match your signed-in account." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 100 ||
      !items.every(
        (item) =>
          item &&
          (typeof item.productId === "string" ||
            (typeof item.productId === "number" &&
              Number.isSafeInteger(item.productId))) &&
          String(item.productId).trim().length > 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 100
      )
    ) {
      return Response.json(
        { error: "Your order items are invalid." },
        { status: 400 }
      );
    }

    const products = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(
            String(item.productId)
          )}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("A product could not be verified.");
        }

        const product: unknown = await response.json();

        if (!product || typeof product !== "object") {
          throw new Error("A product has invalid information.");
        }

        const productData = product as Record<string, unknown>;
        const price = Number(productData.price);

        if (
          String(productData.id) !== String(item.productId) ||
          typeof productData.title !== "string" ||
          !productData.title.trim() ||
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new Error("A product has invalid information.");
        }

        return {
          productId: String(productData.id),
          productTitle: productData.title,
          unitPrice: price,
          quantity: item.quantity,
        };
      })
    );

    const total = products.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    if (!Number.isFinite(total) || total > 999999999999) {
      return Response.json(
        { error: "The order total is invalid." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        external_user_id: profileData.id,
        customer_name: customer.fullName.trim(),
        email: profileData.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        total,
      })
      .select("id, status, total, created_at")
      .single();

    if (orderError || !order) {
      console.error("Could not create order:", orderError);

      return Response.json(
        { error: "Could not save your order. Please try again." },
        { status: 500 }
      );
    }

    const orderItems = products.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_title: item.productTitle,
      unit_price: item.unitPrice,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Could not save order items:", itemsError);

      const { error: rollbackError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      if (rollbackError) {
        console.error("Order cleanup failed:", rollbackError);
      }

      return Response.json(
        { error: "Could not save your order items. Please try again." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "Order saved successfully.",
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          createdAt: order.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);

    return Response.json(
      { error: "Could not create your order. Please try again." },
      { status: 400 }
    );
  }
}
