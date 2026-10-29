import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayukanti | Natural Living",
  description:
    "Explore Ayukanti's curated collection of herbal and natural products. Enquire directly on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
