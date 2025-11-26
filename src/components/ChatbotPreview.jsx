import { useState, useRef, useEffect } from "react";

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

  // ✅ ✅ BLACK & WHITE DEFAULT UNTIL USER CUSTOMIZES
  const isUserCustomized =
    chatbotConfig?.themeColors?.__custom === true;

  const themeColors = isUserCustomized
    ? chatbotConfig.themeColors
    : {
        background: "#000000", // Black
        userBubble: "#ffffff", // White
        botBubble: "#1a1a1a",  // Soft black
        text: "#ffffff",      // White text
      };

  const calendlyLink = chatbotConfig?.calendlyLink;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedReply]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  // ✅ Detect booking intent
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

      // ✅ AUTO APPEND CLICKABLE CALENDLY LINK
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
    <div style={{ ...styles.wrapper, background: themeColors.background }}>
      <div style={styles.chatbotPreview}>
        <div style={{ ...styles.header, background: themeColors.userBubble }}>
          {chatbotConfig?.logoUrl && (
            <img src={chatbotConfig.logoUrl} alt="Logo" style={styles.logo} />
          )}
          <span style={{ fontWeight: "bold", color: "#000" }}>
            {chatbotConfig?.name || "Business Assistant"}
          </span>
        </div>

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
                      ? themeColors.userBubble
                      : themeColors.botBubble,
                  color: themeColors.text,
                }}
              >
                {msg.isLink ? (
                  <a
                    href={msg.content}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#00eaff",
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
                  backgroundColor: themeColors.botBubble,
                  color: themeColors.text,
                }}
              >
                {streamedReply || "Typing..."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            style={{ ...styles.textarea, color: themeColors.text }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming}
            style={{ ...styles.button, background: themeColors.userBubble }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

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
    color: "white",
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
    color: "black",
    border: "none",
    padding: "0 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
