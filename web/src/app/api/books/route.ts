import { baseUrlApi } from "@/app/utils/url";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  const headersList = await headers();

  const token = headersList.get("authorization");
  console.log("LOGANDO TOKEN", token);

  const data = await request.json();

  console.log("LOGANDO Data", data);

  console.log("No route");

  const req = await fetch(`${baseUrlApi()}/books`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  console.log("LOGANDO REQ", req);

  const res = await req.json();
  console.log("LOGANDO Res", res);

  return NextResponse.json(res);
}
