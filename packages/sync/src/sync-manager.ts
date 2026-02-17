import type { PowerSyncDatabase } from "@powersync/web";

export interface SyncStatus {
  connected: boolean;
  lastSyncedAt: Date | null;
  uploading: boolean;
  downloading: boolean;
  error: string | null;
}

/**
 * Manages the sync lifecycle: connect, disconnect, monitor status.
 */
export class SyncManager {
  private db: PowerSyncDatabase;
  private powersyncUrl: string;
  private _status: SyncStatus = {
    connected: false,
    lastSyncedAt: null,
    uploading: false,
    downloading: false,
    error: null,
  };

  constructor(db: PowerSyncDatabase, powersyncUrl: string) {
    this.db = db;
    this.powersyncUrl = powersyncUrl;
  }

  get status(): SyncStatus {
    return { ...this._status };
  }

  async connect(token: string): Promise<void> {
    try {
      await this.db.connect({
        url: this.powersyncUrl,
        token,
      } as any);
      this._status.connected = true;
      this._status.error = null;
    } catch (error) {
      this._status.error =
        error instanceof Error ? error.message : "Connection failed";
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.db.disconnect();
    this._status.connected = false;
  }

  async executeQuery<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const result = await this.db.getAll(sql, params);
    return result as T[];
  }

  async executeWrite(sql: string, params?: unknown[]): Promise<void> {
    await this.db.execute(sql, params);
  }
}
