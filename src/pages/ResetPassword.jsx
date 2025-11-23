// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [tokenReady, setTokenReady] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // ------------------------------
  // STEP 1: Validate reset token from URL
  // ------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          setMsg({ type: "error", text: "Invalid or expired reset link." });
          return;
        }

        if (data?.session) {
          setTokenReady(true);
        } else {
          setMsg({ type: "error", text: "Invalid reset session." });
        }
      } catch (err) {
        setMsg({ type: "error", text: "Reset link is invalid or expired." });
      }
    };

    restoreSession();
  }, []);

  // ------------------------------
  // STEP 2: Update password
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!password || !confirm) {
      setMsg({ type: "error", text: "All fields are required." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMsg({ type: "error", text: error.message });
      return;
    }

    setMsg({
      type: "success",
      text: "Password updated! Redirecting to login...",
    });

    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0c1f] via-[#0c1024] to-[#070713] px-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-radial from-[#7f5af0]/20 to-transparent blur-[120px]"></div>
      <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full bg-gradient-radial from-[#00eaff]/15 to-transparent blur-[120px]"></div>

      <div className="relative w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(127,90,240,0.35)]">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Set a New Password
        </h1>

        {!tokenReady ? (
          <p className="text-center text-gray-300">
            Validating reset link…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#7f5af0]/40 outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ffd780]/40 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7f5af0] via-[#9d8ffd] to-[#bfa7ff] text-white font-semibold hover:shadow-purple-500/30 transition-all"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {msg.text && (
          <p
            className={`text-center text-sm mt-4 ${
              msg.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {msg.text}
          </p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="mt-6 text-center w-full text-[#7f5af0] hover:text-[#a38aff]"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
