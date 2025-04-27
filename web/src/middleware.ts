import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth-token");

  const protectedRoutes = ["/books", "/books/new"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = new URL("/auth", request.url);

    url.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/books", "/books/new", "/auth"],
};
