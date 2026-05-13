import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-28">
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-700/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-700/20 blur-[140px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[50px] border border-purple-500/20 bg-gradient-to-br from-purple-500/15 via-white/[0.03] to-indigo-500/10 backdrop-blur-[30px] px-8 md:px-16 py-20 md:py-28 text-center shadow-[0_20px_80px_rgba(124,58,237,0.25)]">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%)]"></div>

          {/* Floating Orbs */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-2xl"></div>

          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-indigo-500/10 blur-2xl"></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-purple-500/20 backdrop-blur-2xl text-purple-200 mb-8">
              <Sparkles size={16} />
              Start Your AI Journey Today
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8">
              Ready To Grow
              <br />

              <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
                With AI Automation?
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-12">
              Build intelligent AI chatbots, automate customer support,
              collect leads, and scale your business with AIAERA.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              {/* Main CTA */}
              <button
                onClick={() => navigate("/signup")}
                className="group relative px-10 py-5 rounded-2xl overflow-hidden bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] font-semibold text-lg shadow-[0_15px_50px_rgba(124,58,237,0.45)] hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Free Today

                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-all"
                  />
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all"></div>
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-5 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl hover:bg-white/[0.08] transition-all duration-300 text-lg"
              >
                Login
              </button>
            </div>

            {/* Bottom Text */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/45 text-sm">
              <p>✔ No Credit Card Required</p>

              <p>✔ Instant Setup</p>

              <p>✔ Cancel Anytime</p>
            </div>
          </div>

          {/* Bottom Border Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9]"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;