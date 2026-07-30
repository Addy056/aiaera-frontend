import ChatHeader from "./ChatHeader";
import QuickActions from "./QuickActions";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

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
  const theme =
    chatbot?.theme || {};

  return (
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
        shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)]
        ${className}
      `}
      style={{
        background:
          theme.chatBg || "#FFFFFF",
      }}
    >
      {/* ===========================
          HEADER
      =========================== */}

      <ChatHeader
        chatbot={chatbot}
        mode={mode}
      />

      {/* ===========================
          QUICK ACTIONS
      =========================== */}

      <QuickActions
        chatbot={chatbot}
        integrations={integrations}
        onBookAppointment={onBookAppointment}
        onVisitOffice={onVisitOffice}
        onAskServices={onAskServices}
      />

      {/* ===========================
          CHAT MESSAGES
      =========================== */}

      <ChatMessages
        chatbot={chatbot}
        messages={messages}
        loading={loading}
      />

      {/* ===========================
          INPUT
      =========================== */}

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
  );
}