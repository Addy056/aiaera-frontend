export default function Capabilities() {
  const items = [
    {
      title: "AI & Training",
      points: [
        "Website & document learning",
        "PDF & CSV uploads",
        "Advanced AI responses",
      ],
    },
    {
      title: "Multi-Channel Deployment",
      points: [
        "Website chat widget",
        "WhatsApp integration",
        "Social media bots",
      ],
    },
    {
      title: "Business Automation",
      points: [
        "Lead capture",
        "Calendly scheduling",
        "Data export",
      ],
    },
    {
      title: "Security & Governance",
      points: [
        "Secure authentication",
        "Role-based access",
        "Data privacy controls",
      ],
    },
  ];

  return (
    <section className="relative bg-[#0a0a14] py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Powerful{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to build, deploy, and scale AI-powered
            chatbots for real business use.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl p-[1px]
                         bg-gradient-to-b from-purple-500/20 via-transparent to-transparent"
            >
              {/* Inner card */}
              <div className="h-full rounded-2xl bg-[#11111b] p-8
                              border border-white/10
                              transition-all duration-300
                              group-hover:border-purple-400/30
                              group-hover:translate-y-[-2px]">

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl
                                bg-purple-500/10
                                border border-purple-400/20
                                text-purple-400
                                flex items-center justify-center
                                font-medium mb-6">
                  ●
                </div>

                <h3 className="text-lg font-semibold text-white mb-4">
                  {item.title}
                </h3>

                <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="text-purple-400 mt-[3px]">•</span>
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
