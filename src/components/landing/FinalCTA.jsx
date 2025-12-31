export default function FinalCTA() {
  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/3 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-fuchsia-600/15 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* glass container */}
        <div className="rounded-[36px] bg-gradient-to-br from-white/10 to-white/5 p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <div className="rounded-[36px] bg-[#11111d]/80 backdrop-blur-2xl border border-white/10 px-10 py-20">

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Start Building Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI Chatbot
              </span>{" "}
              Today
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
              Launch smarter conversations, capture more leads,
              and automate customer engagement in minutes.
            </p>

            <p className="mt-3 text-sm text-gray-400">
              No credit card required. Cancel anytime.
            </p>

            <div className="mt-12 flex justify-center gap-6">
              <button className="px-10 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-[0_20px_50px_rgba(127,90,240,0.45)] hover:scale-[1.04] transition">
                Get Started Free
              </button>

              <button className="px-10 py-4 rounded-xl font-medium text-white border border-white/20 hover:bg-white/10 transition">
                View Live Demo
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
