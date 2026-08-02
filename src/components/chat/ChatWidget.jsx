import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import WelcomeScreen from "./common/WelcomeScreen";
import { ThemeProvider } from "./common/ThemeProvider";

export default function ChatWidget({
  mode = "live",
  chatbot = null,
  messages = [],
  loading = false,
  input = "",
  setInput,
  onSend,
  integrations = {},
  placeholder = "Type your message...",
  disabled = false,
  className = "",
  onBookAppointment,
  onVisitOffice,
  onAskServices,
}) {
  /*
  ========================================
  SHOW WELCOME
  ========================================
  */

  const hasUserMessage = messages.some(
    (message) => message.role === "user"
  );

  const showWelcome = !hasUserMessage;

  return (
    <ThemeProvider chatbot={chatbot}>
      <div
        className={`
          flex
          h-full
          w-full
          flex-col
          overflow-hidden

          rounded-[28px]

          border
          border-slate-200

          bg-white

          shadow-[0_18px_60px_-24px_rgba(15,23,42,0.22)]

          ${className}
        `}
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <ChatHeader
          chatbot={chatbot}
          mode={mode}
        />

        {/* ========================================
            BODY
        ======================================== */}

        <main
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {showWelcome ? (
            <WelcomeScreen
              chatbot={chatbot}
              integrations={integrations}
              onBookAppointment={onBookAppointment}
              onVisitOffice={onVisitOffice}
              onAskServices={onAskServices}
            />
          ) : (
            <ChatMessages
              chatbot={chatbot}
              messages={messages}
              loading={loading}
            />
          )}
        </main>

        {/* ========================================
            INPUT
        ======================================== */}

        <ChatInput
          chatbot={chatbot}
          value={input}
          onChange={setInput}
          onSend={onSend}
          loading={loading}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    </ThemeProvider>
  );
}