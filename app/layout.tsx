import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learniee Parent Dashboard",
  description: "Search and discover high-quality courses for your child.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
