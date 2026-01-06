import { useNavigate } from "react-router-dom";
import Button from "../ui/button";
import dashboardImg from "../../assets/dashboard.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#0a0a14] overflow-hidden">
      {/* subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#14142a] via-[#0a0a14] to-[#0a0a14]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight">
            Build AI Chatbots
            <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              for Your Business
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-xl leading-relaxed">
            Train AI chatbots using your website, documents, and data —
            deploy them on web & WhatsApp in minutes.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button onClick={() => navigate("/signup")}>
              Get Started Free
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/pricing")}
            >
              View Pricing
            </Button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="relative">
          {/* controlled gradient frame */}
          <div
            className="absolute -inset-4 rounded-3xl
                       bg-gradient-to-br from-purple-500/25 via-transparent to-transparent"
          />

          <img
            src={dashboardImg}
            alt="AIAERA Dashboard"
            loading="lazy"
            decoding="async"
            width="1200"
            height="750"
            className="relative rounded-2xl
                       border border-white/10
                       bg-[#11111b]
                       shadow-[0_35px_90px_rgba(0,0,0,0.65]"
          />
        </div>

      </div>
    </section>
  );
}
