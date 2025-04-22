import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth-token");

  const protectedRoutes = ["/books"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}
