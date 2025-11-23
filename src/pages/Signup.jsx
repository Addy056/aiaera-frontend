// src/pages/Signup.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      // If email confirmation is ON → user needs to verify first
      if (data?.user && !data.session) {
        setInfo(
          "🎉 Account created! Please check your email to verify your account."
        );
        return;
      }

      // If email confirmation is OFF → auto-login
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] p-6 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute left-10 top-8 w-60 h-60 rounded-full blur-3xl bg-gradient-radial from-[#ffd780]/20 to-transparent" />
      <div className="absolute right-10 bottom-8 w-72 h-72 rounded-full blur-3xl bg-gradient-radial from-[#00eaff]/20 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_40px_90px_rgba(2,6,23,0.8)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side hero */}
          <div className="hidden md:flex flex-col gap-6 p-12 bg-white/5 backdrop-blur-xl border-r border-white/10">
            <h3 className="text-3xl font-bold text-white mb-3">
              Join Us Today!
            </h3>
            <p className="text-gray-300">
              Create an account and explore powerful AI automation tools.
            </p>
          </div>

          {/* Right side form */}
          <div className="p-10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Create your account
            </h3>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-11 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd780]/30"
                />
                <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-11 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00eaff]/30"
                />
                <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-11 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7afcff]/30"
                />
                <LockOpenIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300"
                >
                  {show ? (
                    <EyeSlashIcon className="w-5 h-5 text-red-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-green-400" />
                  )}
                </button>
              </div>

              {/* Error message */}
              {error && <div className="text-red-400 text-sm">{error}</div>}

              {/* Info message */}
              {info && <div className="text-green-400 text-sm">{info}</div>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00eaff] to-[#7afcff] text-black font-semibold shadow-lg"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-[#00eaff]">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
