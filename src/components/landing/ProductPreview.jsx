export default function ProductPreview() {
  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            See AIAERA{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in Action
            </span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience how businesses automate conversations, capture
            high-quality leads, and book appointments effortlessly.
          </p>
        </div>

        {/* Preview Frame */}
        <div className="relative rounded-[32px] p-[1px]
                        bg-gradient-to-br from-purple-500/25 via-transparent to-transparent
                        shadow-[0_50px_140px_rgba(0,0,0,0.65)]">

          <div className="rounded-[32px] bg-[#11111b] border border-white/10 p-10">

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Chatbot Preview */}
              <div className="rounded-2xl bg-[#0f0f1a] border border-white/10 p-6">
                <p className="text-sm font-medium text-white mb-4">
                  🤖 AI Chatbot
                </p>

                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 text-gray-200 rounded-lg p-3 w-fit max-w-[85%]">
                    Hi! How can I help you today?
                  </div>

                  <div className="bg-purple-500/15 text-purple-200 rounded-lg p-3 ml-auto w-fit max-w-[85%]">
                    I want to book a demo
                  </div>

                  <div className="bg-white/10 text-gray-200 rounded-lg p-3 w-fit max-w-[85%]">
                    Sure! Please choose a time that works for you.
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="rounded-2xl bg-[#0f0f1a] border border-white/10 p-6">
                <p className="text-sm font-medium text-white mb-4">
                  📊 Dashboard
                </p>

                <div className="space-y-4">
                  <div className="h-3 bg-white/15 rounded w-3/4" />
                  <div className="h-3 bg-white/15 rounded w-1/2" />
                  <div className="h-3 bg-white/15 rounded w-2/3" />
                  <div className="h-28 bg-white/10 rounded-lg" />
                </div>
              </div>

              {/* Booking Preview */}
              <div className="rounded-2xl bg-[#0f0f1a] border border-white/10 p-6">
                <p className="text-sm font-medium text-white mb-4">
                  📅 Appointment Booking
                </p>

                <div className="space-y-4 text-sm text-gray-300">
                  <div className="rounded-lg bg-white/10 p-3">
                    Select Date
                  </div>

                  <div className="rounded-lg bg-white/10 p-3">
                    Select Time
                  </div>

                  <button
                    className="w-full mt-2 py-2.5 rounded-lg
                               bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80
                               text-white font-medium
                               shadow-[0_10px_40px_rgba(127,90,240,0.35)]
                               transition hover:translate-y-[-1px]"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
