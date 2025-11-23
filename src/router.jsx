// src/router.jsx
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// Lazy-load pages for faster performance
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

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* ----------------------------- */}
        {/* AUTH ROUTES (Public)          */}
        {/* ----------------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* ----------------------------- */}
        {/* PUBLIC CHATBOT ROUTE          */}
        {/* ----------------------------- */}
        <Route path="/public-chatbot/:id" element={<PublicChatbot />} />

        {/* ----------------------------- */}
        {/* PROTECTED PAGES               */}
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

        {/* ----------------------------- */}
        {/* PUBLIC PRICING PAGE           */}
        {/* DO NOT WRAP WITH PROTECTED ROUTE */}
        {/* DO NOT USE MainLayout (no sidebar) */}
        {/* ----------------------------- */}
        <Route path="/pricing" element={<Pricing />} />

        {/* ----------------------------- */}
        {/* 404 FALLBACK                  */}
        {/* ----------------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
