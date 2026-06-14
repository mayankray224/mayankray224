import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response("NextAuth is deprecated. Using LocalStorage session provider instead.", { status: 200 });
}

export async function POST(req: NextRequest) {
  return new Response("NextAuth is deprecated. Using LocalStorage session provider instead.", { status: 200 });
}
