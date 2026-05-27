import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const FORM_TOKEN_COOKIE = "gc_form_token";

const FORM_TOKEN_MAX_AGE_SECONDS = 30 * 60;
const FORM_TOKEN_MAX_AGE_MS = FORM_TOKEN_MAX_AGE_SECONDS * 1000;

export function createFormVerificationToken() {
  const issuedAt = Date.now().toString();
  const nonce = randomBytes(24).toString("base64url");
  const payload = `${nonce}.${issuedAt}`;
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function getFormTokenCookieOptions() {
  return {
    httpOnly: true,
    maxAge: FORM_TOKEN_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function validateBrowserRequest(request: Request): boolean {
  if (!validateSameOriginRequest(request)) {
    return false;
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return false;
  }

  const headerToken = request.headers.get("x-form-verification");
  const cookieToken = getCookie(request, FORM_TOKEN_COOKIE);

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return false;
  }

  return validateFormVerificationToken(headerToken);
}

function validateSameOriginRequest(request: Request): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  if (!userAgent || /curl|wget|postman/i.test(userAgent)) {
    return false;
  }

  const fetchMode = request.headers.get("sec-fetch-mode");
  const fetchDest = request.headers.get("sec-fetch-dest");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchMode === "navigate" || fetchDest === "document") {
    return false;
  }

  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return false;
  }

  const requestOrigin = getRequestOrigin(request);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    return origin === requestOrigin;
  }

  if (!referer) {
    return false;
  }

  try {
    return new URL(referer).origin === requestOrigin;
  } catch {
    return false;
  }
}

function validateFormVerificationToken(token: string): boolean {
  const [nonce, issuedAt, signature, ...extra] = token.split(".");

  if (!nonce || !issuedAt || !signature || extra.length > 0) {
    return false;
  }

  const timestamp = Number(issuedAt);
  const now = Date.now();
  if (!Number.isFinite(timestamp) || timestamp > now + 60_000 || now - timestamp > FORM_TOKEN_MAX_AGE_MS) {
    return false;
  }

  const expectedSignature = signPayload(`${nonce}.${issuedAt}`);
  return safeEqual(signature, expectedSignature);
}

function signPayload(payload: string) {
  return createHmac("sha256", getFormSigningSecret())
    .update(payload)
    .digest("base64url");
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function getFormSigningSecret() {
  const secret = process.env.FORM_SIGNING_SECRET || process.env.AIRTABLE_PAT;

  if (!secret && process.env.NODE_ENV !== "production") {
    return "dev-form-signing-secret";
  }

  if (!secret) {
    throw new Error("Missing FORM_SIGNING_SECRET or AIRTABLE_PAT");
  }

  return secret;
}

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return "";

  const cookies = cookieHeader.split(";").map(cookie => cookie.trim());
  const prefix = `${name}=`;
  const match = cookies.find(cookie => cookie.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto || url.protocol.replace(":", "")}://${forwardedHost}`;
  }

  return url.origin;
}
