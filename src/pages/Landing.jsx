import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Landing() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="bg-[#0b0814] text-white min-h-screen overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-600/30 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full"></div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10 backdrop-blur-xl relative z-10">
        <h1 className="text-2xl font-bold text-purple-400">AIAERA</h1>

        <div className="space-x-6 flex items-center">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-purple-600 px-5 py-2 rounded-xl hover:scale-105 transition"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 px-5 py-2 rounded-xl hover:scale-105 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-10 py-24 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

        {/* LEFT */}
        <div>
          <h1 className="text-6xl font-bold leading-tight">
            Your AI Sales Agent <br />
            <span className="text-purple-400">Works 24/7</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Convert visitors into leads, book appointments, and automate replies —
            all with one powerful AI chatbot.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/signup"
              className="bg-purple-600 px-8 py-3 rounded-xl text-lg hover:scale-105 transition shadow-lg"
            >
              Build Your Bot
            </Link>

            <button className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10">
              Live Demo
            </button>
          </div>

          {/* TRUST */}
          <div className="mt-10 flex gap-10 text-sm text-gray-400">
            <span>⚡ Instant Replies</span>
            <span>📈 More Leads</span>
            <span>🤖 Fully Automated</span>
          </div>
        </div>

        {/* RIGHT - CHAT UI MOCK */}
        <div className="relative">

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

            <div className="space-y-4">

              <div className="bg-white/10 px-4 py-2 rounded-lg w-fit">
                Hi, I need help with services
              </div>

              <div className="bg-purple-600 px-4 py-2 rounded-lg w-fit ml-auto">
                Sure! We provide AI chatbots that generate leads and book calls.
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-lg w-fit">
                Can I book a demo?
              </div>

              <div className="bg-purple-600 px-4 py-2 rounded-lg w-fit ml-auto">
                Yes! Please share your email and we’ll schedule it instantly.
              </div>

            </div>
          </div>

          {/* FLOATING EFFECT */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/30 blur-2xl rounded-full"></div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-10 py-24 max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-16">
          Built for Modern Businesses
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-20 relative z-10">
        <h2 className="text-4xl font-bold">
          Start Automating Today 🚀
        </h2>

        <Link
          to="/signup"
          className="inline-block mt-6 bg-purple-600 px-10 py-4 rounded-xl text-lg hover:scale-105 transition"
        >
          Get Started Free
        </Link>
      </section>

    </div>
  );
}

const features = [
  { title: "AI Chatbot Builder", desc: "Train chatbot with your business data." },
  { title: "Website Scraping", desc: "Auto-learn from your website." },
  { title: "File Upload", desc: "Use PDFs & CSVs for knowledge." },
  { title: "Lead Capture", desc: "Capture user details automatically." },
  { title: "WhatsApp Automation", desc: "Auto reply instantly." },
  { title: "Appointments", desc: "Book meetings with Calendly." }
];