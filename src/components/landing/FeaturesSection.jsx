import {
  Bot,
  Globe,
  MessageSquare,
  Calendar,
  BarChart3,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot Builder",
    description:
      "Create advanced AI chatbots using business data, PDFs, CSV files, or website links in minutes.",
  },
  {
    icon: Globe,
    title: "Website Integration",
    description:
      "Deploy your chatbot instantly on your website using a lightweight embed script.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Automation",
    description:
      "Automatically respond to WhatsApp, Facebook, and Instagram customer messages using AI.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Allow customers to schedule meetings directly through AI using Calendly integration.",
  },
  {
    icon: BarChart3,
    title: "Lead Collection",
    description:
      "Capture customer leads automatically and manage everything from one dashboard.",
  },
  {
    icon: Languages,
    title: "Multi Language Support",
    description:
      "Support customers globally with multilingual AI-powered conversations.",
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-28"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700/10 blur-[150px] rounded-full"></div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-purple-500/20 backdrop-blur-2xl text-purple-200 mb-6">
            ✨ Premium AI Features
          </div>

          <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Everything You Need To
            <br />

            <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
              Automate Your Business
            </span>
          </h2>

          <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            AIAERA provides powerful AI tools to automate support,
            collect leads, handle appointments, and grow your business
            across every platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-[30px] p-8 hover:-translate-y-3 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-[36px] border border-transparent group-hover:border-purple-500/30 transition-all duration-500"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-18 h-18 rounded-[24px] bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center mb-7 shadow-[0_10px_40px_rgba(124,58,237,0.35)] group-hover:scale-110 transition-all duration-500">
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed text-[16px]">
                    {feature.description}
                  </p>

                  {/* Bottom Line */}
                  <div className="w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] mt-8 transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-[30px] p-8 text-center">
            <h3 className="text-5xl font-black bg-gradient-to-r from-[#c084fc] to-[#818cf8] bg-clip-text text-transparent mb-3">
              99%
            </h3>

            <p className="text-white/60">
              Faster Customer Response
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-[30px] p-8 text-center">
            <h3 className="text-5xl font-black bg-gradient-to-r from-[#c084fc] to-[#818cf8] bg-clip-text text-transparent mb-3">
              24/7
            </h3>

            <p className="text-white/60">
              AI Business Automation
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-[30px] p-8 text-center">
            <h3 className="text-5xl font-black bg-gradient-to-r from-[#c084fc] to-[#818cf8] bg-clip-text text-transparent mb-3">
              500+
            </h3>

            <p className="text-white/60">
              Businesses Using AIAERA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;