import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Sparkles,
  Play,
  CheckCircle2,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Conversations",
  },
  {
    value: "500+",
    label: "Businesses",
  },
  {
    value: "24/7",
    label: "AI Support",
  },
];

const features = [
  "Website AI",
  "Lead Capture",
  "WhatsApp",
  "Instagram",
  "Appointment Booking",
  "50+ Languages",
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-56 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl sm:h-[650px] sm:w-[650px]" />
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-45 sm:bg-[size:60px_60px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-1/2 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm sm:px-5 sm:py-2 sm:text-sm">
            <Sparkles size={16} className="shrink-0 text-violet-600 animate-pulse" />
            AI Powered Business Automation
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight leading-[1.12] text-slate-900 sm:mt-8 sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Your AI Employee
            <span className="my-1 block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent sm:my-2">
              Works 24/7
            </span>
            So You Don't Have To.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:mt-8 sm:text-lg">
            Build an AI assistant trained on your website, PDFs and business
            knowledge. Instantly answer customers, capture leads, automate
            WhatsApp & Instagram conversations and book appointments—all from
            one platform.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:mt-10 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-6.5 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto sm:px-8"
            >
              Start Free Trial
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6.5 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 sm:w-auto sm:px-8">
              <Play size={18} className="shrink-0 text-violet-600 fill-violet-600" />
              Watch Demo
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 sm:mt-12 sm:gap-6 border-y border-slate-200/60 py-6">
            {stats.map((item) => (
              <div key={item.label}>
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl md:text-4xl tracking-tight">
                  {item.value}
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500 sm:mt-1 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-2.5">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs sm:px-4 sm:py-2 sm:text-sm hover:border-violet-200 hover:text-violet-700 transition-colors"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative mt-8 flex w-full justify-center lg:mt-0 lg:w-1/2">
          <div className="absolute -top-12 right-1/2 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl lg:-top-12 lg:right-12 lg:translate-x-0" />

          <div className="relative w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/50 sm:rounded-[36px] sm:p-7">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-200 sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    AIAERA Assistant
                  </h3>
                  <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI Online
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 border border-violet-100">
                Live Preview
              </span>
            </div>

            {/* Chat Content */}
            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-4">
              
              {/* AI Message */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white sm:h-9 sm:w-9 sm:rounded-xl">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-slate-100 p-3.5 text-xs text-slate-700 sm:max-w-[80%] sm:rounded-2xl sm:rounded-tl-xs sm:px-4 sm:py-3 sm:text-sm leading-relaxed">
                  👋 Hello! Welcome to AIAERA. How can I help you today?
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-violet-600 p-3.5 text-xs text-white shadow-md shadow-violet-200 sm:max-w-[80%] sm:rounded-2xl sm:rounded-tr-xs sm:px-4 sm:py-3 sm:text-sm leading-relaxed">
                  I'd like to schedule a demo for my business.
                </div>
              </div>

              {/* AI Reply */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white sm:h-9 sm:w-9 sm:rounded-xl">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-slate-100 p-3.5 text-xs text-slate-700 sm:max-w-[80%] sm:rounded-2xl sm:rounded-tl-xs sm:px-4 sm:py-3 sm:text-sm leading-relaxed">
                  Great! 📅 I can book a meeting instantly. Please choose your preferred date and time.
                </div>
              </div>

              {/* Booking Card inside chat */}
              <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-3.5 sm:p-4 ml-10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                      Demo Meeting
                    </h4>
                    <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                      Friday • 3:30 PM (15 mins)
                    </p>
                  </div>
                  <button className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700">
                    Confirm
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex w-full items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  readOnly
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-700 outline-none sm:px-4 sm:py-3.5 sm:text-sm"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-700 sm:px-5 sm:py-3.5 sm:text-sm shadow-sm"
                >
                  Send
                </button>
              </div>

            </div>

            {/* Bottom Metrics Bar */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:mt-6 sm:gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3">
                <div className="flex items-center gap-1.5 text-violet-600">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Chats
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-black text-slate-900 sm:text-lg">
                  12.5K
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Leads
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-black text-slate-900 sm:text-lg">
                  1,248
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <BarChart3 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Conv.
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-black text-slate-900 sm:text-lg">
                  38%
                </h3>
              </div>
            </div>

            {/* Floating Card - Lead */}
            <div className="absolute -left-10 top-16 hidden w-60 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 xl:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    New Lead Captured
                  </p>
                  <h4 className="mt-0.5 truncate text-xs font-bold text-slate-900">
                    Sarah Johnson
                  </h4>
                  <p className="truncate text-[11px] text-slate-500">
                    Interested in AI Automation
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card - Appointment */}
            <div className="absolute -right-16 top-48 hidden w-60 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 2xl:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Calendar size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Appointment Booked
                  </p>
                  <h4 className="mt-0.5 truncate text-xs font-bold text-slate-900">
                    Demo Meeting
                  </h4>
                  <p className="truncate text-[11px] text-slate-500">
                    Today • 3:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card - Global */}
            <div className="absolute -bottom-10 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 2xl:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Globe size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Languages
                  </p>
                  <h4 className="mt-0.5 truncate text-xs font-bold text-slate-900">
                    50+ Supported
                  </h4>
                  <p className="truncate text-[11px] text-slate-500">
                    Global AI Assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="absolute -right-3 -top-3 hidden items-center gap-2.5 rounded-2xl border border-violet-100 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg lg:flex">
              <ShieldCheck size={18} className="text-violet-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Enterprise Ready
                </p>
                <p className="text-[10px] text-slate-500">
                  Secure • Reliable
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;