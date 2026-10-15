import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.escuelajs.co/api/v1";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (typeof accessToken !== "string" || !accessToken.trim()) {
      return NextResponse.json(
        { message: "Access token is required." },
        { status: 400 },
      );
    }

    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { message: "Invalid or expired login." },
        { status: 401 },
      );
    }

    const profile = await profileResponse.json();

    if (profile.role !== "admin") {
      return NextResponse.json(
        { message: "Administrator access required." },
        { status: 403 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("be-xpert-admin-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to verify administrator session." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("be-xpert-admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}