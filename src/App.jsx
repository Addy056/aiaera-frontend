import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  Suspense,
  lazy,
  useEffect,
} from "react";

/*
========================================
LAZY PAGES
========================================
*/
const Landing = lazy(() =>
  import("./pages/Landing")
);

const Login = lazy(() =>
  import("./pages/Login")
);

const Signup = lazy(() =>
  import("./pages/Signup")
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard")
);

const Builder = lazy(() =>
  import("./pages/Builder")
);

const Leads = lazy(() =>
  import("./pages/Leads")
);

const Appointments = lazy(() =>
  import("./pages/Appointments")
);

const Integrations = lazy(() =>
  import("./pages/Integrations")
);

const Pricing = lazy(() =>
  import("./pages/Pricing")
);

const PublicChatbot = lazy(() =>
  import("./pages/PublicChatbot")
);

/*
========================================
LAYOUTS & COMPONENTS
========================================
*/
import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

/*
========================================
SCROLL TO TOP
========================================
*/
function ScrollToTop() {
  const { pathname } =
    useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

/*
========================================
GLOBAL LOADER
========================================
*/
function Loader() {
  return (
    <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-blue-600/20 blur-[140px] rounded-full"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6"></div>

        <h2 className="text-white text-2xl font-bold tracking-wide">
          Loading AIAERA...
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Preparing your AI workspace
        </p>

      </div>

    </div>
  );
}

/*
========================================
404 PAGE
========================================
*/
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

      {/* GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-600/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-600/20 blur-[150px] rounded-full"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6">

        <h1 className="text-8xl font-black text-white mb-4">
          404
        </h1>

        <p className="text-gray-400 text-xl mb-8">
          The page you are looking for does not exist
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
        >
          Back to Home
        </a>

      </div>

    </div>
  );
}

/*
========================================
APP ROUTES
========================================
*/
function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<Loader />}>

        <Routes>

          {/*
          ========================================
          PUBLIC ROUTES
          ========================================
          */}

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />

          {/*
          ========================================
          PUBLIC CHATBOT
          ========================================
          */}

          <Route
            path="/public-chatbot/:id"
            element={<PublicChatbot />}
          />

          {/*
          ========================================
          PROTECTED APP ROUTES
          ========================================
          */}

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >

            {/* DEFAULT REDIRECT */}
            <Route
              index
              element={
                <Navigate
                  to="/app/dashboard"
                  replace
                />
              }
            />

            {/* DASHBOARD */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* BUILDER */}
            <Route
              path="builder"
              element={<Builder />}
            />

            {/* LEADS */}
            <Route
              path="leads"
              element={<Leads />}
            />

            {/* APPOINTMENTS */}
            <Route
              path="appointments"
              element={<Appointments />}
            />

            {/* INTEGRATIONS */}
            <Route
              path="integrations"
              element={<Integrations />}
            />

            {/* PRICING */}
            <Route
              path="pricing"
              element={<Pricing />}
            />

          </Route>

          {/*
          ========================================
          404 PAGE
          ========================================
          */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>

      </Suspense>
    </>
  );
}

/*
========================================
MAIN APP
========================================
*/
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;