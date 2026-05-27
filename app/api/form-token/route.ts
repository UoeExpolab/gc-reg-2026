import { NextResponse } from "next/server";
import { validateApiReadRequest } from "@/lib/utils";
import {
  createFormVerificationToken,
  FORM_TOKEN_COOKIE,
  getFormTokenCookieOptions,
} from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!validateApiReadRequest(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const token = createFormVerificationToken();
    const response = NextResponse.json(
      { token },
      { headers: { "Cache-Control": "no-store" } }
    );

    response.cookies.set(FORM_TOKEN_COOKIE, token, getFormTokenCookieOptions());

    return response;
  } catch (error) {
    console.error("Error creating form token:", error);
    return NextResponse.json({ error: "Failed to create form token" }, { status: 500 });
  }
}
