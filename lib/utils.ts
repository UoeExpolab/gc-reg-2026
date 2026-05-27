import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const API_READ_HEADERS = {
  "x-gc-api-client": "form-ui",
} as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateApiReadRequest(request: Request): boolean {
  if (request.headers.get("x-gc-api-client") !== API_READ_HEADERS["x-gc-api-client"]) {
    return false;
  }

  const fetchMode = request.headers.get("sec-fetch-mode");
  const fetchDest = request.headers.get("sec-fetch-dest");
  const fetchSite = request.headers.get("sec-fetch-site");
  const hasFetchMetadata = Boolean(fetchMode || fetchDest || fetchSite);

  if (fetchMode === "navigate" || fetchDest === "document") {
    return false;
  }

  if (hasFetchMetadata) {
    return fetchSite ? ["same-origin", "same-site", "none"].includes(fetchSite) : true;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return new URL(referer).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function fetchFormVerificationToken() {
  const response = await fetch("/api/form-token", {
    cache: "no-store",
    credentials: "same-origin",
    headers: API_READ_HEADERS,
  });

  if (!response.ok) {
    throw new Error("Could not create form verification token");
  }

  const data = await response.json();
  if (!data.token || typeof data.token !== "string") {
    throw new Error("Invalid form verification token");
  }

  return data.token;
}
