import { useNavigate } from "react-router-dom";
import Button from "../ui/button";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#0a0a14] py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Outer gradient frame */}
        <div
          className="relative rounded-3xl p-[1px]
                     bg-gradient-to-br from-purple-500/25 via-transparent to-transparent"
        >
          {/* Inner container */}
          <div
            className="rounded-3xl
                       bg-[#11111b]
                       border border-white/10
                       px-10 py-20
                       shadow-[0_40px_90px_rgba(0,0,0,0.65)]"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Start Building Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI Chatbot
              </span>{" "}
              Today
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Launch smarter conversations, capture more leads,
              and automate customer engagement in minutes.
            </p>

            <p className="mt-3 text-sm text-gray-400">
              No credit card required. Cancel anytime.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate("/signup")}>
                Get Started Free
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/demo")}
              >
                View Live Demo
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
