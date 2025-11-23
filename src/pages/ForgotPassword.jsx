// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const redirectURL = `${import.meta.env.VITE_APP_BASE_URL}/update-password`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return setStatus({
        loading: false,
        message: "",
        error: "Please enter a valid email address.",
      });
    }

    setStatus({ loading: true, message: "", error: "" });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectURL,
      });

      if (error) {
        throw error;
      }

      setStatus({
        loading: false,
        message: "Password reset link sent! Check your inbox.",
        error: "",
      });
    } catch (err) {
      setStatus({
        loading: false,
        message: "",
        error: err.message || "Something went wrong. Try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-[#0b0f17] to-[#09111d] flex items-center justify-center relative overflow-hidden">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <h2 className="text-3xl font-extrabold text-white mb-4">Forgot Password</h2>
        <p className="text-gray-300 text-sm mb-6">
          Enter your email and we’ll send you a secure link to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Error + Success Alerts */}
          {status.error && (
            <p className="text-red-400 text-sm">{status.error}</p>
          )}

          {status.message && (
            <p className="text-green-400 text-sm">{status.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all shadow-lg 
              ${
                status.loading
                  ? "bg-purple-700 cursor-not-allowed opacity-70"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {status.loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-purple-400 hover:underline transition-all"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
