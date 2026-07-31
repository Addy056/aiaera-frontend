import { Bot, User } from "lucide-react";

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
CLICKABLE LINKS
========================================
*/
const renderMessage = (text = "") => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all transition-colors hover:opacity-80"
          style={{ color: "#2563EB" }}
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

/*
========================================
HELPER
========================================
*/
const isLightColor = (color = "") => {
  if (!color) return false;

  const hex = color.replace("#", "");

  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness =
    (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 180;
};

/*
========================================
MESSAGE BUBBLE
========================================
*/
export default function MessageBubble({
  message,
  chatbot,
}) {
  const rtl =
    isRTLText(message?.text || "");

  const isUser =
    message?.role === "user";

  const theme =
    chatbot?.theme || {};

  const userBubble =
    theme.userBubble || "#7C3AED";

  const botBubble =
    theme.botBubble || "#FFFFFF";

  const textColor =
    theme.textColor || "#0F172A";

  const userTextColor =
    isLightColor(userBubble)
      ? "#0F172A"
      : "#FFFFFF";

  return (
  <div
    className={`flex ${
      isUser ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className="
        max-w-[90%]
        sm:max-w-[85%]

        rounded-2xl
        sm:rounded-3xl

        px-4
        py-3
        sm:px-5
        sm:py-4

        border
        shadow-sm
        transition-all
      "
      style={{
        background: isUser ? userBubble : botBubble,
        color: isUser ? userTextColor : textColor,
        borderColor: "#E2E8F0",
      }}
    >
      <div
        className={`
          flex
          items-start
          gap-2
          sm:gap-3
          ${rtl ? "flex-row-reverse" : ""}
        `}
      >
        {/* ICON */}
        <div
          className="
            w-8
            h-8
            sm:w-9
            sm:h-9

            rounded-lg
            sm:rounded-xl

            overflow-hidden
            flex
            items-center
            justify-center
            shrink-0
          "
          style={{
            background: isUser
              ? "rgba(255,255,255,.18)"
              : "#F1F5F9",
          }}
        >
          {isUser ? (
            <User
              size={14}
              className={
                userTextColor === "#FFFFFF"
                  ? "text-white"
                  : "text-slate-900"
              }
            />
          ) : chatbot?.theme?.logo ? (
            <img
              src={chatbot.theme.logo}
              alt="Bot"
              className="w-full h-full object-cover"
            />
          ) : (
            <Bot
              size={14}
              style={{
                color: userBubble,
              }}
            />
          )}
        </div>

        {/* MESSAGE */}
        <div
          dir={rtl ? "rtl" : "ltr"}
          className={`
            flex-1
            text-sm
            leading-6
            sm:leading-7

            whitespace-pre-wrap
            break-words

            ${
              rtl
                ? "text-right"
                : "text-left"
            }
          `}
        >
          {renderMessage(message?.text || "")}
        </div>
      </div>
    </div>
  </div>
);
}