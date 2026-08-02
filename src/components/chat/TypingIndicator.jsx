import AssistantAvatar from "./common/AssistantAvatar";
import { useTheme } from "./common/ThemeProvider";

/*
========================================
TYPING INDICATOR
========================================
*/

export default function TypingIndicator({
  chatbot,
}) {
  const theme = useTheme();

  return (
    <div className="flex justify-start">

      <div className="flex items-end gap-3">

        {/* AVATAR */}

        <AssistantAvatar
          chatbot={chatbot}
          size={40}
        />

        {/* BUBBLE */}

        <div
          className="
            rounded-3xl

            border

            px-5
            py-4

            shadow-sm
          "
          style={{
            background: theme.botBubble,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-2">

            {[0, 1, 2].map((dot) => (

              <span
                key={dot}
                className="
                  h-2.5
                  w-2.5

                  rounded-full

                  animate-bounce
                "
                style={{
                  background:
                    theme.primary,

                  animationDelay:
                    `${dot * 0.15}s`,
                }}
              />

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}