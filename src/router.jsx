// src/router.jsx
import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// -----------------------------
// Lazy-loaded pages
// -----------------------------
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));

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

// -----------------------------
// Components
// -----------------------------
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

// -----------------------------
// 404 Page
// -----------------------------
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a12] text-white">
      <h1 className="text-4xl font-bold mb-2">404 – Page Not Found</h1>
      <p className="text-gray-400 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-[#7f5af0] rounded-xl hover:bg-[#9b7ff7] transition"
      >
        Go to Homepage
      </a>
    </div>
  );
}

// -----------------------------
// App Routes
// -----------------------------
export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
          Loading…
        </div>
      }
    >
      <Routes>
        {/* ----------------------------- */}
        {/* PUBLIC ROUTES                */}
        {/* ----------------------------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        <Route path="/public-chatbot/:id" element={<PublicChatbot />} />

        {/* ----------------------------- */}
        {/* PROTECTED APP ROUTES         */}
        {/* ----------------------------- */}
        <Route
          path="/app"
          element={<ProtectedRoute />}
        >
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="builder" element={<Builder />} />
            <Route path="builder/:id" element={<Builder />} />
            <Route path="builder/:id/embed-code" element={<EmbedCode />} />
            <Route path="leads" element={<Leads />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ----------------------------- */}
        {/* 404                          */}
        {/* ----------------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
