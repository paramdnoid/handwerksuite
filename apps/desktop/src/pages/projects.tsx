import { Button, Card, CardContent, CardHeader, CardTitle } from "@zunftgewerk/ui";

export default function ProjectsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Projekte
          </h1>
          <p className="text-muted-foreground mt-1">
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
    </>
  );
}
