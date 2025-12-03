import { useState, useRef, useEffect, useMemo } from "react";

export default function ChatbotPreview({ chatbotConfig }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can we assist you today?" },
  ]);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedReply, setStreamedReply] = useState("");

  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const streamedRef = useRef("");

  const API_BASE =
    import.meta.env.VITE_API_URL || "https://aiaera-backend.onrender.com";

  // ✅ ALWAYS USE STUDIO COLORS (NO FALLBACK OVERRIDE)
  const theme = useMemo(() => {
    return {
      background: chatbotConfig?.themeColors?.background || "#0b0b17",
      userBubble: chatbotConfig?.themeColors?.userBubble || "#7f5af0",
      botBubble: chatbotConfig?.themeColors?.botBubble || "#70e1ff",
      text: chatbotConfig?.themeColors?.text || "#ffffff",
      accent: "#00EAFF",
    };
  }, [chatbotConfig?.themeColors]);

  const calendlyLink = chatbotConfig?.calendlyLink;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedReply]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  const isBookingIntent = (text) => {
    const t = text.toLowerCase();
    return (
      t.includes("book") ||
      t.includes("meeting") ||
      t.includes("schedule") ||
      t.includes("appointment") ||
      t.includes("call")
    );
  };

  const sendMessage = () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input;

    const newMessages = [
      ...messages.slice(-6),
      { role: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    setStreamedReply("");
    streamedRef.current = "";

    const chatbotId = chatbotConfig?.id;

    if (!chatbotId) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Chatbot not saved yet." },
      ]);
      setIsStreaming(false);
      return;
    }

    const encodedMessages = encodeURIComponent(JSON.stringify(newMessages));
    const streamUrl = `${API_BASE}/api/chatbot/preview-stream/${chatbotId}?messages=${encodedMessages}`;

    if (eventSourceRef.current) eventSourceRef.current.close();

    const evtSource = new EventSource(streamUrl);
    eventSourceRef.current = evtSource;

    evtSource.addEventListener("token", (e) => {
      try {
        const token = JSON.parse(e.data);
        streamedRef.current += token;
        setStreamedReply(streamedRef.current);
      } catch {}
    });

    evtSource.addEventListener("done", () => {
      const finalText = streamedRef.current.trim();

      const updatedMessages = [
        ...newMessages,
        {
          role: "assistant",
          content: finalText || "⚠️ No response generated.",
        },
      ];

      if (calendlyLink && isBookingIntent(userMessage)) {
        updatedMessages.push({
          role: "assistant",
          content: calendlyLink,
          isLink: true,
        });
      }

      setMessages(updatedMessages);
      setStreamedReply("");
      streamedRef.current = "";
      setIsStreaming(false);
      evtSource.close();
    });

    evtSource.onerror = () => {
      evtSource.close();
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection lost. Try again." },
      ]);
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ ...styles.wrapper, background: theme.background }}>
      <div style={styles.chatbotPreview}>
        {/* HEADER */}
        <div
          style={{
            ...styles.header,
            background: theme.userBubble,
            color: theme.text,
          }}
        >
          {chatbotConfig?.logoUrl && (
            <img src={chatbotConfig.logoUrl} alt="Logo" style={styles.logo} />
          )}
          <span style={{ fontWeight: "bold" }}>
            {chatbotConfig?.name || "Business Assistant"}
          </span>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.role === "user"
                  ? styles.userMsg
                  : styles.assistantMsg),
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor:
                    msg.role === "user"
                      ? theme.userBubble
                      : theme.botBubble,
                  color: theme.text,
                }}
              >
                {msg.isLink ? (
                  <a
                    href={msg.content}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: theme.accent,
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    📅 Book Your Meeting
                  </a>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isStreaming && (
            <div style={{ ...styles.message, ...styles.assistantMsg }}>
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: theme.botBubble,
                  color: theme.text,
                }}
              >
                {streamedReply || "Typing..."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            style={{
              ...styles.textarea,
              color: theme.text,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming}
            style={{
              ...styles.button,
              background: theme.userBubble,
              color: theme.text,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: { display: "flex", height: "100%" },

  chatbotPreview: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    overflow: "hidden",
  },

  header: {
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    width: "36px",
    height: "36px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  message: { display: "flex", maxWidth: "80%" },
  userMsg: { alignSelf: "flex-end" },
  assistantMsg: { alignSelf: "flex-start" },

  bubble: {
    padding: "10px 14px",
    borderRadius: "16px",
    wordBreak: "break-word",
  },

  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  textarea: {
    flex: 1,
    padding: "10px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    outline: "none",
  },

  button: {
    border: "none",
    padding: "0 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
