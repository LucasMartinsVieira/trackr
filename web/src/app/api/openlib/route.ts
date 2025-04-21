import { baseUrlApi } from "@/app/utils/url";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headersList = await headers();

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");
  const openLibrarySearchType = searchParams.get("openLibrarySearchType");

  const token = headersList.get("authorization");

  const req = await fetch(
    `${baseUrlApi()}/books/search?query=${query}?openLibrarySearchType=${openLibrarySearchType}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const res = await req.json();

  return NextResponse.json(res);
}
