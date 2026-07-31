import { Send } from "lucide-react";

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

export default function ChatInput({
  value = "",
  onChange,
  onSend,
  loading = false,
  disabled = false,
  placeholder = "Type your message...",
  chatbot,
}) {
  const inputIsRTL =
    isRTLText(value);

  const theme =
    chatbot?.theme || {};

  const accentColor =
    theme.userBubble || "#7C3AED";

  const buttonText =
    isLightColor(accentColor)
      ? "#0F172A"
      : "#FFFFFF";

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      if (
        !loading &&
        !disabled &&
        value.trim()
      ) {
        onSend?.();
      }
    }
  };

  const isDisabled =
    disabled ||
    loading ||
    !value.trim();

  return (
  <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-5">
    <div className="flex items-end gap-2 sm:gap-3">
      <textarea
        rows={1}
        value={value}
        dir={inputIsRTL ? "rtl" : "ltr"}
        placeholder={placeholder}
        disabled={loading || disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`
          flex-1
          resize-none
          rounded-xl
          sm:rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-4
          sm:px-5
          py-3
          sm:py-4
          text-sm
          text-slate-900
          placeholder:text-slate-400
          outline-none
          transition-all
          duration-200
          focus:bg-white
          ${inputIsRTL ? "text-right" : "text-left"}
        `}
        style={{
          minHeight: "48px",
          maxHeight: "140px",
          borderColor: "#E2E8F0",
          boxShadow: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = accentColor;
          e.target.style.boxShadow = `0 0 0 4px ${accentColor}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E2E8F0";
          e.target.style.boxShadow = "none";
        }}
      />

      <button
        type="button"
        onClick={onSend}
        disabled={isDisabled}
        className="
          flex
          h-12
          w-12
          sm:h-14
          sm:w-14
          shrink-0
          items-center
          justify-center
          rounded-xl
          sm:rounded-2xl
          transition-all
          duration-200
        "
        style={{
          background: isDisabled ? "#F1F5F9" : accentColor,
          color: isDisabled ? "#94A3B8" : buttonText,
          cursor: isDisabled ? "not-allowed" : "pointer",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseDown={(e) => {
          if (!isDisabled) e.currentTarget.style.transform = "scale(0.96)";
        }}
        onMouseUp={(e) => {
          if (!isDisabled) e.currentTarget.style.transform = "scale(1.05)";
        }}
      >
        <Send size={18} />
      </button>
    </div>
  </div>
);
}