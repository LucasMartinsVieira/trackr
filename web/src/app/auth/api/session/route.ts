import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseUrlApi } from "@/app/utils/url";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null, token: null });
  }

  try {
    const response = await fetch(`${baseUrlApi()}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ user: null, token: null });
    }

    const user = await response.json();

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null, token: null });
  }
}
