import { baseUrlApi } from "@/app/utils/url";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const req = await fetch(`${baseUrlApi()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  return NextResponse.json(res);
}
