import {
  useState,
  useEffect,
  useContext,
} from "react";

import { supabase } from "../lib/supabase";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  Bot,
  Sparkles,
  ShieldCheck,
  Rocket,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Zap,
} from "lucide-react";

import { motion } from "framer-motion";

import logo from "../assets/aiaera-logo.png";

export default function Login() {

  /*
  =========================================
  NAVIGATION
  =========================================
  */
  const navigate =
    useNavigate();

  /*
  =========================================
  AUTH CONTEXT
  =========================================
  */
  const {
    user,
  } =
    useContext(
      AuthContext
    );

  /*
  =========================================
  STATES
  =========================================
  */
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  const [resetMessage, setResetMessage] =
    useState("");

  /*
  =========================================
  REDIRECT AFTER AUTH HYDRATION
  =========================================
  */
  useEffect(() => {

    if (user) {

      console.log(
        "USER AUTHENTICATED"
      );

      navigate(
        "/app/dashboard",
        {
          replace: true,
        }
      );
    }

  }, [user, navigate]);

  /*
  =========================================
  LOGIN
  =========================================
  */
  const handleLogin =
    async (e) => {

      e.preventDefault();

      if (loading)
        return;

      setLoading(true);

      setErrorMsg("");

      try {

        /*
        =========================================
        LOGIN USER
        =========================================
        */
        const {
          error,
        } =
          await supabase.auth.signInWithPassword({

            email:
              email.trim(),

            password:
              password.trim(),
          });

        /*
        =========================================
        AUTH ERROR
        =========================================
        */
        if (error) {

          throw error;
        }

        console.log(
          "LOGIN SUCCESS"
        );

        /*
        =========================================
        DO NOT NAVIGATE HERE
        AuthContext handles hydration first
        =========================================
        */

      } catch (err) {

        console.error(
          "LOGIN ERROR:",
          err
        );

        /*
        =========================================
        CLEAN ERRORS
        =========================================
        */
        if (
          err?.message?.includes(
            "Invalid login credentials"
          )
        ) {

          setErrorMsg(
            "Incorrect email or password."
          );

        } else if (
          err?.message?.includes(
            "Email not confirmed"
          )
        ) {

          setErrorMsg(
            "Please verify your email before logging in."
          );

        } else if (
          err?.message?.includes(
            "fetch"
          )
        ) {

          setErrorMsg(
            "Network error. Please check your internet connection."
          );

        } else {

          setErrorMsg(
            err?.message ||
              "Login failed"
          );
        }

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================================
  RESET PASSWORD
  =========================================
  */
  const handleForgotPassword =
    async () => {

      if (!email) {

        setErrorMsg(
          "Please enter your email first"
        );

        return;
      }

      try {

        setResetLoading(true);

        setErrorMsg("");

        setResetMessage("");

        const {
          error,
        } =
          await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo:
                `${window.location.origin}/reset-password`,
            }
          );

        if (error)
          throw error;

        setResetMessage(
          "Password reset email sent successfully!"
        );

      } catch (err) {

        console.error(
          "RESET ERROR:",
          err
        );

        setErrorMsg(
          err.message ||
            "Failed to send reset email"
        );

      } finally {

        setResetLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-[#050816] relative overflow-hidden flex items-center justify-center px-6 py-10">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-150px] left-[-120px] w-[450px] h-[450px] bg-purple-600/25 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] bg-blue-600/20 blur-[160px] rounded-full"></div>

        <div className="absolute top-[35%] left-[40%] w-[400px] h-[400px] bg-violet-500/10 blur-[140px] rounded-full"></div>

      </div>

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.04]">

        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:55px_55px]" />

      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-md mx-auto">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <div className="relative rounded-[36px] p-[1px] bg-gradient-to-br from-purple-500/30 via-white/10 to-blue-500/30 shadow-[0_20px_120px_rgba(0,0,0,0.55)]">

            <div className="relative bg-[#0B1120]/90 backdrop-blur-3xl rounded-[36px] p-8 overflow-hidden">

              {/* LOGO */}
              <div className="relative flex justify-center mb-10">

                <div className="absolute w-24 h-24 bg-purple-500/20 blur-[55px] rounded-[28px]"></div>

                <div className="relative w-[88px] h-[88px] rounded-[24px] border border-white/10 bg-[#0A0F1F] flex items-center justify-center">

                  <img
                    src={logo}
                    alt="AIAERA"
                    className="w-16 h-16 object-contain"
                  />

                </div>

              </div>

              {/* HEADER */}
              <div className="text-center mb-8">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-5">

                  <Clock3
                    size={15}
                    className="text-purple-300"
                  />

                  <span className="text-sm text-purple-200 font-medium">
                    Continue Your AI Journey
                  </span>

                </div>

                <h2 className="text-5xl font-black text-white mb-3 tracking-[-2px]">

                  Login To AIAERA

                </h2>

                <p className="text-gray-400">

                  Access your AI automation dashboard

                </p>

              </div>

              {/* ERROR */}
              {errorMsg && (

                <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-300 text-sm">

                  {errorMsg}

                </div>

              )}

              {/* SUCCESS */}
              {resetMessage && (

                <div className="mb-5 p-4 rounded-2xl bg-green-500/15 border border-green-500/20 text-green-300 text-sm flex items-center gap-2">

                  <CheckCircle2 size={16} />

                  {resetMessage}

                </div>

              )}

              {/* FORM */}
              <form onSubmit={handleLogin}>

                {/* EMAIL */}
                <div className="mb-5">

                  <label className="block text-sm text-gray-300 mb-2">

                    Email Address

                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* PASSWORD */}
                <div className="mb-3">

                  <label className="block text-sm text-gray-300 mb-2">

                    Password

                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >

                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}

                    </button>

                  </div>

                </div>

                {/* FORGOT */}
                <div className="flex justify-end mb-6">

                  <button
                    type="button"
                    onClick={
                      handleForgotPassword
                    }
                    disabled={resetLoading}
                    className="text-sm text-purple-400"
                  >

                    {resetLoading
                      ? "Sending..."
                      : "Forgot Password?"}

                  </button>

                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  {loading ? (

                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                  ) : (

                    <>
                      Login
                      <ArrowRight size={18} />
                    </>

                  )}

                </button>

              </form>

              {/* CTA */}
              <div className="mt-6 p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">

                <div className="flex items-start gap-3">

                  <Sparkles
                    size={18}
                    className="text-purple-400 mt-0.5"
                  />

                  <div>

                    <h4 className="text-sm font-semibold text-white mb-1">

                      New To AIAERA?

                    </h4>

                    <p className="text-xs text-gray-400 mb-3">

                      Start your 7-day free trial.

                    </p>

                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 text-sm font-medium text-purple-300"
                    >

                      Start Free Trial
                      <ArrowRight size={14} />

                    </Link>

                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">

                <Zap size={14} />

                AI-powered business automation platform

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}