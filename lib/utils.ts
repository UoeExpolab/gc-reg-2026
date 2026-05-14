import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateBrowserRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type');
  const referer = request.headers.get('referer');

  // Check for browser-like User-Agent (should not be curl, wget, etc.)
  if (!userAgent || userAgent.includes('curl') || userAgent.includes('wget') || userAgent.includes('Postman')) {
    return false;
  }

  // Check for typical browser User-Agent indicators
  const isBrowser = userAgent && (/mozilla|chrome|safari|firefox|edge|opera/i.test(userAgent));
  if (!isBrowser) {
    return false;
  }

  // Check Content-Type for JSON
  if (!contentType?.includes('application/json')) {
    return false;
  }

  // For production, you could also validate origin against your domain
  // For now, just check that these basic headers exist
  if (!origin && !referer) {
    return false;
  }

  return true;
}
