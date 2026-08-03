import {
  ShieldCheck,
  X,
} from "lucide-react";

import AssistantAvatar from "./common/AssistantAvatar";
import OnlineIndicator from "./common/OnlineIndicator";
import { useTheme } from "./common/ThemeProvider";

export default function ChatHeader({
  chatbot,
  mode = "live",
  onClose,
}) {
  const theme = useTheme();

  /*
  ========================================
  BRANDING
  ========================================
  */

  const companyName =
    theme.companyName ||
    "Business";

  const assistantName =
    theme.assistantName ||
    `${companyName} Assistant`;

  const subtitle =
    chatbot?.theme?.subtitle ||
    "🟢 Online • Typically replies instantly";

  return (
    <header
      className="
        shrink-0
        style={{
  borderColor: theme.border,
}}
       bg-white/90
backdrop-blur-xl
supports-[backdrop-filter]:bg-white/80
        px-4
        py-5
        sm:px-5
      "
      style={{
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center justify-between">

        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">

          <AssistantAvatar
            chatbot={chatbot}
            size={52}
          />

          <div className="min-w-0">

            {/* COMPANY */}

            <div className="flex items-center gap-2">

              <h2
                className="
                  truncate
                  text-sm
                  font-bold
                  sm:text-base
                "
                style={{
                  color: theme.text,
                }}
              >
                {companyName}
              </h2>

              <ShieldCheck
                size={14}
                color={theme.primary}
              />

            </div>

            {/* STATUS */}

            <div className="mt-1 flex items-center gap-2">

              <OnlineIndicator
                status="online"
              />

              <span
                className="
                  truncate
                  text-xs
                "
                style={{
                  color: theme.muted,
                }}
              >
                {subtitle}
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        {mode === "embed" && (

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-slate-100
            "
          >
            <X
              size={18}
              color={theme.muted}
            />
          </button>

        )}

      </div>
    </header>
  );
}