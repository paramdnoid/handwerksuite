import { Button, Card, CardContent, CardHeader, CardTitle } from "@zunftgewerk/ui";

export default function CustomersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Kunden
          </h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Kundendaten – verschlüsselt und DSGVO-konform
          </p>
        </div>
        <Button>Neuer Kunde</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kundenkontaktdaten sind mit AES-256-GCM Field-Level Encryption
            verschlüsselt. Die Entschlüsselung erfolgt nur im Client.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
