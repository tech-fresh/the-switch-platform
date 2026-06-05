import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Switch Platform",
  description: "GCSE revision, progress tracking and exam readiness platform.",
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
