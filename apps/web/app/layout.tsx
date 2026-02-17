import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@zunftgewerk/ui";
import { TRPCProvider } from "@zunftgewerk/app-core";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ZunftGewerk",
  description: "Ihre digitale Handwerks-Plattform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  return (
    <html lang="de" className={`${inter.variable} ${jakarta.variable}`}>
      <body className={inter.className}>
        <TRPCProvider apiUrl={apiUrl}>
          {children}
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
}
