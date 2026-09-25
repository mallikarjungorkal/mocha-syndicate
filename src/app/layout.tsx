import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { JudgeDock } from "@/components/simulation/JudgeDock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mocha Syndicate | MarketSphere Catalyst Trading",
  description:
    "Re-engineering Retail Leverage into Trust-Anchored Micro-Syndicates on MochaTrade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#070A11] text-[#F8FAFC] antialiased`}>
        <Navbar />
        <main className="pb-36">{children}</main>
        <JudgeDock />
      </body>
    </html>
  );
}
