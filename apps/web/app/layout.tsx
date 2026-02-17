import type { Metadata } from "next";
import { Toaster } from "@handwerksuite/ui";
import { TRPCProvider } from "@handwerksuite/app-core";
import "./globals.css";

export const metadata: Metadata = {
  title: "HandwerkSuite",
  description: "Ihre digitale Handwerks-Plattform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  return (
    <html lang="de">
      <body>
        <TRPCProvider apiUrl={apiUrl}>
          {children}
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
}
