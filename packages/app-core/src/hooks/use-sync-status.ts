"use client";

import { useEffect, useState } from "react";
import type { SyncStatus } from "@zunftgewerk/sync";

export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>({
    connected: false,
    lastSyncedAt: null,
    uploading: false,
    downloading: false,
    error: null,
  });

  useEffect(() => {
    // TODO: Subscribe to PowerSync status updates
    const checkOnline = () => {
      setStatus((prev) => ({
        ...prev,
        connected: navigator.onLine,
      }));
    };

    window.addEventListener("online", checkOnline);
    window.addEventListener("offline", checkOnline);
    checkOnline();

    return () => {
      window.removeEventListener("online", checkOnline);
      window.removeEventListener("offline", checkOnline);
    };
  }, []);

  return status;
}
