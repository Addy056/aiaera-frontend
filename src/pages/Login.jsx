import { useState } from "react";

import { supabase } from "../lib/supabase";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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
        REDIRECT
        =========================================
        */
        navigate(
          "/app/dashboard"
        );

      } catch (err) {

        console.error(
          "LOGIN ERROR:",
          err
        );

        /*
        =========================================
        CLEAN ERROR MESSAGES
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
      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="hidden lg:block"
        >

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">

            <Sparkles
              className="w-4 h-4 text-purple-400"
            />

            <span className="text-sm text-gray-300">
              AI Automation Platform
            </span>

          </div>

          {/* TITLE */}
          <h1 className="text-7xl font-black leading-[0.92] tracking-[-4px] text-white mb-8">

            Welcome Back

            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">

              To AIAERA

            </span>

          </h1>

          {/* DESC */}
          <p className="text-gray-400 text-xl leading-relaxed mb-14 max-w-xl">

            Manage AI chatbots,
            automate customer conversations,
            capture leads,
            and scale support with intelligent AI.

          </p>

          {/* FEATURES */}
          <div className="space-y-5">

            <FeatureCard
              icon={
                <Bot className="text-purple-400" />
              }
              title="Website AI Chatbots"
              desc="Train AI using your business knowledge"
            />

            <FeatureCard
              icon={
                <Rocket className="text-blue-400" />
              }
              title="Lead & Appointment Automation"
              desc="Capture and convert customers automatically"
            />

            <FeatureCard
              icon={
                <ShieldCheck className="text-pink-400" />
              }
              title="WhatsApp & Social AI"
              desc="Unlock omnichannel automation with Pro"
            />

          </div>

        </motion.div>

        {/* RIGHT SIDE */}
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
          className="w-full max-w-md mx-auto relative"
        >

          {/* LOGIN CARD */}
          <div className="relative rounded-[36px] p-[1px] bg-gradient-to-br from-purple-500/30 via-white/10 to-blue-500/30 shadow-[0_20px_120px_rgba(0,0,0,0.55)]">

            <div className="relative bg-[#0B1120]/90 backdrop-blur-3xl rounded-[36px] p-8 overflow-hidden">

              {/* GLOW */}
              <div className="absolute top-[-120px] right-[-120px] w-[280px] h-[280px] bg-purple-500/20 blur-[120px] rounded-full"></div>

              {/* LOGO */}
              <div className="relative flex justify-center mb-10">

                <div className="absolute w-24 h-24 bg-purple-500/20 blur-[55px] rounded-[28px]"></div>

                <div className="relative w-[88px] h-[88px] rounded-[24px] border border-white/10 bg-[#0A0F1F] backdrop-blur-3xl flex items-center justify-center shadow-[0_20px_60px_rgba(124,58,237,0.35)]">

                  <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-white/5 to-transparent"></div>

                  <img
                    src={logo}
                    alt="AIAERA"
                    className="relative w-16 h-16 object-contain"
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

                <p className="text-gray-400 leading-relaxed">

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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
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

              {/* TRIAL CTA */}
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

                    <p className="text-xs text-gray-400 leading-relaxed mb-3">

                      Start your 7-day free trial and build AI chatbots for your business.

                    </p>

                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition"
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

function FeatureCard({
  icon,
  title,
  desc,
}) {

  return (

    <motion.div
      whileHover={{
        y: -4,
      }}
      className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
    >

      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">

        {icon}

      </div>

      <div>

        <h3 className="text-white font-semibold text-lg">

          {title}

        </h3>

        <p className="text-gray-400 text-sm">

          {desc}

        </p>

      </div>

    </motion.div>
  );
}