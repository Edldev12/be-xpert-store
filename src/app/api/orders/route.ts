
import { supabaseAdmin } from "@/lib/supabase-server";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;

    const { customer, items } = body;

    if (
      !customer ||
      ![customer.fullName, customer.email, customer.phone,
      customer.address, customer.city].every(
        (value) => typeof value === "string" && value.trim().length > 0
      )
    ) {
      return Response.json(
        { error: "Please provide all customer details." },
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

    // Get product prices from the server, not from the browser.
    const products = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(
          `https://api.escuelajs.co/api/v1/products/${encodeURIComponent(
            String(item.productId)
          )}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("A product could not be verified.");
        }

        const product = await response.json();
        const price = Number(product.price);

        if (
          String(product.id) !== String(item.productId) ||
          typeof product.title !== "string" ||
          !product.title.trim() ||
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new Error("A product has invalid information.");
        }

        return {
          productId: String(product.id),
          productTitle: product.title,
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
        customer_name: customer.fullName.trim(),
        email: customer.email.trim(),
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

      // Avoid leaving an incomplete order behind.
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
