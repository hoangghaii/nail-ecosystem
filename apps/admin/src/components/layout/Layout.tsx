import { Outlet } from "react-router-dom";

import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
