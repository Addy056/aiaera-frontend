// src/router.jsx
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword.jsx"));

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Builder = lazy(() => import("./pages/Builder.jsx"));
const Leads = lazy(() => import("./pages/Leads.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));
const Integrations = lazy(() => import("./pages/Integrations.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

const PublicChatbot = lazy(() =>
  import("./pages/public-chatbot/PublicChatbot.jsx")
);

const EmbedCode = lazy(() =>
  import("./components/builder/EmbedCode.jsx")
);

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

// 404 Fallback Page
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0a0a12]">
      <h1 className="text-4xl mb-2 font-bold">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-[#7f5af0] rounded-xl shadow-md hover:bg-[#9b7ff7] transition-all"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white bg-black/90 text-xl">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* ----------------------------- */}
        {/* PUBLIC AUTH ROUTES           */}
        {/* ----------------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* ----------------------------- */}
        {/* PUBLIC CHATBOT (IFRAME)      */}
        {/* ----------------------------- */}
        <Route path="/public-chatbot/:id" element={<PublicChatbot />} />

        {/* ----------------------------- */}
        {/* PROTECTED MAIN APP ROUTES    */}
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

        {/* ⭐ Builder (General) */}
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

        {/* ⭐ Builder (Per Chatbot) */}
        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Builder />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ⭐ Embed Code Page */}
        <Route
          path="/builder/:id/embed-code"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EmbedCode />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Leads */}
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

        {/* Appointments */}
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

        {/* Integrations */}
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

        {/* Settings */}
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

        {/* ----------------------------- */}
        {/* PUBLIC PRICING PAGE          */}
        {/* ----------------------------- */}
        <Route path="/pricing" element={<Pricing />} />

        {/* ----------------------------- */}
        {/* 404 FALLBACK                 */}
        {/* ----------------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
