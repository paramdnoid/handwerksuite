import { TRPCProvider } from "@handwerksuite/app-core";

export default function App() {
  const apiUrl = "http://localhost:3001";

  return (
    <TRPCProvider apiUrl={apiUrl}>
      <div className="min-h-screen bg-background text-foreground safe-area-inset">
        <header className="flex h-14 items-center justify-center border-b px-4 pt-safe">
          <span className="text-lg font-bold text-primary">HandwerkSuite</span>
        </header>
        <main className="p-4 pb-safe">
          <h1 className="text-xl font-bold">HandwerkSuite Mobile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mobile-App mit nativer SQLite-Datenbank und Offline-Unterstützung.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Die App-Logik wird aus @handwerksuite/app-core geladen.
            Capacitor stellt native APIs für iOS und Android bereit.
          </p>
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t bg-background pb-safe">
          <button className="flex flex-col items-center gap-1 text-xs text-primary">
            <span>Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <span>Projekte</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <span>Kunden</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <span>Mehr</span>
          </button>
        </nav>
      </div>
    </TRPCProvider>
  );
}
