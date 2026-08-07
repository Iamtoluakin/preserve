import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://preservehq.com"),
  title: "Request work. We dispatch the pro.",
  description: "PreserveHQ lets customers request property work, assigns approved contractors, tracks the job, and returns photo proof.",
  alternates: {
    canonical: "https://preservehq.com",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/preserve-icon.svg",
    shortcut: "/preserve-icon.svg",
    apple: "/preserve-icon.svg",
  },
  openGraph: {
    title: "Request work. We dispatch the pro.",
    description: "PreserveHQ lets customers request property work, assigns approved contractors, tracks the job, and returns photo proof.",
    url: "https://preservehq.com",
    siteName: "PreserveHQ",
    images: [
      {
        url: "/opengraph-image?v=4",
        width: 1200,
        height: 630,
        alt: "PreserveHQ request work and dispatch approved pros",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Request work. We dispatch the pro.",
    description: "PreserveHQ lets customers request property work, assigns approved contractors, tracks the job, and returns photo proof.",
    images: ["/opengraph-image?v=4"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
