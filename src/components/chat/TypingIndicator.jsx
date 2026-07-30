import { Bot, Loader2 } from "lucide-react";

export default function TypingIndicator({
  chatbot,
}) {
  const theme =
    chatbot?.theme || {};

  const botName =
    chatbot?.bot_name ||
    theme?.botName ||
    "AI Assistant";

  const logo =
    theme?.logo;

  const accentColor =
    theme?.userBubble || "#7C3AED";

  return (
    <div className="flex justify-start">
      <div
        className="
          max-w-[88%]
          rounded-3xl
          border
          border-slate-200
          bg-white
          px-5
          py-4
          shadow-sm
        "
      >
        <div className="flex items-center gap-3">
          {/* BOT ICON */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
            "
            style={{
              background: logo
                ? "#F8FAFC"
                : accentColor,
            }}
          >
            {logo ? (
              <img
                src={logo}
                alt={botName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Bot
                size={16}
                className="text-white"
              />
            )}
          </div>

          {/* TEXT */}
          <div>
            <p className="text-sm font-medium text-slate-900">
              {botName}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Loader2
                size={14}
                className="animate-spin"
                style={{
                  color: accentColor,
                }}
              />

              <span className="text-xs text-slate-500">
                is typing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}