import type { Metadata, Viewport } from "next";
import { Heebo, Inter, Manrope, JetBrains_Mono } from "next/font/google";
import { PWARegister } from "@/components/app/pwa-register";
import "./globals.css";

// Hebrew is the primary UI language, Inter backs it for Latin text.
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Used for times, flight codes, confirmation numbers.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tal Travel",
  description: "פלטפורמת תכנון וניהול טיולים של משפחת טל",
  manifest: "/manifest.webmanifest",
  applicationName: "Tal Travel",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tal Travel",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b6fb8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
