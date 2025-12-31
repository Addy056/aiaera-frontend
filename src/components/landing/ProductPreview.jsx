export default function ProductPreview() {
  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            See AIAERA{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in Action
            </span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Experience how businesses automate conversations, capture
            high-quality leads, and book appointments effortlessly.
          </p>
        </div>

        {/* preview container */}
        <div className="relative rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <div className="rounded-[32px] bg-[#11111d]/80 backdrop-blur-2xl border border-white/10 p-10">

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Chat Preview */}
              <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm font-medium text-white mb-4">
                  🤖 AI Chatbot
                </p>

                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 text-gray-200 rounded-lg p-3 w-fit">
                    Hi! How can I help you today?
                  </div>
                  <div className="bg-purple-500/20 text-purple-200 rounded-lg p-3 ml-auto w-fit">
                    I want to book a demo
                  </div>
                  <div className="bg-white/10 text-gray-200 rounded-lg p-3 w-fit">
                    Sure! Please choose a time that works for you.
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm font-medium text-white mb-4">
                  📊 Dashboard
                </p>

                <div className="space-y-4">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-1/2" />
                  <div className="h-3 bg-white/20 rounded w-2/3" />
                  <div className="h-28 bg-white/10 rounded-lg" />
                </div>
              </div>

              {/* Booking Preview */}
              <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6">
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
                  <button className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium shadow-lg hover:scale-[1.02] transition">
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
