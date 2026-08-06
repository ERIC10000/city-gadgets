import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "City Gadgets — Buy Phones, Laptops, Gaming & Tech in Kenya",
    template: "%s | City Gadgets",
  },
  description:
    "Buy phones, laptops, gaming consoles, audio and accessories in Kenya at City Gadgets — best prices, genuine stock, 12-month warranty, M-Pesa payments and free same-day Nairobi delivery.",
  openGraph: {
    type: "website",
    siteName: "City Gadgets",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-surface font-sans text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
