import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Providers } from "./providers";
import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";
import { LegalFooter } from "@/components/salary/LegalFooter";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Developer Salary Database | Real Pay Data 2026",
    template: "%s | DevSalaries",
  },
  description:
    "Anonymous, self-reported developer salary data by role and location. Real pay data 2026.",
  openGraph: {
    title: "Developer Salary Database | Real Pay Data 2026",
    description:
      "Anonymous, self-reported developer salary data by role and location.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <DisclaimerBanner />
          {children}
          <LegalFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
