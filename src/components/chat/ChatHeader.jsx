import { Bot, Sparkles } from "lucide-react";

export default function ChatHeader({
  chatbot,
  mode = "live", // "live" | "preview"
}) {
  const theme = chatbot?.theme || {};

  const botName =
    chatbot?.bot_name ||
    theme?.botName ||
    "AI Assistant";

  const logo = theme?.logo;

  const userBubble =
    theme?.userBubble || "#7C3AED";

  return (
    <div className="h-[88px] shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-25"
            style={{
              background: userBubble,
            }}
          />

          <div
            className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm bg-white"
            style={{
              background: logo
                ? "#FFFFFF"
                : userBubble,
            }}
          >
            {logo ? (
              <img
                src={logo}
                alt={botName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Bot
                size={24}
                className="text-white"
              />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {botName}
            </h2>

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>

          <p className="mt-1 truncate text-sm text-slate-500">
            Online now
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex shrink-0">
        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2"
          style={{
            borderColor: "#E2E8F0",
            background:
              mode === "preview"
                ? "#F8FAFC"
                : "#FFFFFF",
          }}
        >
          <Sparkles
            size={14}
            style={{
              color: userBubble,
            }}
          />

          <span
            className="text-xs font-medium"
            style={{
              color: "#475569",
            }}
          >
            {mode === "preview"
              ? "Live Preview"
              : "Powered by AIAERA"}
          </span>
        </div>
      </div>
    </div>
  );
}