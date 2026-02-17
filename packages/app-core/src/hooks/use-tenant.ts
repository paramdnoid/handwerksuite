"use client";

import { useEffect, useState } from "react";

interface TenantContext {
  tenantId: string | null;
  tenantName: string | null;
  role: string | null;
  isLoading: boolean;
  switchTenant: (tenantId: string) => void;
}

export function useTenant(): TenantContext {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load active tenant from localStorage or session
    const storedTenantId = localStorage.getItem("handwerksuite:tenant_id");
    if (storedTenantId) {
      setTenantId(storedTenantId);
      // TODO: Fetch tenant details from API
    }
    setIsLoading(false);
  }, []);

  const switchTenant = (newTenantId: string) => {
    setTenantId(newTenantId);
    localStorage.setItem("handwerksuite:tenant_id", newTenantId);
    // TODO: Refresh sync connection with new tenant context
  };

  return { tenantId, tenantName, role, isLoading, switchTenant };
}
