import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://staysoji.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "StaySoji — Stay alert to predatory loan apps",
  description:
    "Check a Nigerian loan app's true APR, its FCCPC standing, and its terms before you borrow. StaySoji flags bait-and-switch fees, delisted apps, and rollover traps.",
  applicationName: "StaySoji",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StaySoji",
  },
  openGraph: {
    title: "StaySoji — Stay alert to predatory loan apps",
    description:
      "Check a Nigerian loan app's true APR, its FCCPC standing, and its terms before you borrow.",
    url: APP_URL,
    siteName: "StaySoji",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1e21" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeScript />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
