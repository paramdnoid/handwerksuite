import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@zunftgewerk/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Willkommen bei ZunftGewerk. Hier ist Ihre Betriebsübersicht.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aktive Projekte</CardDescription>
            <CardTitle className="text-4xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+2 diese Woche</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kunden</CardDescription>
            <CardTitle className="text-4xl">48</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+5 diesen Monat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Offene Rechnungen</CardDescription>
            <CardTitle className="text-4xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              12.450€ ausstehend
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Umsatz (Monat)</CardDescription>
            <CardTitle className="text-4xl">34.2k€</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12% zum Vormonat</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Projekte</CardTitle>
            <CardDescription>
              Ihre laufenden Projekte auf einen Blick
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Projektliste wird hier angezeigt...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>
              Neueste Änderungen in Ihrem Betrieb
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aktivitätslog wird hier angezeigt...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
