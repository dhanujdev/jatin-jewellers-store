import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Jatin Jewellers - Exquisite Lab Grown Diamond Jewellery",
  description: "Discover our stunning collection of lab grown diamond jewelry at Jatin Jewellers. Elegant designs, superior craftsmanship, and sustainable luxury - all at accessible prices.",
  keywords: "lab grown diamonds, diamond jewelry, sustainable jewelry, ethical diamonds, engagement rings, diamond earrings, diamond pendants, diamond bracelets, Jatin Jewellers",
  authors: [{ name: "Jatin Jewellers" }],
  creator: "Jatin Jewellers",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jatinjewellers.in",
    title: "Jatin Jewellers - Exquisite Lab Grown Diamond Jewellery",
    description: "Discover our stunning collection of lab grown diamond jewelry at Jatin Jewellers. Elegant designs, superior craftsmanship, and sustainable luxury.",
    siteName: "Jatin Jewellers",
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
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans`}
        suppressHydrationWarning
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
