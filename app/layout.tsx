import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seedinvestments.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seed Investments | Clarity. Discipline. Wealth.",
    template: "%s | Seed Investments",
  },
  description:
    "Seed Investments is an AMFI-registered mutual fund distributor offering SIP planning, portfolio management, insurance advisory, and NRI investment services. Build lasting wealth with clarity and discipline.",
  keywords: [
    "mutual funds",
    "SIP",
    "investment planning",
    "wealth management",
    "NRI investment India",
    "financial planning",
    "insurance advisory",
    "portfolio management",
    "Seed Investments",
  ],
  authors: [{ name: "Seed Investments" }],
  creator: "Seed Investments",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "Seed Investments | Clarity. Discipline. Wealth.",
    description:
      "AMFI-registered mutual fund distributor offering SIP planning, portfolio management, insurance advisory, and NRI investment services.",
    siteName: "Seed Investments",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seed Investments | Clarity. Discipline. Wealth.",
    description:
      "AMFI-registered mutual fund distributor offering SIP planning, portfolio management, insurance advisory, and NRI investment services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
