import { baseUrlApi } from "@/app/utils/url";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = await headers();

  const token = headersList.get("authorization");

  const req = await fetch(`${baseUrlApi()}/books`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await req.json();

  return NextResponse.json(res);
}
