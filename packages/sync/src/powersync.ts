import { PowerSyncDatabase } from "@powersync/web";
import { appSchema } from "./schema";

export interface PowerSyncConfig {
  dbFilename?: string;
  powersyncUrl: string;
}

/**
 * Creates a PowerSync database instance for offline-first sync.
 * Uses wa-sqlite (WebAssembly SQLite) backed by IndexedDB in browser,
 * native SQLite on Tauri/Capacitor.
 */
export function createPowerSyncDb(config: PowerSyncConfig): PowerSyncDatabase {
  return new PowerSyncDatabase({
    schema: appSchema,
    database: {
      dbFilename: config.dbFilename ?? "zunftgewerk.db",
    },
  });
}
