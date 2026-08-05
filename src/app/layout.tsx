import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://preservehq.com"),
  title: "Preserve — Property Care Made Simple",
  description: "Manage lawn care, house cleaning, inspections, winterization, and maintenance for all your properties in one place. Built for homeowners, landlords, and property investors.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/preserve-icon.svg",
    shortcut: "/preserve-icon.svg",
    apple: "/preserve-icon.svg",
  },
  openGraph: {
    title: "Preserve — Property Care Made Simple",
    description: "Property preservation, handled from anywhere.",
    url: "https://preservehq.com",
    siteName: "Preserve",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Preserve property care",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preserve — Property Care Made Simple",
    description: "Property preservation, handled from anywhere.",
    images: ["/opengraph-image"],
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
