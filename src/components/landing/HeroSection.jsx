import { useNavigate } from "react-router-dom";
import { Sparkles, Bot, MessageSquare, Zap } from "lucide-react";
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-700/30 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-indigo-700/20 blur-[140px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-purple-500/20 backdrop-blur-2xl text-purple-200 mb-8 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <Sparkles size={16} />
              Next Generation AI Business Platform
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8">
              Build Smart
              <br />

              <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
                AI Chatbots
              </span>

              <br />
              For Your Business
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/65 leading-relaxed max-w-2xl mb-10">
              Automate customer support, generate leads, and grow your business
              using powerful AI chatbots for websites, WhatsApp, and social
              media.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-5 mb-14">
              <button
                onClick={() => navigate("/signup")}
                className="group relative px-8 py-4 rounded-2xl overflow-hidden bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] font-semibold shadow-[0_15px_50px_rgba(124,58,237,0.45)] hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">
                  Start Building
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all"></div>
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl hover:bg-white/[0.08] transition-all duration-300"
              >
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  10K+
                </h2>

                <p className="text-white/50 mt-1">
                  Messages Automated
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  500+
                </h2>

                <p className="text-white/50 mt-1">
                  Businesses
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  24/7
                </h2>

                <p className="text-white/50 mt-1">
                  AI Support
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl rounded-[50px]"></div>

            {/* Main Card */}
            <div className="relative w-full max-w-lg rounded-[40px] border border-white/10 bg-white/[0.05] backdrop-blur-[30px] p-7 shadow-[0_20px_80px_rgba(124,58,237,0.35)] overflow-hidden">
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">
                      AIAERA Assistant
                    </h3>

                    <p className="text-green-400 text-sm flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Online
                    </p>
                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-[0_10px_40px_rgba(124,58,237,0.45)]">
                    <Bot size={30} />
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-5">
                  {/* AI Message */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shrink-0">
                      <Bot size={18} />
                    </div>

                    <div className="bg-white/[0.06] border border-white/5 rounded-[24px] p-5 max-w-[80%]">
                      Hello 👋 How can I help you today?
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end gap-3">
                    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-[24px] p-5 max-w-[80%] shadow-[0_10px_40px_rgba(124,58,237,0.35)]">
                      I want to book a demo.
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <MessageSquare size={18} />
                    </div>
                  </div>

                  {/* AI Message */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shrink-0">
                      <Bot size={18} />
                    </div>

                    <div className="bg-white/[0.06] border border-white/5 rounded-[24px] p-5 max-w-[80%]">
                      Sure! Please choose your preferred date and time 📅
                    </div>
                  </div>

                  {/* Typing */}
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                      <Zap size={18} />
                    </div>

                    <div className="bg-white/[0.06] border border-white/5 rounded-[24px] px-5 py-4 flex gap-2">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-4 mt-8">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500/40 transition-all"
                  />

                  <button className="px-6 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_10px_40px_rgba(124,58,237,0.35)] hover:scale-105 transition-all">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hidden md:flex absolute -left-10 top-20 px-5 py-4 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                📈
              </div>

              <div>
                <p className="text-sm text-white/50">
                  Leads Generated
                </p>

                <h3 className="text-xl font-bold">
                  1,240+
                </h3>
              </div>
            </div>

            <div className="hidden md:flex absolute -right-10 bottom-20 px-5 py-4 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                ⚡
              </div>

              <div>
                <p className="text-sm text-white/50">
                  AI Automation
                </p>

                <h3 className="text-xl font-bold">
                  24/7 Active
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;