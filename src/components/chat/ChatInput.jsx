import {
  Send,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useRef,
} from "react";

import { useTheme } from "./common/ThemeProvider";

/*
========================================
CHAT INPUT
========================================
*/

export default function ChatInput({
  value = "",
  onChange,
  onSend,
  loading = false,
  disabled = false,
  placeholder = "Type your message...",
}) {
  const theme = useTheme();

  const textareaRef = useRef(null);

  /*
  ========================================
  AUTO HEIGHT
  ========================================
  */

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height =
      "0px";

    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        160
      )}px`;
  }, [value]);

  /*
  ========================================
  SEND
  ========================================
  */

  const handleSend = () => {
    if (
      loading ||
      disabled ||
      !value.trim()
    )
      return;

    onSend();
  };

  /*
  ========================================
  ENTER
  ========================================
  */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  return (
    <div
      className="
        shrink-0

        border-t

        bg-white

        p-4
      "
      style={{
        borderColor:
          theme.border,
      }}
    >
      <div
        className="
          flex
          items-end
          gap-3

          rounded-3xl

          border

          px-4
          py-3

          transition-all
        "
        style={{
          borderColor:
            theme.border,

          background:
            theme.surface,
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={
            loading ||
            disabled
          }
          placeholder={
            placeholder
          }
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          className="
            max-h-40
            min-h-[24px]

            flex-1

            resize-none

            overflow-y-auto

            bg-transparent

            text-sm

            outline-none
          "
          style={{
            color:
              theme.text,
          }}
        />

        <button
          type="button"
          onClick={
            handleSend
          }
          disabled={
            loading ||
            disabled ||
            !value.trim()
          }
          className="
            flex

            h-11
            w-11

            items-center
            justify-center

            rounded-2xl

            transition-all

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          style={{
            background:
              theme.primary,

            color:
              "#FFFFFF",
          }}
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Send
              size={18}
            />
          )}
        </button>
      </div>
    </div>
  );
}