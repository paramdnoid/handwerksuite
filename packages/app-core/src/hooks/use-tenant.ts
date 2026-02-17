"use client";

import { useEffect, useState } from "react";

interface CompanyContext {
  companyId: string | null;
  companyName: string | null;
  role: string | null;
  craftType: string | null;
  isLoading: boolean;
  switchCompany: (companyId: string) => void;
}

export function useCompany(): CompanyContext {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [craftType, setCraftType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("zunftgewerk:company_id");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      // TODO: Fetch company details from API
    }
    setIsLoading(false);
  }, []);

  const switchCompany = (newCompanyId: string) => {
    setCompanyId(newCompanyId);
    localStorage.setItem("zunftgewerk:company_id", newCompanyId);
    // TODO: Refresh sync connection with new company context
  };

  return { companyId, companyName, role, craftType, isLoading, switchCompany };
}
