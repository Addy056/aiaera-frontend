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
  const theme = chatbot?.theme || {};

  return (
    <div
      className={`
        flex
        flex-col
        h-full
        w-full
        overflow-hidden
        rounded-[28px]
        text-[13px]
        sm:text-sm
        border
        border-slate-200
        bg-white
        shadow-[0_18px_60px_-24px_rgba(15,23,42,0.22)]
        ${className}
      `}
      style={{
        background: theme.chatBg || "#FFFFFF",
      }}
    >
      <ChatHeader
        chatbot={chatbot}
        mode={mode}
      />

      <QuickActions
        chatbot={chatbot}
        integrations={integrations}
        onBookAppointment={onBookAppointment}
        onVisitOffice={onVisitOffice}
        onAskServices={onAskServices}
      />

      <ChatMessages
        chatbot={chatbot}
        messages={messages}
        loading={loading}
      />

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