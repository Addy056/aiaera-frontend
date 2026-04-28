import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

/* 🔥 LAZY LOAD PAGES */
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Builder = lazy(() => import("./pages/Builder"));
const Leads = lazy(() => import("./pages/Leads"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Pricing = lazy(() => import("./pages/Pricing"));

const PublicChatbot = lazy(() => import("./pages/PublicChatbot"));

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔥 SCROLL TO TOP */
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

/* 🔥 LOADER */
function Loader() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Loading...
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* 🌍 PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ PUBLIC PRICING (NO SIDEBAR) */}
          <Route path="/pricing" element={<Pricing />} />

          {/* 🔥 PUBLIC CHATBOT */}
          <Route path="/chatbot/:id" element={<PublicChatbot />} />

          {/* 🔐 APP ROUTES (ALL UNDER /app) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="builder" element={<Builder />} />
            <Route path="leads" element={<Leads />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>

          {/* ❌ 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-5xl font-bold text-white">404</h1>
                <p className="text-gray-400 mt-3">Page not found</p>
                <a
                  href="/"
                  className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:scale-105 transition"
                >
                  Go Home
                </a>
              </div>
            }
          />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;