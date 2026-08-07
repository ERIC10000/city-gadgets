import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_ID = "G-Q057CTSDS2";

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
    images: [{ url: "/logo.jpeg", width: 808, height: 764, alt: "City Gadgets — Smart Gadgets & Electronics" }],
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

        {/* Google Analytics (GA4) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
