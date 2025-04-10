import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtJalyuzi Admin",
  description: "Saidqodirxon Rahimov",
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
      <body>{children}</body>
    </html>
  );
}
