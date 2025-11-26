import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ChatbotPreview({ chatbotConfig, user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can we assist you today?" },
  ]);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedReply, setStreamedReply] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ FORCE backend only (prevents frontend self-call forever)
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const themeColors = chatbotConfig?.themeColors || {
    background: "#1a1a2e",
    userBubble: "#7f5af0",
    botBubble: "#6b21a8",
    text: "#ffffff",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedReply]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages.slice(-6),
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    setStreamedReply("");

    try {
      const chatbotId = chatbotConfig?.id;

      if (!chatbotId) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Chatbot not saved yet." },
        ]);
        setIsStreaming(false);
        return;
      }

      // ✅ PREPARE BASE64 QUERY FOR BACKEND
      const encodedMessages = encodeURIComponent(
       JSON.stringify(newMessages)
      );


      // ✅ CORRECT SSE CALL → BACKEND ONLY
      const evtSource = new EventSource(
        `${API_BASE}/api/chatbot/preview-stream/${chatbotId}?messages=${encodedMessages}`
      );

      evtSource.addEventListener("token", (e) => {
        const token = JSON.parse(e.data);
        setStreamedReply((prev) => prev + token);
      });

      evtSource.addEventListener("done", () => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: streamedReply },
        ]);
        setStreamedReply("");
        setIsStreaming(false);
        evtSource.close();
      });

      evtSource.addEventListener("error", () => {
        console.error("SSE stream error");
        setIsStreaming(false);
        evtSource.close();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Connection lost. Try again." },
        ]);
      });
    } catch (err) {
      console.error("Preview stream error:", err);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong." },
      ]);
    }
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
        {/* Header */}
        <div style={{ ...styles.header, background: themeColors.userBubble }}>
          {chatbotConfig?.logoUrl && (
            <img src={chatbotConfig.logoUrl} alt="Logo" style={styles.logo} />
          )}
          <span style={{ fontWeight: "bold" }}>
            {chatbotConfig?.name || "Business Assistant"}
          </span>
        </div>

        {/* Messages */}
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
                {msg.content}
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

        {/* Input */}
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

/* -------------------------------- Styles -------------------------------- */

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
    color: "white",
    border: "none",
    padding: "0 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
