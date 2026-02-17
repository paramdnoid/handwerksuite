import { Routes, Route, Navigate } from "react-router-dom";
import { TRPCProvider } from "@zunftgewerk/app-core";
import { SidebarProvider, SidebarInset } from "@zunftgewerk/ui";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardPage from "@/pages/dashboard";
import ProjectsPage from "@/pages/projects";
import CustomersPage from "@/pages/customers";

export default function App() {
  return (
    <TRPCProvider apiUrl="http://localhost:3001">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-6 p-6">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TRPCProvider>
  );
}
