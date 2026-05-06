import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

/* 🔥 AUTH CONTEXT */
import AuthProvider from "./context/AuthContext";

/* 🔥 ROOT RENDER */
createRoot(document.getElementById("root")).render(
  <StrictMode>

    <AuthProvider>

      <App />

    </AuthProvider>

  </StrictMode>
);