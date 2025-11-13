// src/router.jsx
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";

// App Pages
import Dashboard from "./pages/Dashboard.jsx";
import Builder from "./pages/Builder.jsx";
import Leads from "./pages/Leads.jsx";
import Appointments from "./pages/Appointments.jsx";
import Integrations from "./pages/Integrations.jsx";
import Pricing from "./pages/Pricing.jsx";
import Settings from "./pages/Settings.jsx";

// ✅ Correct import: DO NOT use bracket folder name
import PublicChatbot from "./pages/public-chatbot/PublicChatbot.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

// Simple 404 Page
function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go back to Dashboard</a>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ----------------------------- */}
      {/* PUBLIC AUTH ROUTES           */}
      {/* ----------------------------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* ----------------------------- */}
      {/* PUBLIC CHATBOT ROUTE          */}
      {/* MUST BE PUBLIC & OUTSIDE PROTECTED ROUTES */}
      {/* ----------------------------- */}
      <Route path="/public-chatbot/:id" element={<PublicChatbot />} />

      {/* ----------------------------- */}
      {/* PROTECTED APP ROUTES          */}
      {/* ----------------------------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/builder"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Builder />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Leads />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Appointments />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Integrations />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Public Pricing Page */}
      <Route path="/pricing" element={<Pricing />} />

      {/* ----------------------------- */}
      {/* CATCH-ALL → 404               */}
      {/* ----------------------------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
