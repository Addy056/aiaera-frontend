// src/components/MainLayout.jsx
import React, { useEffect, useState } from "react";
import FloatingMenu from "./FloatingMenu";
import { supabase } from "../supabaseClient";

export default function MainLayout({ children }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email || "");
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] relative">
      {/* Floating Sidebar */}
      <FloatingMenu userEmail={userEmail} />

      {/* Page content with left margin to avoid overlapping sidebar */}
      <div className="ml-20 md:ml-32 p-8">{children}</div>
    </div>
  );
}
