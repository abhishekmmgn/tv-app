import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthContextProvider } from "@/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "TV App",
    template: "%s | TV App",
  },
  openGraph: {
    images: "https://utfs.io/f/6192feb6-5f78-4ea2-94df-f3acc2298145-cu5kob.jpg",
    title: "TV App",
    description: "Get recommendations for your next TV show.",
    url: "https://tv-app-beta.vercel.app",
    siteName: "TV App",
    locale: "en_US",
    type: "website",
  },
  description: "Get recommendations for your next TV show.",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <AuthContextProvider>
          <Navbar />
          <main className="mt-14">{children}</main>
        </AuthContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
