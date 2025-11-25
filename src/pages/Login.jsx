// src/pages/Login.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { session },
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (loginError) {
        setError(loginError.message);
        return;
      }

      // Remember Me → persist session
      if (remember) {
        await supabase.auth.setSession(session);
      }

      // Redirect after login
     navigate("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#060609] via-[#071022] to-[#020205] p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -left-80 -top-40 w-[450px] h-[450px] rounded-full blur-3xl bg-gradient-to-br from-[#7f5af0]/20 to-[#00eaff]/10" />
      <div className="absolute -right-80 -bottom-40 w-[450px] h-[450px] rounded-full blur-3xl bg-gradient-to-tr from-[#ffd780]/20 to-[#7f5af0]/10" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-xl"
      >
        {/* Left Hero */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between px-10 py-12 bg-white/5 border-r border-white/10">
          <div>
            <h2 className="text-4xl font-extrabold text-white">
              Welcome Back!
            </h2>
            <p className="text-gray-300 mt-3 leading-relaxed">
              Ready to continue scaling your AI-powered business?
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            Powered by{" "}
            <span className="text-[#7f5af0] font-semibold">AIAERA</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 bg-white/5 border-l border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">
            Sign in to your account
          </h3>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-11 py-3 rounded-xl bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]/40"
              />
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7f5af0]" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-11 py-3 rounded-xl bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd780]/40"
              />
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#ffd780]" />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 p-1"
              >
                {show ? (
                  <EyeSlashIcon className="w-5 h-5 text-red-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-green-400" />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7f5af0] via-[#a78bfa] to-[#c4b5fd] text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>

            {/* Remember + Forgot */}
            <div className="flex justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded bg-black"
                />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#00eaff] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Signup link */}
            <p className="text-center text-xs text-gray-400 mt-3">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#00eaff] font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
