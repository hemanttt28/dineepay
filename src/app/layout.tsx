import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"; // Use Outfit as requested for premium feel
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Dine ePay - India's Smart QR Payment System",
  description: "Modernize your canteen with Dine ePay. Scan, Pay, Enjoy.",
  manifest: "/manifest.json",
  icons: {
    icon: "/globe.svg",
    apple: "/globe.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dine ePay",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans bg-[#1a0f0a] text-[#f5f5f5]`}>
        {children}
      </body>
    </html>
  );
}
