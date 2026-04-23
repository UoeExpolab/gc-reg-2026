import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/gc-toaster";
import { PWARegistration } from "@/components/pwa-registration";

export const metadata: Metadata = {
  title: "Grand Challenges · Registration",
  description: "Register your team, reserve a table, and book equipment kits for Grand Challenges 2026.",
  themeColor: "#1a1a1a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GC2026",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="mark">
            <span className="uoe">University of Exeter</span>
            <span className="pipe">/</span>
            <span className="prog">Grand Challenges · 2026</span>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="inner">
            <div className="brand">
              Grand Challenges
              <small>University of Exeter · 2026</small>
            </div>
            <div className="fine">© 2026</div>
          </div>
        </footer>

        <Toaster />
        <PWARegistration />
      </body>
    </html>
  );
}
