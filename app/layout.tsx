import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIRO 2026",
  description:
    "AIRO 2026 • Mahindra University",
  metadataBase: new URL("https://mu-airo.com"),
  openGraph: {
    title: "AIRO 2026",
    description: "AIRO 2026 • Mahindra University",
    url: "https://mu-airo.com",
    siteName: "AIRO 2026",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AIRO 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIRO 2026",
    description: "AIRO 2026 • Mahindra University",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
