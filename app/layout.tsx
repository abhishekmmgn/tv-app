import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthContextProvider } from "@/providers/auth-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "TV App",
    template: "%s | TV App",
  },
  description: "Get recommendations for your next TV show.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
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
      </body>
    </html>
  );
}
