import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Store for tracking legitimate form submissions
const legitimateSubmissions = new Map<string, number>();

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
  // For now, just check that these basic headers exist
  if (!origin && !referer) {
    return false;
  }

  // Verify form submission token
  if (!formVerification) {
    return false;
  }

  // Check if token is recent and valid (within last 30 seconds)
  const timestamp = legitimateSubmissions.get(formVerification);
  if (!timestamp || Date.now() - timestamp > 30000) {
    return false;
  }

  // Clean up old tokens
  legitimateSubmissions.delete(formVerification);

  return true;
}

export function generateFormVerificationToken(): string {
  const token = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  legitimateSubmissions.set(token, Date.now());
  return token;
}
