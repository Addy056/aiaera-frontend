import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Password updated successfully! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#151521] to-[#0b0b0f]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg shadow-[0_0_40px_rgba(127,90,240,0.4)] animate-fadeIn">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Set New Password</h1>
        <form onSubmit={handlePasswordUpdate} className="flex flex-col space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#5f3ab8] text-white font-medium hover:shadow-[0_0_15px_rgba(127,90,240,0.8)] transition-transform hover:-translate-y-1"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message.text && (
          <p
            className={`text-center text-sm mt-4 ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message.text}
          </p>
        )}
        <p
          className="mt-6 text-center text-[#7f5af0] cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
