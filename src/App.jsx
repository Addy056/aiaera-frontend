// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "./router";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      {/* Scroll Fix */}
      <ScrollToTop />

      {/* Fallback for lazy pages */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-white bg-black/90 text-xl">
            Loading...
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </Router>
  );
}
