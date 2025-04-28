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
  const data = await request.json();

  const req = await fetch(`${baseUrlApi()}/books`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  return NextResponse.json(res);
}

export async function PUT(request: NextRequest) {
  const headersList = await headers();

  const token = headersList.get("authorization");
  const data = await request.json();

  const { searchParams } = new URL(request.url);

  const id = searchParams.get("bookId");

  const req = await fetch(`${baseUrlApi()}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  return NextResponse.json(res);
}

export async function PATCH(request: NextRequest) {
  const headersList = await headers();

  const token = headersList.get("authorization");

  const { searchParams } = new URL(request.url);

  const id = searchParams.get("bookId");

  const req = await fetch(`${baseUrlApi()}/books/changeStatus/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
  });

  const res = await req.json();

  return NextResponse.json(res);
}
