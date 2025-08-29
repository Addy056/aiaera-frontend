// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: "" });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    });

    if (error) {
      setStatus({ loading: false, message: "", error: error.message });
    } else {
      setStatus({
        loading: false,
        message: "Password reset link sent! Please check your email.",
        error: ""
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-[#0b0f17] to-[#09111d] flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Forgot Password</h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {status.error && <p className="text-red-400 text-sm">{status.error}</p>}
          {status.message && <p className="text-green-400 text-sm">{status.message}</p>}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-lg"
          >
            {status.loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-purple-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
