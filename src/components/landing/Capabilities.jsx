export default function Capabilities() {
  const items = [
    {
      title: "AI & Training",
      points: [
        "Website & document learning",
        "PDF & CSV uploads",
        "Advanced AI responses",
      ],
      icon: "🧠",
      glow: "from-purple-500/20",
    },
    {
      title: "Multi-Channel Deployment",
      points: [
        "Website chat widget",
        "WhatsApp integration",
        "Social media bots",
      ],
      icon: "🌐",
      glow: "from-fuchsia-500/20",
    },
    {
      title: "Business Automation",
      points: [
        "Lead capture",
        "Calendly scheduling",
        "Data export",
      ],
      icon: "⚙️",
      glow: "from-indigo-500/20",
    },
    {
      title: "Security & Governance",
      points: [
        "Secure authentication",
        "Role-based access",
        "Data privacy controls",
      ],
      icon: "🔐",
      glow: "from-sky-500/20",
    },
  ];

  return (
    <section className="relative py-28 bg-[#0a0a14] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Powerful{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to build, deploy, and scale AI-powered
            chatbots for real business use.
          </p>
        </div>

        {/* capability cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl transition hover:-translate-y-1"
            >
              {/* hover glow */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.glow} to-transparent opacity-0 group-hover:opacity-100 transition`}
              />

              <div className="relative">
                {/* icon */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>

                <ul className="space-y-3 text-gray-400 text-sm">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-[2px]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
