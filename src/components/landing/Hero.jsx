import dashboardImg from "../../assets/dashboard.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] overflow-hidden">

      {/* Ambient background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-[#7f5af0]/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-fuchsia-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Outer frame */}
      <div className="relative z-10 max-w-7xl w-full mx-4 rounded-[36px] bg-gradient-to-br from-white/10 to-white/5 p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

        {/* Inner glass */}
        <div className="rounded-[36px] bg-[#11111d]/80 backdrop-blur-2xl border border-white/10 p-12">

          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                Build AI Chatbots <br />
                for Your Business{" "}
                <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  In Minutes
                </span>
              </h1>

              <p className="mt-6 text-gray-300 max-w-lg text-lg">
                AIAERA lets you train powerful AI chatbots using your website,
                documents, and business data — then deploy them across web,
                WhatsApp, and social platforms.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <button className="relative px-7 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-[0_10px_40px_rgba(127,90,240,0.45)] hover:scale-[1.03] transition">
                  Get Started Free
                </button>

                <button className="px-7 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
                  Live Demo
                </button>
              </div>
            </div>

            {/* RIGHT – product preview */}
            <div className="relative">
              {/* glow */}
              <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-3xl" />

              {/* frame */}
              <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-[1px]">
                <div className="rounded-3xl bg-[#0b0b16] p-4">
                  <img
                    src={dashboardImg}
                    alt="AIAERA Dashboard"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>

          </div>

        

        </div>
      </div>
    </section>
  );
}
