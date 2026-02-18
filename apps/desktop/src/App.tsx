import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { TRPCProvider } from '@zunftgewerk/app-core';
import { ErrorBoundary } from '@/components/error-boundary';
import { SidebarProvider, SidebarInset, useSidebar } from '@zunftgewerk/ui';
import { AppSidebar } from '@/components/app-sidebar';
import DashboardPage from '@/pages/dashboard';

function AppLayout() {
  const { open } = useSidebar();

  useEffect(() => {
    invoke('set_traffic_lights_visible', { visible: open }).catch(console.error);
  }, [open]);

  return (
    <>
      <div data-tauri-drag-region className="fixed inset-x-0 top-0 z-50 h-3" />
      <AppSidebar />
      <SidebarInset className="overflow-y-auto">
        <div className="flex flex-col gap-6 px-6 pb-6 pt-3">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </SidebarInset>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TRPCProvider apiUrl="http://localhost:3001">
        <SidebarProvider>
          <AppLayout />
        </SidebarProvider>
      </TRPCProvider>
    </ErrorBoundary>
  );
}
