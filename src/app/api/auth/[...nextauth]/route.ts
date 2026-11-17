import { handlers, authConfigured } from "@/auth";
import type { NextRequest } from "next/server";
export const GET = (request: NextRequest) =>
  authConfigured
    ? handlers.GET(request)
    : Response.json(
        { error: "Sign-in is not available yet." },
        { status: 503 },
      );
export const POST = (request: NextRequest) =>
  authConfigured
    ? handlers.POST(request)
    : Response.json(
        { error: "Sign-in is not available yet." },
        { status: 503 },
      );
