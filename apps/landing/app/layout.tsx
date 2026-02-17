import type { Metadata } from "next";
import { Toaster } from "@zunftgewerk/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZunftGewerk – Die digitale Plattform für Handwerksbetriebe",
  description:
    "Verwalten Sie Projekte, Kunden und Rechnungen. Offline-fähig, verschlüsselt und DSGVO-konform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
