import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://preservehq.com"),
  title: "PreserveHQ — Managed Property Operations",
  description: "PreserveHQ coordinates service requests, dispatch, verified field professionals, quality review, invoices, and permanent property history.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/preserve-icon.svg",
    shortcut: "/preserve-icon.svg",
    apple: "/preserve-icon.svg",
  },
  openGraph: {
    title: "PreserveHQ — Managed Property Operations",
    description: "Property operations, handled end to end.",
    url: "https://preservehq.com",
    siteName: "Preserve",
    images: [
      {
        url: "/opengraph-image?v=2",
        width: 1200,
        height: 630,
        alt: "PreserveHQ managed property operations",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreserveHQ — Managed Property Operations",
    description: "Property operations, handled end to end.",
    images: ["/opengraph-image?v=2"],
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
