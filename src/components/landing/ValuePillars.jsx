export default function ValuePillars() {
  return (
    <section className="relative py-28 bg-[#0a0a14] overflow-hidden">

      {/* ambient background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-fuchsia-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Built for <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Real Business Growth
            </span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            AIAERA is designed for real-world use cases — from lead capture
            to automated support and scalable customer engagement.
          </p>
        </div>

        {/* value cards */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-xl transition hover:-translate-y-1">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Built for Real Business Use
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Qualify leads, answer customer questions, and book meetings
                automatically — 24/7 without manual effort.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-xl transition hover:-translate-y-1">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-xl mb-6">
                🎛️
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Fully Customizable & Controlled
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your data stays yours. Customize chatbot tone, training
                sources, behavior, and responses per business.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-xl transition hover:-translate-y-1">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl mb-6">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Designed to Scale
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Multi-language support, high-volume conversations, and
                enterprise-grade reliability as you grow.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
