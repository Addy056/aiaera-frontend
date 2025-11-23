// src/pages/UpdatePassword.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    new: "",
    confirm: ""
  });

  const [show, setShow] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: "" });

    if (passwords.new !== passwords.confirm) {
      setStatus({
        loading: false,
        error: "Passwords do not match",
        message: ""
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    });

    if (error) {
      setStatus({
        loading: false,
        error: error.message,
        message: ""
      });
    } else {
      setStatus({
        loading: false,
        message: "Password updated successfully!",
        error: ""
      });

      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-[#0b0f17] to-[#09111d] flex items-center justify-center relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 relative"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-11 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              required
            />
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show ? (
                <EyeSlashIcon className="w-5 h-5 text-red-400" />
              ) : (
                <EyeIcon className="w-5 h-5 text-green-400" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full px-11 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              required
            />
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          </div>

          {/* Messages */}
          {status.error && (
            <p className="text-red-400 text-sm">{status.error}</p>
          )}
          {status.message && (
            <p className="text-green-400 text-sm">{status.message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={status.loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#5f3ab8] text-white font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(127,90,240,0.7)] transition-all"
          >
            {status.loading ? "Updating..." : "Update Password"}
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-purple-300 mt-4">
            <Link to="/login" className="hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
