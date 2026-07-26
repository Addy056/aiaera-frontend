
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Bot,
  CalendarCheck,
  Users,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/aiaera-logo.png";

const featureCards = [
  {
    icon: Bot,
    title: "AI Chat Assistant",
    description: "Replies instantly to customers with brand-safe conversations.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description: "Automatically schedules meetings and qualifies leads in real time.",
  },
  {
    icon: Users,
    title: "Lead Capture",
    description: "Converts visitors into qualified opportunities without friction.",
  },
];

const backgroundDots = [
  { top: "11%", left: "18%" },
  { top: "24%", left: "72%" },
  { top: "68%", left: "22%" },
  { top: "78%", left: "78%" },
];

export default function Login() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (user) navigate("/app/dashboard", { replace: true });
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setErrorMsg("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setErrorMsg(error.message);
    else {
      setErrorMsg("");
      setResetMessage("Password reset email sent.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.22),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(124,58,237,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.09)_1px,transparent_1px)] [background-size:44px_44px]" />

      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-fuchsia-400/25 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -12, 0], y: [0, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-6rem] left-[-6rem] h-80 w-80 rounded-full bg-violet-400/20 blur-[140px]"
      />

      {backgroundDots.map((dot, index) => (
        <motion.div
          key={`${dot.top}-${dot.left}`}
          animate={{ y: [0, -10, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
          className="absolute h-2 w-2 rounded-full bg-[#A855F7]/70"
          style={{ top: dot.top, left: dot.left }}
        />
      ))}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[55%_45%]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-8 flex items-center gap-3 text-sm font-medium text-violet-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-200/80 bg-white/80 shadow-sm backdrop-blur">
                <img src={logo} alt="AIAERA" className="h-6 w-6 object-contain" />
              </div>
              <span className="rounded-full border border-violet-200/80 bg-violet-50 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-violet-700">
                Enterprise AI Platform
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build Your{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                AI Workforce
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Create AI assistants trained on your business, automate conversations,
              capture qualified leads, and book meetings automatically.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="rounded-[24px] border border-violet-100/80 bg-white/70 p-5 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.3)] backdrop-blur-xl"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/15 to-fuchsia-500/15 text-violet-700">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <span>Trusted by growing businesses.</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[480px] rounded-[32px] border border-violet-100/80 bg-white/80 p-6 shadow-[0_30px_90px_-28px_rgba(124,58,237,0.35)] backdrop-blur-2xl sm:p-8 lg:p-9">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-violet-50">
                    <img src={logo} alt="AIAERA logo" className="h-6 w-6 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">AIAERA</p>
                    <p className="text-xs text-slate-500">Welcome Back</p>
                  </div>
                </div>
                <span className="rounded-full border border-violet-200/80 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
                  Secure
                </span>
              </div>

              <div className="mt-8">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Sign in to AIAERA</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Manage your AI assistants, customers, automations, and conversations.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              )}
              {resetMessage && (
                <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 size={16} />
                  {resetMessage}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div className="group relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-[56px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-[56px] w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-[15px] text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-violet-700 transition-colors hover:text-violet-800"
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ y: -1, scale: 1.01, boxShadow: "0 16px 40px rgba(124, 58, 237, 0.25)" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {loading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-semibold text-violet-700 transition-colors hover:text-violet-800">
                  Create Account
                </Link>
              </p>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                <ShieldCheck size={14} />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
