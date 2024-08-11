import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: "PortalOS",
  description: "PortalOS - The portal for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
