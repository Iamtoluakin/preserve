import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://preservehq.com"),
  title: "Property care. Handled.",
  description: "PreserveHQ coordinates verified local professionals and manages property work from request to completion.",
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
    title: "Property care. Handled.",
    description: "PreserveHQ coordinates verified local professionals and manages property work from request to completion.",
    url: "https://preservehq.com",
    siteName: "PreserveHQ",
    images: [
      {
        url: "/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "PreserveHQ property care handled",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property care. Handled.",
    description: "PreserveHQ coordinates verified local professionals and manages property work from request to completion.",
    images: ["/opengraph-image?v=3"],
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
