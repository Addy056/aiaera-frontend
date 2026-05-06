import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // 🔥 GET CURRENT SESSION
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session Error:", error);
          setUser(null);
          setLoading(false);
          return;
        }

        const session = data?.session;

        // ❌ NOT LOGGED IN
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ USER LOGGED IN
        setUser(session.user);

      } catch (err) {
        console.error("Protected Route Error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

    // 🔥 AUTH LISTENER
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      subscription?.unsubscribe();
    };

  }, []);

  // ⏳ LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

        {/* GLOW EFFECTS */}
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full"></div>

        {/* LOADER */}
        <div className="relative z-10 flex flex-col items-center">

          <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-5"></div>

          <h2 className="text-white text-xl font-semibold">
            Loading AIAERA...
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Verifying your session
          </p>

        </div>

      </div>
    );
  }

  // 🔐 LOGIN REQUIRED
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ ALLOW ACCESS
  return children;
}