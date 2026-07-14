import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "City Gadgets | Premium Tech. Better Prices.",
    template: "%s | City Gadgets",
  },
  description:
    "City Gadgets is Nairobi's premier destination for premium smartphones, laptops, gaming and lifestyle tech — quality guaranteed with savings up to 70%. 12-month warranty, free delivery, M-Pesa payments.",
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
