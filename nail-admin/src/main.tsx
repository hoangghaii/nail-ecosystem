import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { initializeMockData } from "./data/initializeMockData";

if (import.meta.env.VITE_USE_MOCK_API === "true") {
  initializeMockData();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
