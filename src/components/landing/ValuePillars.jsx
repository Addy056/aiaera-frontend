export default function ValuePillars() {
  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Built for{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Real Business Growth
            </span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            AIAERA is designed for real-world use cases — from lead capture
            to automated support and scalable customer engagement.
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <ValueCard
            icon="⚡"
            title="Built for Real Business Use"
            text="Qualify leads, answer customer questions, and book meetings automatically — 24/7 without manual effort."
            accent="from-purple-500/25"
          />

          {/* Card 2 */}
          <ValueCard
            icon="🎛️"
            title="Fully Customizable & Controlled"
            text="Your data stays yours. Customize chatbot tone, training sources, behavior, and responses per business."
            accent="from-fuchsia-500/25"
          />

          {/* Card 3 */}
          <ValueCard
            icon="📈"
            title="Designed to Scale"
            text="Multi-language support, high-volume conversations, and enterprise-grade reliability as you grow."
            accent="from-indigo-500/25"
          />

        </div>
      </div>
    </section>
  );
}

function ValueCard({ icon, title, text, accent }) {
  return (
    <div
      className={`group relative rounded-3xl p-[1px]
                  bg-gradient-to-br ${accent} via-transparent to-transparent`}
    >
      <div
        className="h-full rounded-3xl
                   bg-[#11111b]
                   border border-white/10
                   p-10
                   shadow-[0_30px_80px_rgba(0,0,0,0.6)]
                   transition
                   group-hover:border-purple-400/25
                   group-hover:-translate-y-[2px]"
      >
        <div className="w-12 h-12 rounded-xl
                        bg-white/5
                        border border-white/10
                        flex items-center justify-center
                        text-lg mb-6">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
