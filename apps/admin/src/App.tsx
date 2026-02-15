import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { BannersPage } from "./pages/BannersPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ContactsPage } from "./pages/ContactsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { GalleryPage } from "./pages/GalleryPage";
import { LoginPage } from "./pages/LoginPage";
import { ServicesPage } from "./pages/ServicesPage";
import { useAuthStore } from "./store/authStore";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize auth on mount only - no dependencies needed
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/banners" element={<BannersPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
