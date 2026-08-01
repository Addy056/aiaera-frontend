import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatMessages({
  messages = [],
  chatbot,
  loading = false,
  className = "",
}) {
  const messagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  const theme = chatbot?.theme || {};

  const chatBackground =
    theme.chatBg || "#F8FAFC";

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  /*
  ========================================
  PREVENT PAGE SCROLL WHILE
  SCROLLING INSIDE CHAT
  ========================================
  */
  useEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const atTop = scrollTop <= 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1;

      if (
        (scrollingUp && !atTop) ||
        (scrollingDown && !atBottom)
      ) {
        e.stopPropagation();
      }

      if (
        (scrollingUp && atTop) ||
        (scrollingDown && atBottom)
      ) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, []);

  return (
    <div
      ref={messagesRef}
      className={`
        flex-1
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        overscroll-contain
        touch-pan-y
        px-6
        py-6
        space-y-5
        scroll-smooth
        ${className}
      `}
      style={{
        background: chatBackground,
        WebkitOverflowScrolling: "touch",
      }}
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              {theme.logo ? (
                <img
                  src={theme.logo}
                  alt="Bot"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-xl">💬</span>
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Start a conversation
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Ask a question and the AI assistant will reply instantly.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={`${message.role}-${index}`}
              message={message}
              chatbot={chatbot}
            />
          ))}

          {loading && (
            <TypingIndicator chatbot={chatbot} />
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}