import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bot,
  ShieldCheck,
} from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.05),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.05),transparent_35%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-violet-200/40 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-100/40 blur-[90px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] border border-violet-100/80 bg-gradient-to-br from-violet-600 via-violet-600 to-purple-600 shadow-xl shadow-violet-600/15">

          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_40%)] pointer-events-none" />

          {/* Floating Card - Top Left */}
          <div className="absolute left-6 top-6 hidden xl:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-xl shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-violet-100">
                AI Assistant
              </p>
              <p className="text-xs font-bold text-white">
                Working 24/7
              </p>
            </div>
          </div>

          {/* Floating Card - Bottom Right */}
          <div className="absolute right-6 bottom-6 hidden xl:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-xl shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-violet-100">
                Enterprise
              </p>
              <p className="text-xs font-bold text-white">
                Secure Platform
              </p>
            </div>
          </div>

          <div className="relative z-10 px-6 py-12 sm:px-10 md:px-14 lg:py-20 text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl shadow-xs">
              <Sparkles size={14} className="text-yellow-300 shrink-0" />
              <span>AI Automation Platform</span>
            </div>

            {/* Heading */}
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight leading-[1.15] text-white sm:text-4xl md:text-5xl">
              Put AI To Work
              <span className="block mt-1 bg-gradient-to-r from-violet-100 to-purple-200 bg-clip-text text-transparent">
                For Your Business
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-violet-100">
              Train your AI assistant using your website, PDFs and business
              knowledge. Automate customer support, capture leads and book
              appointments while your business grows around the clock.
            </p>

            {/* Feature Pills */}
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {[
                "Website AI",
                "Lead Capture",
                "WhatsApp",
                "Facebook",
                "Instagram",
                "Appointment Booking",
                "Multi-language",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-xl shadow-xs transition hover:bg-white/15"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm sm:text-base font-semibold text-violet-700 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-50"
              >
                <span>Start Free Trial</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
              >
                Login
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              {[
                "No Credit Card Required",
                "Setup in Under 5 Minutes",
                "Cancel Anytime",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium"
                >
                  <CheckCircle2
                    size={15}
                    className="text-emerald-300 shrink-0"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="mt-10 sm:mt-14 grid gap-4 border-t border-white/15 pt-8 sm:pt-10 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xs text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  24/7
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-violet-100">
                  AI responds instantly to every customer without interruptions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xs text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  10K+
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-violet-100">
                  Automated customer conversations handled by intelligent AI assistants.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xs text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  99.9%
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-violet-100">
                  Reliable enterprise infrastructure built for modern businesses.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;