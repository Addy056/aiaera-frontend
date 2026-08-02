import MessageRenderer from "./render/MessageRenderer";
import MessageTime from "./common/MessageTime";
import { useTheme } from "./common/ThemeProvider";

/*
========================================
RTL DETECTION
========================================
*/

const isRTLText = (text = "") => {
  const rtlRegex =
    /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

  return rtlRegex.test(text);
};

/*
========================================
MESSAGE BUBBLE
========================================
*/

export default function MessageBubble({
  message,
  integrations = {},
}) {
  const theme = useTheme();

  const isUser =
    message?.role === "user";

  const rtl =
    isRTLText(message?.text || "");

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className="
          max-w-[90%]
          sm:max-w-[85%]

          rounded-3xl

          px-4
          py-3

          shadow-sm

          transition-all
        "
        style={{
          background: isUser
            ? theme.userBubble
            : theme.botBubble,

          color: isUser
            ? theme.isUserBubbleLight
              ? "#0F172A"
              : "#FFFFFF"
            : theme.text,

          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          dir={rtl ? "rtl" : "ltr"}
          className={`
            whitespace-pre-wrap
            break-words

            text-sm
            leading-7

            ${
              rtl
                ? "text-right"
                : "text-left"
            }
          `}
        >
          <MessageRenderer
            message={message}
            integrations={integrations}
          />
        </div>

        {message?.created_at && (
          <div
            className={`
              mt-2

              flex

              ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }
            `}
          >
            <MessageTime
              timestamp={
                message.created_at
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}