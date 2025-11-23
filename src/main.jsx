// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Optional: global providers (add later)
// import { LanguageProvider } from "./context/LanguageContext";
// import { UserProvider } from "./context/UserContext";

function ErrorBoundary({ children }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
          Loading...
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // ❗ Removed StrictMode — avoids double Supabase calls & double API requests
  <ErrorBoundary>
    {/* <LanguageProvider> */}
    {/* <UserProvider> */}
    <App />
    {/* </UserProvider> */}
    {/* </LanguageProvider> */}
  </ErrorBoundary>
);
