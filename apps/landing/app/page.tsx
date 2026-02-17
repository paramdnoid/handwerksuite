import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@handwerksuite/ui";

const features = [
  {
    title: "Projekte verwalten",
    description:
      "Behalten Sie alle Aufträge im Blick – von der Planung bis zur Abrechnung.",
  },
  {
    title: "Offline-fähig",
    description:
      "Arbeiten Sie auf der Baustelle ohne Internet. Daten synchronisieren automatisch.",
  },
  {
    title: "Ende-zu-Ende verschlüsselt",
    description:
      "AES-256-GCM Verschlüsselung mit Enterprise Key Management. DSGVO-konform.",
  },
  {
    title: "Alle Geräte",
    description:
      "Web, Desktop (Mac & Windows) und Mobile (iOS & Android) – eine Plattform.",
  },
  {
    title: "Kundenverwaltung",
    description:
      "Kontaktdaten, Projekthistorie und Kommunikation an einem Ort.",
  },
  {
    title: "Behörden-Schnittstelle",
    description:
      "Handwerkskammern und Behörden können zugewiesene Betriebe sicher einsehen.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              HandwerkSuite
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Funktionen
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preise
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Anmelden
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Kostenlos starten</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Die digitale Plattform
          <br />
          <span className="text-primary">für Handwerksbetriebe</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Projekte, Kunden und Rechnungen verwalten – offline-fähig,
          verschlüsselt und auf allen Geräten verfügbar. Entwickelt für
          das deutsche Handwerk.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg">Jetzt kostenlos testen</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Mehr erfahren
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Alles was Ihr Betrieb braucht
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Faire Preise für jede Betriebsgröße
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              name: "Starter",
              price: "29",
              desc: "Für Einzelunternehmer",
              features: [
                "1 Benutzer",
                "50 Projekte",
                "Web-App",
                "E-Mail-Support",
              ],
            },
            {
              name: "Professional",
              price: "79",
              desc: "Für wachsende Betriebe",
              features: [
                "10 Benutzer",
                "Unbegrenzte Projekte",
                "Alle Apps",
                "Offline-Sync",
                "Prioritäts-Support",
              ],
            },
            {
              name: "Enterprise",
              price: "199",
              desc: "Für große Betriebe",
              features: [
                "Unbegrenzte Benutzer",
                "Unbegrenzte Projekte",
                "Alle Apps",
                "Offline-Sync",
                "API-Zugang",
                "Dedizierter Support",
              ],
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.name === "Professional" ? "border-primary shadow-lg" : ""
              }
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/Monat</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="block mt-6">
                  <Button
                    variant={
                      plan.name === "Professional" ? "default" : "outline"
                    }
                    className="w-full"
                  >
                    Auswählen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HandwerkSuite. Alle Rechte
              vorbehalten.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/impressum" className="hover:text-foreground">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-foreground">
                Datenschutz
              </Link>
              <Link href="/agb" className="hover:text-foreground">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
