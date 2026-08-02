import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

/*
========================================
CHAT MESSAGES
========================================
*/

export default function ChatMessages({
  chatbot,
  messages = [],
  loading = false,
  integrations = {},
}) {
  const bottomRef = useRef(null);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  return (
    <div
      className="
        flex-1
        overflow-y-auto

        px-4
        py-5

        sm:px-5
        sm:py-6
      "
    >
      <div
        className="
          mx-auto

          flex
          max-w-3xl
          flex-col

          gap-4
        "
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={
              message.id ||
              `${message.role}-${index}`
            }
            chatbot={chatbot}
            message={message}
            integrations={integrations}
          />
        ))}

        {loading && (
          <TypingIndicator chatbot={chatbot} />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}