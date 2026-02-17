import { Button, Card, CardContent, CardHeader, CardTitle } from "@zunftgewerk/ui";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-muted-foreground">
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
    </div>
  );
}
