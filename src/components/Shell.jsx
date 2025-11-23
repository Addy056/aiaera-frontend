// src/components/Shell.jsx

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import FloatingMenu from "./FloatingMenu";
import Topbar from "./Topbar";
import { supabase } from "../supabaseClient";

export default function Shell() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error) {
          console.error("Error fetching user:", error.message);
          setUserEmail("");
        } else {
          setUserEmail(data?.user?.email || "");
        }
      } catch (err) {
        console.error("Unexpected auth error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getUser();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#03040a] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205]">
      {/* Left Floating Menu */}
      <FloatingMenu userEmail={userEmail} />

      {/* Content Wrapper */}
      <div className="flex-1 md:ml-32 flex flex-col">
        {/* Top Header */}
        <Topbar userEmail={userEmail} />

        {/* Main Page Content */}
        <main className="px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
