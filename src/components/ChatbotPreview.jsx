import { useState, useRef, useEffect } from "react";

/* ✅ AUTO LINK DETECTION (NORMAL TEXT ONLY) */
const linkify = (text) => {
  if (!text) return text;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#00EAFF",
            fontWeight: "bold",
            textDecoration: "underline",
            wordBreak: "break-all",
            overflowWrap: "anywhere",
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function ChatbotPreview({
  chatbotId,
  themeColors = {
    background: "#0b0b17",
    userBubble: "#7f5af0",
    botBubble: "#70e1ff",
    text: "#ffffff",
  },
  logoUrl,
  businessName,
  API_BASE,
  calendlyLink,
}) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can we assist you today?" },
  ]);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedReply, setStreamedReply] = useState("");

  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const streamedRef = useRef("");

  const theme = {
    background: themeColors.background,
    userBubble: themeColors.userBubble,
    botBubble: themeColors.botBubble,
    text: themeColors.text,
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedReply]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  // ✅ BOOKING INTENT
  const isBookingIntent = (text) => {
    const t = text.toLowerCase();
    return (
      t.includes("book") ||
      t.includes("meeting") ||
      t.includes("schedule") ||
      t.includes("appointment") ||
      t.includes("call") ||
      t.includes("proceed") ||
      t.includes("yes")
    );
  };

  // ✅ LOCATION INTENT
  const isLocationIntent = (text) => {
    const t = text.toLowerCase();
    return (
      t.includes("location") ||
      t.includes("address") ||
      t.includes("map") ||
      t.includes("where") ||
      t.includes("office")
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

      const cleanedText = (finalText || "⚠️ No response generated.")
        .replace(/(https?:\/\/\S+)/g, "")
        .replace(/✅/g, "")
        .trim();

      const bookingNow = isBookingIntent(userMessage);
      const locationNow = isLocationIntent(userMessage);

      const updatedMessages = [
        ...newMessages,
        { role: "assistant", content: cleanedText },
      ];

      /* ✅ CALENDLY BUTTON */
      if (bookingNow) {
        updatedMessages.push({
          role: "assistant",
          isLink: true,
          type: "booking",
          url: calendlyLink || "https://calendly.com/aiaera056/30min",
        });
      }

      /* ✅ GOOGLE MAPS BUTTON */
      if (locationNow) {
        updatedMessages.push({
          role: "assistant",
          isLink: true,
          type: "maps",
          url:
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(businessName || "business location"),
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
          {logoUrl && <img src={logoUrl} alt="Logo" style={styles.logo} />}
          <span style={{ fontWeight: "bold" }}>
            {businessName || "Business Assistant"}
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
                    href={msg.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background:
                        msg.type === "maps"
                          ? "#2563eb"
                          : theme.userBubble,
                      color: "#fff",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                    }}
                  >
                    {msg.type === "maps"
                      ? "📍 View Location"
                      : "✅ Book Your Call"}
                  </a>
                ) : (
                  linkify(msg.content)
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
                {linkify(streamedReply) || "Typing..."}
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
            style={{ ...styles.textarea, color: theme.text }}
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
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    maxWidth: "100%",
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
    resize: "none",
  },

  button: {
    border: "none",
    padding: "0 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
