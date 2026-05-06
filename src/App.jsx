import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

/* 🔥 PAGES */
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

/* 🔥 LAYOUT */
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
    <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      {/* LOADING */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-5"></div>

        <h2 className="text-white text-xl font-semibold">
          Loading AIAERA...
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Preparing your AI workspace
        </p>

      </div>

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

          <Route path="/chatbot/:id" element={<PublicChatbot />} />

          {/* 🔥 PROTECTED APP ROUTES */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >

            {/* DEFAULT APP ROUTE */}
            <Route
              index
              element={<Navigate to="/app/dashboard" replace />}
            />

            {/* APP PAGES */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="builder"
              element={<Builder />}
            />

            <Route
              path="leads"
              element={<Leads />}
            />

            <Route
              path="appointments"
              element={<Appointments />}
            />

            <Route
              path="integrations"
              element={<Integrations />}
            />

            <Route
              path="pricing"
              element={<Pricing />}
            />

          </Route>

          {/* 🔥 PUBLIC PRICING */}
          <Route
            path="/pricing"
            element={<Pricing />}
          />

          {/* ❌ 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

                {/* BACKGROUND */}
                <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-600/20 blur-[140px] rounded-full"></div>

                <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-600/20 blur-[140px] rounded-full"></div>

                {/* CONTENT */}
                <div className="relative z-10 text-center">

                  <h1 className="text-8xl font-black text-white mb-4">
                    404
                  </h1>

                  <p className="text-gray-400 text-xl mb-8">
                    Page not found
                  </p>

                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
                  >
                    Go Home
                  </a>

                </div>

              </div>
            }
          />

        </Routes>

      </Suspense>

    </Router>
  );
}

export default App;