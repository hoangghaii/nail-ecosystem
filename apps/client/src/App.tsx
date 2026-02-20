import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { PageLoader } from "@/components/shared/PageLoader";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Lazy-load non-critical pages to reduce initial bundle size
// TEMP: ServicesPage hidden — booking flows through Lookbook
// const ServicesPage = lazy(() =>
//   import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })),
// );
const GalleryPage = lazy(() =>
  import("@/pages/GalleryPage").then((m) => ({ default: m.GalleryPage })),
);
const BookingPage = lazy(() =>
  import("@/pages/BookingPage").then((m) => ({ default: m.BookingPage })),
);
const ContactPage = lazy(() =>
  import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            {/* TEMP: /services redirects to /gallery — booking flows through Lookbook */}
            <Route path="/services" element={<Navigate to="/gallery" replace />} />
            {/* <Route
              path="/services"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ServicesPage />
                </Suspense>
              }
            /> */}
            <Route
              path="/gallery"
              element={
                <Suspense fallback={<PageLoader />}>
                  <GalleryPage />
                </Suspense>
              }
            />
            <Route
              path="/booking"
              element={
                <Suspense fallback={<PageLoader />}>
                  <BookingPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
