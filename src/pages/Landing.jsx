import {
  Sparkles,
  Bot,
  Globe,
  Upload,
  MessageSquare,
  ArrowRight,
  Play,
  Star,
  Zap,
  Shield,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  Rocket,
  Activity,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import logo from "../assets/aiaera-logo.png";

export default function Landing() {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="relative bg-[#020617] text-white overflow-hidden">

      {/* ========================================= */}
      {/* BACKGROUND */}
      {/* ========================================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full"></div>

        <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-blue-600/20 blur-[180px] rounded-full"></div>

        <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-violet-500/10 blur-[160px] rounded-full"></div>

      </div>

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* ========================================= */}
      {/* NAVBAR */}
      {/* ========================================= */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-3xl bg-black/20">

        <div className="max-w-7xl mx-auto px-8 lg:px-12 h-24 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-4">

           <div className="relative">

  {/* GLOW */}
  <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full"></div>

  <img
    src={logo}
    alt="AIAERA"
    className="relative w-14 h-14 object-contain drop-shadow-[0_10px_40px_rgba(124,58,237,0.55)]"
  />

</div>

            <div>

              <h1 className="text-2xl font-black tracking-tight">
                AIAERA
              </h1>

              <p className="text-xs text-gray-400">
                AI Automation Platform
              </p>

            </div>

          </div>

          {/* LINKS */}
          <div className="hidden lg:flex items-center gap-10 text-gray-300">

            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>

          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-4">

            {user ? (
              <button
                onClick={() => navigate("/app/dashboard")}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all font-semibold shadow-[0_20px_60px_rgba(124,58,237,0.45)]"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:flex text-gray-300 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="h-12 px-7 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-500 to-blue-600 hover:scale-105 transition-all flex items-center gap-2 font-semibold shadow-[0_20px_60px_rgba(124,58,237,0.45)]"
                >

                  Get Started

                  <ArrowRight size={18} />

                </Link>
              </>
            )}

          </div>

        </div>

      </nav>

      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}
      <section className="relative min-h-screen flex items-center px-8 lg:px-12 pt-10 pb-24">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl mb-8">

              <Zap className="text-purple-400" size={16} />

              <span className="text-sm text-gray-300">
                AI-Powered Business Automation
              </span>

            </div>

            <h1 className="text-6xl lg:text-8xl font-black leading-[0.92] tracking-[-3px] mb-10">

              Build Your
              <span className="block bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">

                AI Workforce

              </span>

            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mb-12">

              Train AI assistants using your business knowledge,
              PDFs, CSVs, and website content.
              Capture leads, automate replies, and scale conversations 24/7.

            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-5 mb-14">

              <Link
                to="/signup"
                className="h-16 px-9 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-500 to-blue-600 hover:scale-[1.03] transition-all duration-300 flex items-center gap-3 text-lg font-semibold shadow-[0_20px_80px_rgba(124,58,237,0.5)]"
              >

                Launch Your AI

                <Rocket size={20} />

              </Link>

              <button className="h-16 px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-lg backdrop-blur-2xl">

                <Play size={18} />

                Watch Demo

              </button>

            </div>

            {/* TRUST */}
            <div className="flex flex-wrap gap-8">

              <Trust text="24/7 AI Automation" />
              <Trust text="Lead Generation" />
              <Trust text="Website Integration" />

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center">

            {/* PERFORMANCE CARD */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute right-[-120px] top-[80px] hidden 2xl:block z-30"
            >

              <div className="w-[320px] rounded-[34px] border border-white/10 bg-[#0B1120]/95 backdrop-blur-3xl p-7 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <p className="text-sm text-gray-400">
                      AI Performance
                    </p>

                    <h2 className="text-6xl font-black mt-2">
                      +342
                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">

                    <Activity className="text-green-400" />

                  </div>

                </div>

                <div className="h-3 bg-white/10 rounded-full overflow-hidden">

                  <div className="w-[82%] h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-green-400">

                  <Star size={15} />

                  <span className="text-sm">
                    28% increase in conversion
                  </span>

                </div>

              </div>

            </motion.div>

            {/* LEAD CARD */}
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute left-[-150px] bottom-[70px] hidden 2xl:block z-30"
            >

              <div className="w-[340px] rounded-[34px] border border-white/10 bg-[#0B1120]/95 backdrop-blur-3xl p-7 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <p className="text-sm text-gray-400">
                      New Lead Captured
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Sarah Johnson
                    </h3>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">

                    <MessageSquare className="text-purple-400" />

                  </div>

                </div>

                <p className="text-gray-300 leading-relaxed">

                  Interested in AI chatbot deployment for clinic website.
                  Requested pricing and live demo.

                </p>

                <div className="mt-6 flex items-center gap-3">

                  <div className="w-3 h-3 rounded-full bg-green-400"></div>

                  <span className="text-green-400 text-sm">
                    Lead Qualified
                  </span>

                </div>

              </div>

            </motion.div>

            {/* CHATBOT */}
            <div className="relative z-20 rounded-[42px] w-full max-w-[720px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.75)]">

              {/* HEADER */}
              <div className="h-24 border-b border-white/10 flex items-center justify-between px-7">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">

                    <Bot />

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
                      AIAERA Assistant
                    </h3>

                    <p className="text-green-400 text-sm">
                      AI Online
                    </p>

                  </div>

                </div>

              </div>

              {/* CHAT */}
              <div className="relative h-[650px] overflow-hidden bg-gradient-to-b from-[#081020] to-[#050816] p-8">

                <div className="space-y-6 relative z-10">

                  <ChatBubble
                    left
                    text="Hi 👋 I'm your AI assistant. How can I help you today?"
                  />

                  <ChatBubble text="I want to automate customer support for my clinic." />

                  <ChatBubble
                    left
                    text="Absolutely! I can help capture leads, answer FAQs, and book appointments automatically."
                  />

                  <ChatBubble text="Can it integrate with WhatsApp?" />

                  <ChatBubble
                    left
                    text="Yes ✅ WhatsApp, website widgets, and social integrations are fully supported."
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* FEATURES */}
      {/* ========================================= */}
      <section
        id="features"
        className="relative z-10 px-8 lg:px-12 py-36"
      >

        <div className="max-w-7xl mx-auto">

          {/* HEADING */}
          <div className="text-center mb-24">

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">

              <Sparkles
                size={16}
                className="text-purple-400"
              />

              <span className="text-sm text-gray-300">
                Enterprise AI Infrastructure
              </span>

            </div>

            <h2 className="text-6xl lg:text-7xl font-black tracking-[-3px] mb-8">

              Built for
              <span className="block bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">

                Modern Businesses

              </span>

            </h2>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* BIG CARD */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-3xl p-10">

              <div className="relative z-10">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-8">

                  <Bot size={32} />

                </div>

                <h3 className="text-4xl font-black mb-6 leading-tight">
                  AI Chatbot Builder
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-10">

                  Upload PDFs, scrape websites, add business descriptions,
                  and instantly create intelligent AI assistants.

                </p>

                <div className="grid grid-cols-2 gap-5">

                  <MiniFeature
                    icon={<Upload size={18} />}
                    text="PDF & CSV Uploads"
                  />

                  <MiniFeature
                    icon={<Globe size={18} />}
                    text="Website Scraping"
                  />

                  <MiniFeature
                    icon={<BrainCircuit size={18} />}
                    text="AI Training"
                  />

                  <MiniFeature
                    icon={<Shield size={18} />}
                    text="Enterprise Security"
                  />

                </div>

              </div>

            </div>

            {/* SIDE */}
            <div className="lg:col-span-5 flex flex-col gap-8">

              <FeatureCard
                icon={<MessageSquare />}
                title="Lead Generation"
                desc="Capture customer emails and appointment requests automatically."
              />

              <FeatureCard
                icon={<BarChart3 />}
                title="Realtime Analytics"
                desc="Monitor conversations and AI performance in realtime."
              />

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* CTA */}
      {/* ========================================= */}
      <section className="relative z-10 px-8 lg:px-12 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-br from-purple-600/20 via-violet-600/10 to-blue-600/20 backdrop-blur-3xl p-12 shadow-[0_30px_120px_rgba(124,58,237,0.2)]">

            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-500/20 blur-[140px] rounded-full"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

              <div>

                <h2 className="text-5xl font-black leading-tight mb-5">

                  Ready to Build
                  <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">

                    Your AI Chatbot?

                  </span>

                </h2>

                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">

                  Launch an AI assistant trained on your business in minutes.

                </p>

              </div>

              <Link
                to="/signup"
                className="shrink-0 h-16 px-10 rounded-2xl bg-white text-black hover:scale-105 transition-all flex items-center gap-3 text-lg font-bold shadow-2xl"
              >

                Build Your Chatbot

                <ArrowRight size={20} />

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* PRICING */}
      {/* ========================================= */}
      <section
        id="pricing"
        className="relative z-10 px-8 lg:px-12 pb-32"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-24">

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">

              <Sparkles
                size={16}
                className="text-purple-400"
              />

              <span className="text-sm text-gray-300">
                Flexible Pricing
              </span>

            </div>

            <h2 className="text-6xl lg:text-7xl font-black tracking-[-3px] mb-8">

              Pricing Built
              <span className="block bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">

                For Growth

              </span>

            </h2>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            <PricingCard
              title="Free Plan"
              price="₹0"
              desc="Perfect for trying AIAERA"
              features={[
                "AI Chatbot Builder",
                "Website Widget",
                "Basic Support",
                "Lead Collection",
              ]}
            />

            <PricingCard
              popular
              title="Basic Plan"
              price="₹999"
              desc="Best for growing businesses"
              features={[
                "Everything in Free",
                "Advanced AI Training",
                "Custom Branding",
                "Analytics Dashboard",
                "Priority Support",
              ]}
            />

            <PricingCard
              title="Pro Plan"
              price="₹1999"
              desc="Full AI automation suite"
              features={[
                "Everything in Basic",
                "WhatsApp Automation",
                "Facebook Integration",
                "Appointment Booking",
                "Advanced Analytics",
              ]}
            />

          </div>

        </div>

      </section>

    </div>
  );
}

/* ========================================= */
/* CHAT BUBBLE */
/* ========================================= */
function ChatBubble({ text, left }) {
  return (
    <div className={`flex ${left ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[68%] break-words px-6 py-4 rounded-[26px] text-[15px] leading-relaxed shadow-2xl ${
          left
            ? "bg-white/10 border border-white/10 text-white"
            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Trust({ text }) {
  return (
    <div className="flex items-center gap-2 text-gray-300">
      <CheckCircle2 size={18} className="text-green-400" />
      {text}
    </div>
  );
}

function MiniFeature({ icon, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 flex items-center gap-3 text-gray-300">
      <div className="text-purple-400">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-3xl p-8 h-full">

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6">

        {icon}

      </div>

      <h3 className="text-3xl font-black mb-4">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed">
        {desc}
      </p>

    </div>
  );
}

function PricingCard({
  title,
  price,
  desc,
  features,
  popular,
}) {

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      className={`relative overflow-hidden rounded-[40px] border p-10 backdrop-blur-3xl ${
        popular
          ? "border-purple-500/30 bg-gradient-to-b from-purple-600/20 to-blue-600/10 shadow-[0_30px_120px_rgba(124,58,237,0.25)]"
          : "border-white/10 bg-white/5"
      }`}
    >

      {popular && (
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm">

          Most Popular

        </div>
      )}

      <h3 className="text-3xl font-black mb-4">
        {title}
      </h3>

      <h2 className="text-6xl font-black mb-3">
        {price}
      </h2>

      <p className="text-gray-400 mb-10">
        {desc}
      </p>

      <div className="space-y-5 mb-12">

        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-gray-300"
          >

            <CheckCircle2
              size={18}
              className="text-green-400"
            />

            {feature}

          </div>
        ))}

      </div>

      <Link
        to="/signup"
        className={`h-14 rounded-2xl flex items-center justify-center font-semibold transition-all ${
          popular
            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]"
            : "border border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >

        Get Started

      </Link>

    </motion.div>
  );
}