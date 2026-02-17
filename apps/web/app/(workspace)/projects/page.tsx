import { Button, Card, CardContent, CardHeader, CardTitle } from "@zunftgewerk/ui";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projekte</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Aufträge und Projekte
          </p>
        </div>
        <Button>Neues Projekt</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projektliste</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hier werden Ihre Projekte angezeigt. Die Daten werden lokal
            gespeichert und automatisch synchronisiert.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
