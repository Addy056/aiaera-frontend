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
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) setError(error.message);
      else if (data?.session) navigate("/");
      else setError("Login failed.");
    } catch (err) {
      setLoading(false);
      setError("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#060609] via-[#071022] to-[#020205] p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -left-80 -top-40 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-[#00eaff]/10 to-transparent" />
      <div className="absolute -right-80 -bottom-40 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-[#ffd780]/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(2,6,23,0.75)]"
      >
        {/* Left Side (Hero Section) */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between px-10 py-12 bg-white/5 backdrop-blur-xl border-r border-white/10">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Welcome Back!
          </h2>
          <p className="text-gray-300 mb-6">Enter your details to continue.</p>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-1/2 p-10 bg-white/5 backdrop-blur-xl border-l border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">
            Sign in to your account
          </h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-11 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00eaff]/30"
              />
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            </div>

            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-11 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd780]/30"
              />
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300"
              >
                {show ? <EyeSlashIcon className="w-5 h-5 text-red-400" /> : <EyeIcon className="w-5 h-5 text-green-400" />}
              </button>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd780] to-[#ffb86b] text-black font-semibold shadow-lg"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>

            <div className="flex justify-between text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-[#00eaff] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#00eaff]">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
