import { TRPCProvider } from "@handwerksuite/app-core";

export default function App() {
  const apiUrl = "http://localhost:3001";

  return (
    <TRPCProvider apiUrl={apiUrl}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex h-12 items-center border-b px-4 drag-region">
          <span className="text-sm font-bold text-primary">HandwerkSuite</span>
          <span className="ml-2 text-xs text-muted-foreground">Desktop</span>
        </header>
        <main className="p-6">
          <h1 className="text-2xl font-bold">HandwerkSuite Desktop</h1>
          <p className="mt-2 text-muted-foreground">
            Desktop-App mit nativer SQLite-Datenbank und Offline-Unterstützung.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Die App-Logik wird aus @handwerksuite/app-core geladen.
            Hier werden die Desktop-spezifischen Features (Tauri Plugins,
            SQLite, Dateisystem-Zugriff) integriert.
          </p>
        </main>
      </div>
    </TRPCProvider>
  );
}
