import {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

import { supabase } from "../lib/supabase";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

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
} from "lucide-react";

import { motion } from "framer-motion";

import logo from "../assets/aiaera-logo.png";

export default function Signup() {
  const navigate =
    useNavigate();

  const {
    user,
    loading: authLoading,
  } = useContext(
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

  const [successMsg, setSuccessMsg] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  /*
  =========================================
  PREVENT DUPLICATE REQUESTS
  =========================================
  */
  const signupInProgress =
    useRef(false);

  /*
  =========================================
  USE AUTH CONTEXT
  REMOVE getSession()
  TO PREVENT LOCK ERRORS
  =========================================
  */
  useEffect(() => {
    if (
      !authLoading &&
      user
    ) {
      navigate(
        "/app/dashboard",
        {
          replace: true,
        }
      );
    }
  }, [
    user,
    authLoading,
    navigate,
  ]);

  /*
  =========================================
  SIGNUP
  =========================================
  */
  const handleSignup =
    async (e) => {
      e.preventDefault();

      if (
        loading ||
        signupInProgress.current
      ) {
        return;
      }

      signupInProgress.current =
        true;

      setLoading(true);

      setErrorMsg("");

      setSuccessMsg("");

      try {
        const {
          data,
          error,
        } =
          await supabase.auth.signUp(
            {
              email:
                email.trim(),
              password,
            }
          );

        if (error) {
          if (
            error.message
              ?.toLowerCase()
              .includes(
                "already registered"
              )
          ) {
            throw new Error(
              "Account already exists. Please login instead."
            );
          }

          throw error;
        }

        const createdUser =
          data?.user;

        if (
          !createdUser
        ) {
          throw new Error(
            "Failed to create account"
          );
        }

        /*
        =========================================
        CREATE TRIAL SUBSCRIPTION
        =========================================
        */
        const expiresAt =
          new Date();

        expiresAt.setDate(
          expiresAt.getDate() +
            7
        );

        const {
          error:
            subscriptionError,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .upsert(
              {
                user_id:
                  createdUser.id,
                plan:
                  "trial",
                status:
                  "active",
                messages_used:
                  0,
                messages_limit:
                  200,
                started_at:
                  new Date().toISOString(),
                expires_at:
                  expiresAt.toISOString(),
              },
              {
                onConflict:
                  "user_id",
              }
            );

        if (
          subscriptionError
        ) {
          console.error(
            "SUBSCRIPTION ERROR:",
            subscriptionError
          );
        }

        setSuccessMsg(
          "🎉 Account created successfully! Redirecting to login..."
        );

        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate(
            "/login"
          );
        }, 1800);
      } catch (err) {
        console.error(
          "SIGNUP ERROR:",
          err
        );

        if (
          err?.message
            ?.toLowerCase()
            .includes(
              "lock"
            )
        ) {
          setErrorMsg(
            "Authentication conflict detected. Please refresh and try again."
          );
        } else {
          setErrorMsg(
            err?.message ||
              "Signup failed"
          );
        }
      } finally {
        setLoading(false);

        signupInProgress.current =
          false;
      }
    };

  /*
  =========================================
  LOADING
  =========================================
  */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (    <div className="min-h-screen bg-[#050816] relative overflow-hidden flex items-center justify-center px-6 py-10">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-150px] left-[-120px] w-[450px] h-[450px] bg-purple-600/25 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] bg-blue-600/20 blur-[160px] rounded-full"></div>

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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">

            <Sparkles className="w-4 h-4 text-purple-400" />

            <span className="text-sm text-gray-300">
              Start Your 7-Day AI Automation Trial
            </span>

          </div>

          <h1 className="text-7xl font-black leading-[0.92] tracking-[-4px] text-white mb-8">

            Build Your

            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">

              AI Workforce

            </span>

          </h1>

          <p className="text-gray-400 text-xl leading-relaxed mb-14 max-w-xl">

            Create AI assistants trained on your business,
            automate customer conversations,
            capture leads,
            and deploy everywhere in minutes.

          </p>

          <div className="space-y-5">

            <FeatureCard
              icon={
                <Bot className="text-purple-400" />
              }
              title="Website AI Chatbot"
              desc="Deploy smart AI assistants on your website"
            />

            <FeatureCard
              icon={
                <Rocket className="text-blue-400" />
              }
              title="Lead & Appointment Automation"
              desc="Capture leads and automate bookings"
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

          <div className="relative rounded-[36px] p-[1px] bg-gradient-to-br from-purple-500/30 via-white/10 to-blue-500/30 shadow-[0_20px_120px_rgba(0,0,0,0.55)]">

            <div className="relative bg-[#0B1120]/90 backdrop-blur-3xl rounded-[36px] p-8 overflow-hidden">

              <div className="relative flex justify-center mb-10">

                <div className="absolute w-24 h-24 bg-purple-500/20 blur-[55px] rounded-[28px]"></div>

                <div className="relative w-[88px] h-[88px] rounded-[24px] border border-white/10 bg-[#0A0F1F] backdrop-blur-3xl flex items-center justify-center shadow-[0_20px_60px_rgba(124,58,237,0.35)]">

                  <img
                    src={logo}
                    alt="AIAERA"
                    className="w-16 h-16 object-contain"
                  />

                </div>

              </div>

              <div className="text-center mb-8"></div>
                            <div className="text-center mb-8">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-5">

                  <Clock3
                    size={15}
                    className="text-purple-300"
                  />

                  <span className="text-sm text-purple-200 font-medium">
                    7-Day Free Trial
                  </span>

                </div>

                <h2 className="text-5xl font-black text-white mb-3 tracking-[-2px]">

                  Create Account

                </h2>

                <p className="text-gray-400 leading-relaxed">

                  Start your AI automation journey today

                </p>

              </div>

              {errorMsg && (

                <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-300 text-sm">

                  {errorMsg}

                </div>

              )}

              {successMsg && (

                <div className="mb-5 p-4 rounded-2xl bg-green-500/15 border border-green-500/20 text-green-300 text-sm flex items-center gap-2">

                  <CheckCircle2 size={16} />

                  {successMsg}

                </div>

              )}

              <form onSubmit={handleSignup}>

                <div className="mb-5">

                  <label className="block text-sm text-gray-300 mb-2">

                    Email Address

                  </label>

                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="mb-6">

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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >

                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}

                    </button>

                  </div>

                </div>                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all duration-300 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  {loading ? (

                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                  ) : (

                    <>
                      Start Free Trial
                      <ArrowRight size={18} />
                    </>

                  )}

                </button>

              </form>

              <div className="mt-8 text-center">

                <p className="text-gray-400">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="text-purple-400 font-semibold hover:text-purple-300"
                  >
                    Login
                  </Link>

                </p>

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