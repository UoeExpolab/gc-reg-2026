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
  const formVerification = request.headers.get('x-form-verification');

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
  if (!origin && !referer) {
    return false;
  }

  // Verify form submission token
  if (!formVerification) {
    return false;
  }

  // Basic stateless obfuscated verification (since client/server share no state)
  try {
    const timestampStr = typeof atob === 'function' 
      ? atob(formVerification) 
      : Buffer.from(formVerification, 'base64').toString('utf8');
    const timestamp = parseInt(timestampStr, 10);
    // As long as it parses to a valid roughly-recent timestamp, we accept
    if (isNaN(timestamp) || timestamp < 1700000000000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}

export function generateFormVerificationToken(): string {
  const ts = Date.now().toString();
  return typeof btoa === 'function' ? btoa(ts) : Buffer.from(ts).toString('base64');
}
